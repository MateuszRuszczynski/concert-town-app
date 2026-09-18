from datetime import datetime, timezone

from django.db import transaction
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import AnonRateThrottle
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.token_blacklist.models import (
    BlacklistedToken,
    OutstandingToken,
)
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import (
    CustomTokenObtainPairSerializer,
    LogoutSerializer,
    RegisterSerializer,
)


class LoginRateThrottle(AnonRateThrottle):
    rate = "5/minute"


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    throttle_classes = [LoginRateThrottle]


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {"id": user.id, "email": user.email},
            status=status.HTTP_201_CREATED,
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data, context={"request": request})

        with transaction.atomic():
            serializer.is_valid(raise_exception=True)
            serializer.validated_data["refresh"].blacklist()
            self.revoke_access_token(request)

        return Response({"message": "Logout successful."}, status=status.HTTP_200_OK)

    def revoke_access_token(self, request):
        access_token = request.auth
        jti = access_token[api_settings.JTI_CLAIM]
        issued_at = datetime.fromtimestamp(access_token["iat"], tz=timezone.utc)
        expires_at = datetime.fromtimestamp(access_token["exp"], tz=timezone.utc)
        outstanding_token, _ = OutstandingToken.objects.get_or_create(
            jti=jti,
            defaults={
                "user": request.user,
                "token": str(access_token),
                "created_at": issued_at,
                "expires_at": expires_at,
            },
        )
        BlacklistedToken.objects.get_or_create(token=outstanding_token)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "id": request.user.id,
            "email": request.user.email,
            "role": request.user.role,
            "first_name": request.user.first_name,
            "last_name": request.user.last_name,
        })
