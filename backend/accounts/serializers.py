from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.db import IntegrityError
from django.core.validators import validate_email
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    email = serializers.EmailField(required=True)

    def validate(self, attrs):
        email_val = attrs.get("email") or attrs.get(self.username_field)
        if not email_val:
            raise serializers.ValidationError({"email": ["This field is required."]})
        try:
            validate_email(email_val)
        except DjangoValidationError:
            raise serializers.ValidationError({"email": ["Enter a valid email address."]})
        email_val = email_val.lower().strip()

        attrs["email"] = email_val
        attrs[self.username_field] = email_val

        return super().validate(attrs)


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField(write_only=True)

    def validate_refresh(self, value):
        try:
            token = RefreshToken(value)
        except TokenError as error:
            raise serializers.ValidationError("Token is invalid or expired.") from error

        request = self.context["request"]
        user_id = getattr(request.user, api_settings.USER_ID_FIELD)

        if str(token.get(api_settings.USER_ID_CLAIM)) != str(user_id):
            raise serializers.ValidationError(
                "Token does not belong to the authenticated user."
            )

        return token


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        min_length=8,
        max_length=128,
        validators=[validate_password],
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        min_length=8,
        max_length=128,
    )

    first_name = serializers.CharField(
        required=False, allow_blank=False, max_length=150, trim_whitespace=True
    )
    last_name = serializers.CharField(
        required=False, allow_blank=False, max_length=150, trim_whitespace=True
    )

    class Meta:
        model = User
        fields = (
            "email",
            "password",
            "password_confirm",
            "first_name",
            "last_name",
        )

    def validate_email(self, value):
        return value.lower().strip()

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError(
                {"password_confirm": "Password fields didn't match."}
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        try:
            user = User.objects.create_user(**validated_data)
            return user
        except IntegrityError:
            raise serializers.ValidationError(
                {"email": "A user with this email already exists."}
            )
