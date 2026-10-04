from django.db import transaction
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.exceptions import APIException, ValidationError
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

from .models import OrganizerRoleRequest, User
from .permissions import IsAdminRoleOrStaff
from .serializers import (
    CustomTokenObtainPairSerializer,
    OrganizerRoleRequestCreateSerializer,
    OrganizerRoleRequestSerializer,
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


class OrganizerRoleRequestListCreateView(APIView):
    def get_permissions(self):
        if self.request.method == "GET":
            return [IsAdminRoleOrStaff()]
        return [IsAuthenticated()]

    def get(self, request):
        requests = OrganizerRoleRequest.objects.select_related(
            "user", "reviewed_by"
        )
        request_status = request.query_params.get("status")
        if request_status:
            if request_status not in OrganizerRoleRequest.Status.values:
                raise ValidationError({"status": "Invalid request status."})
            requests = requests.filter(status=request_status)
        return Response(OrganizerRoleRequestSerializer(requests, many=True).data)

    def post(self, request):
        serializer = OrganizerRoleRequestCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            user = User.objects.select_for_update().get(pk=request.user.pk)
            if user.role != User.Role.CUSTOMER:
                raise ValidationError(
                    {"detail": "Only customers can request organizer access."}
                )
            if OrganizerRoleRequest.objects.filter(
                user=user, status=OrganizerRoleRequest.Status.PENDING
            ).exists():
                raise ValidationError(
                    {"detail": "You already have a pending organizer request."}
                )
            role_request = serializer.save(user=user)

        return Response(
            OrganizerRoleRequestSerializer(role_request).data,
            status=status.HTTP_201_CREATED,
        )


class MyOrganizerRoleRequestsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrganizerRoleRequestSerializer

    def get_queryset(self):
        return OrganizerRoleRequest.objects.filter(
            user=self.request.user
        ).select_related("user", "reviewed_by")


class Conflict(APIException):
    status_code = status.HTTP_409_CONFLICT
    default_detail = "The request conflicts with its current state."
    default_code = "conflict"


class OrganizerRoleRequestDecisionView(APIView):
    permission_classes = [IsAdminRoleOrStaff]

    def post(self, request, pk, decision):
        if decision not in ("approve", "reject"):
            raise ValidationError({"decision": "Choose approve or reject."})

        with transaction.atomic():
            try:
                role_request = (
                    OrganizerRoleRequest.objects.select_for_update()
                    .select_related("user")
                    .get(pk=pk)
                )
            except OrganizerRoleRequest.DoesNotExist:
                return Response(
                    {"detail": "Organizer request not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            if role_request.status != OrganizerRoleRequest.Status.PENDING:
                raise Conflict(
                    detail="This organizer request has already been reviewed.",
                    code="request_already_reviewed",
                )

            role_request.status = (
                OrganizerRoleRequest.Status.APPROVED
                if decision == "approve"
                else OrganizerRoleRequest.Status.REJECTED
            )
            role_request.reviewed_at = timezone.now()
            role_request.reviewed_by = request.user
            role_request.save(
                update_fields=("status", "reviewed_at", "reviewed_by")
            )

            if decision == "approve":
                role_request.user.role = User.Role.ORGANIZER
                role_request.user.save(update_fields=("role",))

        return Response(OrganizerRoleRequestSerializer(role_request).data)
