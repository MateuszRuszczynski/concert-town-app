# Concert Town

| Endpoint | Method | Body | Response |
|---|---|---|---|
| `/api/auth/register/` | POST | `{"email":"...","password":"...","password_confirm":"..."}` | `201 {"id":1,"email":"..."}` |
| `/api/auth/login/` | POST | `{"email":"...","password":"..."}` | `200 {"access":"...","refresh":"..."}` |
| `/api/auth/token/refresh/` | POST | `{"refresh":"..."}` | `200 {"access":"...","refresh":"..."}` |
| `/api/auth/logout/` | POST | `{"refresh":"..."}` | `205` |
| `/api/auth/profile/` | GET | — | `200 {"email":"...","role":"..."}` |
| `/api/auth/organizer-requests/` | POST | `{"message":"..."}` (optional) | Creates the signed-in customer's pending organizer-role request |
| `/api/auth/organizer-requests/` | GET | Admin only; optional status filter (`pending`, `approved`, or `rejected`) | Lists organizer-role requests |
| `/api/auth/organizer-requests/mine/` | GET | Authenticated user | Lists only the signed-in user's requests and their review status |
| `/api/auth/organizer-requests/{id}/approve/` | POST | Admin only | Approves a pending request and changes the requester role to `organizer` |
| `/api/auth/organizer-requests/{id}/reject/` | POST | Admin only | Rejects a pending request without changing the requester role |

Concert Town is an application for discovering, organizing, and attending events.
Users can browse events, register for events, manage events they organize, and view
event participants when they are authorized to do so.

The repository contains a Django REST API and a Vite-powered React frontend. The
project is being developed incrementally, so some frontend event workflows are
still backed by local storage while the backend API continues to grow.

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
- Participant access for event organizers and admins.
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
│   ├── .dockerignore
│   ├── .env.example
│   ├── docker-compose.yml
│   ├── dockerfile
│   ├── manage.py
│   ├── requirements.in
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
│   ├── package-lock.json
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

## Install backend dependencies locally

The pinned dependencies are listed in `backend/requirements.txt`. To install
them into a virtual environment without Docker:

```bash
cd backend
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

`requirements.in` lists the direct dependencies, and `requirements.txt` is the
locked file generated from it by pip-tools. If you change dependencies, install
pip-tools in the active virtual environment, update `requirements.in`, then
recompile and synchronize the environment:

```bash
python -m pip install pip-tools
pip-compile --output-file=requirements.txt requirements.in
pip-sync requirements.txt
```

Use `pip-sync` only inside the project virtual environment; it uninstalls
packages that are not listed in `requirements.txt`. Docker installs the pinned
requirements automatically when building the backend image.

## 2. Start the development backend and PostgreSQL with Docker Compose

The Compose setup is for local development only; it uses Django's development
server and serves uploaded media through Django. The Compose file is located in
`backend/`. Create a local environment file from the
example and set a private Django secret and local database password before
starting:

```bash
cd backend
cp .env.example .env
openssl rand -base64 48
# Put the generated value in SECRET_KEY in .env
docker compose up --build
```

Keep `backend/.env` private; it is ignored by Git. `DEBUG` defaults to `False`;
set it to `True` in this local development file if you need Django to serve
uploaded media. Compose routes the database connection to the `db` service,
waits for PostgreSQL to become healthy, and runs migrations before starting
Django. The web container runs as a non-root user. PostgreSQL is published on
port `5432` for local development tools.

The API will be available at `http://localhost:8000`.

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
npm ci
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

Backend configuration is read from `backend/.env`:

| Variable            | Purpose                                                        |
| ------------------- | -------------------------------------------------------------- |
| `SECRET_KEY`        | Django signing key; replace the example with a private value   |
| `DEBUG`             | Enables debug mode only when set to `True`                     |
| `ALLOWED_HOSTS`     | Comma-separated Django host names                              |
| `POSTGRES_DB`       | PostgreSQL database name                                       |
| `POSTGRES_USER`     | PostgreSQL user                                                |
| `POSTGRES_PASSWORD` | PostgreSQL password                                            |
| `POSTGRES_HOST`     | PostgreSQL host (`db` in Compose; use `localhost` outside it)  |
| `POSTGRES_PORT`     | PostgreSQL port                                                |

When running Django directly on your host, set `POSTGRES_HOST=localhost` in
`backend/.env`; use `POSTGRES_HOST=db` when starting the Compose stack.

The previously committed Django key must be considered compromised. Configure a
new key in each deployment environment; changing the setting does not rotate
keys already deployed or remove the old value from Git history. Rotating the key
invalidates tokens signed with the previous key.

This Compose setup is not suitable for production. Use a production application
server and deployment-managed migrations, and serve uploaded media through
object storage or a dedicated web server. Django's `DEBUG=True` media serving
here is only a development convenience; WhiteNoise is for static files, not
user-uploaded media.

## API rate limits

The API applies broad anonymous and authenticated quotas, with stricter limits
for account registration (5/hour per IP), event bookings (10/hour per user),
and organizer-role requests (3/day per user). Login has its own limit of 20
attempts per minute per IP.

The configured local-memory cache stores throttle state in each process. It is
appropriate for the single-process development server, but limits will not be
shared across multiple workers or application instances. Use a shared cache such
as Redis for multi-worker deployments.

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
| DELETE      | `/api/events/{id}/`                          | Deactivate an event and preserve registrations | Event organizer or admin |
| GET         | `/api/events/my/`                            | List events organized by the current user | Organizer or admin       |
| GET         | `/api/events/my/active/`                     | List the organizer's active events        | Organizer or admin       |
| GET         | `/api/events/my/inactive/`                   | List the organizer's inactive events      | Organizer or admin       |
| GET         | `/api/events/categories/`                    | List categories                           | None                     |
| POST        | `/api/events/categories/`                    | Create a category                         | Admin                    |
| GET         | `/api/events/event/{event_id}/participants/` | List event participants                   | Event organizer or admin |

Event list supports these query parameters:

- `category=<slug>`
- `category_id=<id>`
- `organizer=<user_id>` or `organizer_id=<user_id>`
- `search=<term>` or `q=<term>`
- `ordering=starts_at`, `title`, `created_at`, or `price` (prefix with `-` for descending order)

The organizer event list also supports `status=active|inactive` and
`is_active=true|false`.

`starts_at` is the single required start timestamp; the legacy `date` field has
been removed. `ends_at` is optional and must be strictly later than `starts_at`
when supplied. New or changed times must be in the future. Existing timestamps
can be sent back unchanged when editing a past event, including deactivation or
title corrections. Event responses expose the owner as `organizer_id`.

`available_seats` is read-only. The server initializes it to `total_seats` and
recalculates it from registrations when an organizer changes capacity. Capacity
cannot be reduced below the number of registrations. Booking, capacity changes,
deactivation, and cancellation lock the event row in PostgreSQL to serialize
concurrent changes.

Location is required when creating an event. Use either `"online"` or an object
with non-empty string fields `city` (at most 100 characters) and `venue` (at most
255 characters). Leading and trailing whitespace is removed. For multipart image
uploads, send the location object as a JSON-encoded form field.

Event images must be JPEG (`.jpg` or `.jpeg`), PNG, or WebP, no larger than 5 MB.
The image content is verified and must match the extension.

`DELETE` returns `204` and sets `is_active=False`; it does not remove the event or
its registrations. Inactive events are hidden from public listings. Their
details remain accessible to their organizer, admins, and registered attendees.
Direct database deletion through Django's ORM is protected when registrations
exist, and organizer accounts with events cannot be deleted through the ORM.

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

Registration responses include a lightweight nested `event` object with `id`,
`title`, `starts_at`, `location`, `image`, and `is_active`. The frontend uses the
nested ID when loading details or canceling a registration.

Registration cancellation is allowed only before `starts_at`, including for an
inactive event. Once an event has started, cancellation returns `400` and keeps
the registration and seat count unchanged. Successful cancellation returns a
seat exactly once and preserves other event fields.

---

# Authentication and Authorization

Authentication uses short-lived JWT access tokens and refresh tokens:

- Access tokens expire after 15 minutes.
- Refresh tokens expire after 7 days.
- Refresh-token rotation is enabled.
- Rotated and logged-out refresh tokens are blacklisted.
- Logging out immediately revokes the submitted refresh token and the current access
  token.

Active events are publicly readable. Event creation and modification require an
organizer or administrator, and object-level checks ensure organizers can only modify
their own events. Participant lists are visible to the event organizer and admins.

---

# Database and Migrations

PostgreSQL is the development database and Django migrations are stored per app.
The development Compose command applies migrations automatically. For local
development outside Compose, migrations can be run manually:

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

Existing migrations cover the accounts, events, bookings, and JWT token blacklist
apps. Do not edit generated migration files manually unless there is a specific
database migration reason to do so.

The event review migrations preserve existing `starts_at` values, otherwise copy
`date` into `starts_at`, and then remove `date`. Events missing both timestamps
are deactivated and receive their `created_at` timestamp as a historical
fallback; an organizer must set a future start before reopening registrations.
Seat counts are reconciled against actual registrations. If a legacy event has
more registrations than capacity, capacity is raised to the registration count
to preserve all bookings. These data migrations run once; they do not re-seed
or delete events. The `seed_data` command also preserves existing registrations
and derives remaining seats from them when rerun.

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
