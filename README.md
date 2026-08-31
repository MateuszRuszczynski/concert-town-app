## Authentication API

| Endpoint | Method | Body | Response |
|---|---|---|---|
| `/api/auth/register/` | POST | `{"email":"...","password":"...","password_confirm":"..."}` | `201 {"id":1,"email":"..."}` |
| `/api/auth/login/` | POST | `{"email":"...","password":"..."}` | `200 {"access":"...","refresh":"..."}` |
| `/api/auth/token/refresh/` | POST | `{"refresh":"..."}` | `200 {"access":"...","refresh":"..."}` |
| `/api/auth/logout/` | POST | `{"refresh":"..."}` | `205` |
| `/api/auth/profile/` | GET | — | `200 {"email":"...","role":"..."}` |

**Auth header:** `Authorization: Bearer <access_token>`
