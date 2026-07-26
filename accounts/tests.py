from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

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
