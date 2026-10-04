from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from .models import OrganizerRoleRequest

User = get_user_model()


class RegisterTests(APITestCase):
    def test_register_success(self):
        url = reverse("register")
        data = {
            "email": "new@example.com",
            "password": "TestPass123!",
            "password_confirm": "TestPass123!",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["email"], "new@example.com")
        self.assertTrue(User.objects.filter(email="new@example.com").exists())

    def test_register_creates_customer_role_by_default(self):
        url = reverse("register")
        data = {
            "email": "customer@example.com",
            "password": "TestPass123!",
            "password_confirm": "TestPass123!",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            User.objects.get(email="customer@example.com").role, "customer"
        )

    def test_register_duplicate_email(self):
        User.objects.create_user(email="dup@example.com", password="pass12345")
        url = reverse("register")
        data = {
            "email": "dup@example.com",
            "password": "TestPass123!",
            "password_confirm": "TestPass123!",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_password_mismatch(self):
        url = reverse("register")
        data = {
            "email": "mismatch@example.com",
            "password": "TestPass123!",
            "password_confirm": "WrongPass123!",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LoginTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="login@example.com", password="TestPass123!"
        )

    def test_login_success(self):
        url = reverse("token_obtain_pair")
        response = self.client.post(
            url,
            {"email": "login@example.com", "password": "TestPass123!"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_login_wrong_password(self):
        url = reverse("token_obtain_pair")
        response = self.client.post(
            url, {"email": "login@example.com", "password": "wrong"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class LogoutTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="logout@example.com", password="TestPass123!"
        )

    def test_logout_blacklists_refresh_token(self):
        login_response = self.client.post(
            reverse("token_obtain_pair"),
            {"email": "logout@example.com", "password": "TestPass123!"},
            format="json",
        )
        access_token = login_response.data["access"]
        refresh_token = login_response.data["refresh"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")
        logout_response = self.client.post(
            reverse("token_blacklist"),
            {"refresh": refresh_token},
            format="json",
        )

        self.assertEqual(logout_response.status_code, status.HTTP_200_OK)

        refresh_response = self.client.post(
            reverse("token_refresh"),
            {"refresh": refresh_token},
            format="json",
        )
        self.assertEqual(refresh_response.status_code, status.HTTP_401_UNAUTHORIZED)

        profile_response = self.client.get(reverse("profile"))
        self.assertEqual(profile_response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_requires_authentication(self):
        refresh_token = RefreshToken.for_user(self.user)

        response = self.client.post(
            reverse("token_blacklist"),
            {"refresh": str(refresh_token)},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_cannot_logout_with_another_users_refresh_token(self):
        other_user = User.objects.create_user(
            email="other-logout@example.com", password="TestPass123!"
        )
        user_login = self.client.post(
            reverse("token_obtain_pair"),
            {"email": "logout@example.com", "password": "TestPass123!"},
            format="json",
        )
        other_login = self.client.post(
            reverse("token_obtain_pair"),
            {"email": other_user.email, "password": "TestPass123!"},
            format="json",
        )
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {user_login.data['access']}"
        )

        response = self.client.post(
            reverse("token_blacklist"),
            {"refresh": other_login.data["refresh"]},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        profile_response = self.client.get(reverse("profile"))
        self.assertEqual(profile_response.status_code, status.HTTP_200_OK)


class ProfileTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="profile@example.com", password="TestPass123!"
        )

    def test_profile_authenticated(self):
        self.client.force_authenticate(user=self.user)
        url = reverse("profile")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "profile@example.com")

    def test_profile_unauthenticated(self):
        url = reverse("profile")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class OrganizerRoleRequestTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="customer@example.com")
        self.admin = User.objects.create_user(
            email="admin@example.com",
            role=User.Role.ADMIN,
        )
        self.url = reverse("organizer-role-request-list")

    def test_customer_can_request_organizer_role(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            self.url,
            {"message": "I want to host concerts."},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], OrganizerRoleRequest.Status.PENDING)
        self.assertEqual(response.data["user_id"], self.user.id)
        self.assertEqual(
            OrganizerRoleRequest.objects.get().message,
            "I want to host concerts.",
        )
        self.user.refresh_from_db()
        self.assertEqual(self.user.role, User.Role.CUSTOMER)

    def test_unauthenticated_user_cannot_request_organizer_role(self):
        response = self.client.post(self.url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_cannot_create_second_pending_request(self):
        self.client.force_authenticate(user=self.user)
        self.client.post(self.url, {}, format="json")
        response = self.client.post(self.url, {}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(OrganizerRoleRequest.objects.count(), 1)

    def test_organizer_cannot_request_organizer_role(self):
        self.user.role = User.Role.ORGANIZER
        self.user.save(update_fields=("role",))
        self.client.force_authenticate(user=self.user)

        response = self.client.post(self.url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_only_admin_can_list_requests(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_can_view_only_their_own_requests(self):
        own_request = OrganizerRoleRequest.objects.create(user=self.user)
        another_user = User.objects.create_user(email="another@example.com")
        OrganizerRoleRequest.objects.create(user=another_user)
        self.client.force_authenticate(user=self.user)

        response = self.client.get(reverse("my-organizer-role-requests"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["id"], own_request.id)

    def test_admin_approval_changes_role_and_records_reviewer(self):
        role_request = OrganizerRoleRequest.objects.create(user=self.user)
        self.client.force_authenticate(user=self.admin)

        response = self.client.post(
            reverse(
                "organizer-role-request-decision",
                kwargs={"pk": role_request.pk, "decision": "approve"},
            ),
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], OrganizerRoleRequest.Status.APPROVED)
        self.user.refresh_from_db()
        role_request.refresh_from_db()
        self.assertEqual(self.user.role, User.Role.ORGANIZER)
        self.assertEqual(role_request.reviewed_by, self.admin)
        self.assertIsNotNone(role_request.reviewed_at)

    def test_admin_rejection_keeps_customer_role(self):
        role_request = OrganizerRoleRequest.objects.create(user=self.user)
        self.client.force_authenticate(user=self.admin)

        response = self.client.post(
            reverse(
                "organizer-role-request-decision",
                kwargs={"pk": role_request.pk, "decision": "reject"},
            ),
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], OrganizerRoleRequest.Status.REJECTED)
        self.user.refresh_from_db()
        self.assertEqual(self.user.role, User.Role.CUSTOMER)

    def test_non_admin_cannot_review_requests(self):
        role_request = OrganizerRoleRequest.objects.create(user=self.user)
        self.client.force_authenticate(user=self.user)

        response = self.client.post(
            reverse(
                "organizer-role-request-decision",
                kwargs={"pk": role_request.pk, "decision": "approve"},
            ),
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_reviewed_request_cannot_be_decided_again(self):
        role_request = OrganizerRoleRequest.objects.create(
            user=self.user,
            status=OrganizerRoleRequest.Status.REJECTED,
        )
        self.client.force_authenticate(user=self.admin)

        response = self.client.post(
            reverse(
                "organizer-role-request-decision",
                kwargs={"pk": role_request.pk, "decision": "approve"},
            ),
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.user.refresh_from_db()
        self.assertEqual(self.user.role, User.Role.CUSTOMER)
