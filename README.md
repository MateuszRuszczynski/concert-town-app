# Concert Town

> **Type:** Full-stack event management application
> **Main stack:** Django REST Framework + React + PostgreSQL

Concert Town is an application for discovering, organizing, and attending events.
Users can browse events, register for events, manage events they organize, and view
event participants when they are authorized to do so.

The repository contains a Django REST API and a Vite-powered React frontend. The
project is being developed incrementally, so some frontend event workflows are still
backed by local storage while the backend API continues to grow.

# About the Project

Concert Town supports three user roles:

- **Customer** - browse events and register for them.
- **Organizer** - create and manage events and view their participants.
- **Admin** - administrative access, including organizer-level event operations.

The current backend includes:

- Email-based registration and JWT authentication.
- Access and refresh token rotation.
- Refresh-token blacklisting on logout.
- Event and category management.
- Event registration and cancellation.
- Organizer-specific event lists.
- Participant access restricted to the event organizer.
- Search, filtering, ordering, pagination, and event image uploads.

# Tech Stack

## Backend

- Python 3.12 in Docker
- Django 6
- Django REST Framework
- Simple JWT
- django-filter
- drf-spectacular
- Pillow

## Frontend

- React 19
- TypeScript
- Vite
- React Router
- Sass
- Radix UI
- Lucide React

## Database

- PostgreSQL 15
- Django ORM and migrations

## Infrastructure

- Docker
- Docker Compose

## Testing

- Django `APITestCase`
- Django test runner

# Project Structure

```text
concert-town-app/
├── backend/
│   ├── accounts/       # Users, registration, JWT authentication, profile
│   ├── bookings/       # Event registrations and participant access
│   ├── config/         # Django settings, root URLs, ASGI and WSGI config
│   ├── events/         # Events, categories, filtering, permissions and serializers
│   ├── docker-compose.yml
│   ├── dockerfile
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── public/          # Static assets and fonts
│   ├── src/
│   │   ├── api/         # HTTP client and authentication API services
│   │   ├── components/  # Reusable UI components
│   │   ├── contexts/    # Auth, event, notification and theme state
│   │   ├── hooks/       # Reusable React hooks
│   │   ├── pages/       # Application routes and page-level UI
│   │   ├── styles/      # Global Sass styles and themes
│   │   └── types/       # TypeScript domain types
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

# Directory Responsibilities

```text
backend/accounts/
	User model, registration, login, token refresh, logout and profile endpoints.

backend/events/
	Event and category models, serializers, filtering, permissions and event views.

backend/bookings/
	Event registration model and endpoints for registering, cancelling and viewing
	registrations and participants.

frontend/src/api/
	Backend HTTP client and authentication service functions.

frontend/src/pages/
	User-facing route screens such as Events, Calendar, Dashboard and EventPage.
```

# Requirements

## Required

- Python 3.12+
- Node.js and npm
- Git

## Recommended

- Docker Desktop with Docker Compose

# Getting Started

## 1. Clone the repository

```bash
git clone <repository-url>
cd concert-town-app
```

## 2. Start the backend and PostgreSQL with Docker Compose

The Compose file is located in `backend/`:

```bash
cd backend
docker compose up --build
```

The API will be available at `http://localhost:8000` and PostgreSQL at
`localhost:5432`.

Run migrations in another terminal:

```bash
cd backend
docker compose exec web python manage.py migrate
```

Create an administrator when needed:

```bash
docker compose exec web python manage.py createsuperuser
```

Stop the services with:

```bash
docker compose down
```

To remove the PostgreSQL volume as well:

```bash
docker compose down -v
```

## 3. Start the frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server normally runs at `http://localhost:5173`.

The frontend reads the backend base URL from `VITE_API_BASE_URL`. For local API
development, create `frontend/.env.local` with:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Restart Vite after changing environment variables.

---

# Environment and Local Services

The current Compose configuration provides these local services:

| Service  | Host address            | Purpose                   |
| -------- | ----------------------- | ------------------------- |
| `web`    | `http://localhost:8000` | Django development server |
| `db`     | `localhost:5432`        | PostgreSQL database       |
| frontend | `http://localhost:5173` | Vite development server   |

The development database currently uses the Compose values below:

| Variable            | Value             |
| ------------------- | ----------------- |
| `POSTGRES_DB`       | `concert_town_db` |
| `POSTGRES_USER`     | `postgres`        |
| `POSTGRES_PASSWORD` | `postgres`        |

These are development-only values. Production deployments must move secrets and
database configuration to environment variables or a secrets manager.

---

# Running the Application

## Backend commands

Run Django management commands from `backend/`:

```bash
python manage.py check
python manage.py makemigrations
python manage.py migrate
python manage.py test
```

When using the Compose environment, prefix commands with:

```bash
docker compose exec web
```

Example:

```bash
docker compose exec web python manage.py test accounts events bookings
```

## Frontend commands

```bash
npm run dev       # Start the Vite development server
npm run build     # Type-check and create a production build
npm run lint      # Run ESLint
npm run preview   # Preview the production build locally
```

---

# API Documentation

The backend exposes an OpenAPI schema and interactive documentation:

| Resource       | URL                                 |
| -------------- | ----------------------------------- |
| Swagger UI     | `http://localhost:8000/api/docs/`   |
| ReDoc          | `http://localhost:8000/api/redoc/`  |
| OpenAPI schema | `http://localhost:8000/api/schema/` |
| Django admin   | `http://localhost:8000/admin/`      |

Protected endpoints use:

```http
Authorization: Bearer <access_token>
```

# API Endpoints

## Authentication

| Method | Endpoint                   | Description                      | Authentication |
| ------ | -------------------------- | -------------------------------- | -------------- |
| POST   | `/api/auth/register/`      | Create a customer account        | None           |
| POST   | `/api/auth/login/`         | Obtain access and refresh tokens | None           |
| POST   | `/api/auth/token/refresh/` | Rotate the access token          | Refresh token  |
| POST   | `/api/auth/logout/`        | Revoke the current token pair    | Required       |
| GET    | `/api/auth/profile/`       | Get the current user profile     | Required       |

Registration example:

```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "password_confirm": "Password123!",
  "first_name": "Alex",
  "last_name": "Morgan"
}
```

Login example:

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

## Events and categories

| Method      | Endpoint                                     | Description                               | Authentication           |
| ----------- | -------------------------------------------- | ----------------------------------------- | ------------------------ |
| GET         | `/api/events/`                               | List active events                        | None                     |
| POST        | `/api/events/`                               | Create an event                           | Organizer or admin       |
| GET         | `/api/events/{id}/`                          | Retrieve an event                         | None                     |
| PATCH / PUT | `/api/events/{id}/`                          | Update an event                           | Event organizer or admin |
| DELETE      | `/api/events/{id}/`                          | Delete an event                           | Event organizer or admin |
| GET         | `/api/events/my/`                            | List events organized by the current user | Organizer or admin       |
| GET         | `/api/events/my/active/`                     | List the organizer's active events        | Organizer or admin       |
| GET         | `/api/events/my/inactive/`                   | List the organizer's inactive events      | Organizer or admin       |
| GET         | `/api/events/categories/`                    | List categories                           | None                     |
| POST        | `/api/events/categories/`                    | Create a category                         | Organizer or admin       |
| GET         | `/api/events/event/{event_id}/participants/` | List event participants                   | Event organizer          |

Event list supports these query parameters:

- `category=<slug>`
- `category_id=<id>`
- `organizer=<user_id>` or `organizer_id=<user_id>`
- `is_active=true|false`
- `search=<term>` or `q=<term>`
- `ordering=date`, `title`, `created_at`, or `price`

The organizer event list also supports `status=active|inactive` and
`is_active=true|false`.

List responses are paginated and use the standard DRF shape:

```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": []
}
```

## Bookings

| Method | Endpoint                          | Description                            | Authentication     |
| ------ | --------------------------------- | -------------------------------------- | ------------------ |
| POST   | `/api/bookings/register/`         | Register the current user for an event | Required           |
| GET    | `/api/bookings/my-registrations/` | List the current user’s registrations  | Required           |
| DELETE | `/api/bookings/cancel/{id}/`      | Cancel a registration                  | Registration owner |

---

# Authentication and Authorization

Authentication uses short-lived JWT access tokens and refresh tokens:

- Access tokens expire after 15 minutes.
- Refresh tokens expire after 7 days.
- Refresh-token rotation is enabled.
- Rotated and logged-out refresh tokens are blacklisted.
- Logging out immediately revokes the submitted refresh token and the current access
  token.

Safe event methods are publicly readable. Event creation and modification require an
organizer or administrator, and object-level checks ensure organizers can only modify
their own events. Participant lists are visible only to the event organizer.

---

# Database and Migrations

PostgreSQL is the development database and Django migrations are stored per app:

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

Existing migrations cover the accounts, events, bookings, and JWT token blacklist
apps. Do not edit generated migration files manually unless there is a specific
database migration reason to do so.

---

# Running Tests

Run all backend tests:

```bash
cd backend
docker compose exec web python manage.py test
```

Run a focused app suite:

```bash
docker compose exec web python manage.py test accounts
docker compose exec web python manage.py test events
docker compose exec web python manage.py test bookings
```

The tests cover registration, login, profiles, logout token invalidation, event
listing and filtering, event permissions, and booking behaviour.

---

# Development Workflow

```text
Requirement
	↓
Implementation
	↓
Tests
	↓
Review
	↓
Merge
```

Development guidelines:

- Keep changes focused on one feature or bug.
- Add or update tests when behaviour changes.
- Run backend tests and frontend checks before opening a pull request.
- Keep secrets out of the repository.
- Update this README when setup, API behaviour, or architecture changes.
- Do not commit generated build output or local environment files.

---

# Team

| Name                | Role            |
| ------------------- | --------------- |
| Karim Khelles       | Project Manager |
| Mateusz Ruszczyński | Backend developer       |
| Yulya Nudyk       | Frontend developer       |
| Vitalii  Ivanchenko  | Backend developer       |
| Ewa Karnia       | QA       |
| Pavlo Kovalenko      | Data analyst       |

---

# Important

This README describes the current implementation, not a target architecture. Keep it
aligned with the codebase as new requirements, integrations, and workflows are added.
