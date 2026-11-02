from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken


class RevocableJWTAuthentication(JWTAuthentication):
    def get_validated_token(self, raw_token):
        validated_token = super().get_validated_token(raw_token)
        jti = validated_token.get(api_settings.JTI_CLAIM)

        if BlacklistedToken.objects.filter(token__jti=jti).exists():
            raise InvalidToken("Token has been revoked.")

        return validated_token
