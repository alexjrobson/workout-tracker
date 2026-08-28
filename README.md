# Iron Log (workout-tracker)

A full-stack workout tracker for planning sessions, logging sets, rating effort (RPE), and tracking strength progress over time.

- **Backend:** Java 24, Spring Boot 3.5, PostgreSQL, JWT auth
- **Frontend:** React 19 (Create React App) at `http://localhost:3000`
- **API:** `http://localhost:8080`

---

## Features

- **User accounts** — register and login with JWT
- **Exercise catalog** — ~40 common lifts, searchable by name and muscle group
- **Plan workouts** — pick lifts, set target sets × reps × weight
- **Log sessions** — per-set weight, reps, and made/missed result
- **Session RPE** — rate overall difficulty (1–10) with notes
- **History** — review planned and completed sessions
- **Progress** — estimated 1RM trend per lift (completed sessions only)

---

## Prerequisites

| Tool | Version / notes |
|---|---|
| Java | 24 (JDK on `PATH`, or set `JAVA_HOME`) |
| Maven | Use included wrapper: `./mvnw` / `mvnw.cmd` |
| PostgreSQL | Running locally on port 5432 |
| Node.js | LTS recommended (for the React frontend) |

---

## Quick start

### 1. Database

Create the database and user in PostgreSQL:

```sql
CREATE DATABASE workoutdb;
CREATE USER workout_user WITH PASSWORD 'strongpassword';
GRANT ALL PRIVILEGES ON DATABASE workoutdb TO workout_user;
```

Connection settings live in `src/main/resources/application.properties`. Hibernate `ddl-auto=update` creates and updates tables on startup.

### 2. Backend (API)

From the project root:

```bash
# Windows (if mvn is not on PATH, use mvnw.cmd)
set JAVA_HOME=C:\path\to\jdk-24
mvnw.cmd spring-boot:run

# macOS / Linux
./mvnw spring-boot:run
```

API runs at **http://localhost:8080**.

Run tests:

```bash
mvnw.cmd test
```

### 3. Frontend (UI)

In a second terminal:

```bash
cd workout-tracker-frontend
npm install
npm start
```

Open **http://localhost:3000**, create an account, and plan your first session.

Both processes must stay running — the UI talks to the API on port 8080.

---

## App flow

```
Login → Plan (catalog) → Session (log sets + RPE) → Finish → History / Progress
```

| Screen | Route | What it does |
|---|---|---|
| Today | `/` | Weekly volume, avg RPE, missed sets; today's planned session |
| Plan | `/plan` | Build a workout from the exercise library |
| Session | `/session/:id` | Log each set; rate session RPE; finish or save draft |
| History | `/history` | All sessions (planned and completed) |
| Progress | `/progress` | Estimated 1RM trend for a chosen lift |

**Session statuses**

- `PLANNED` — saved plan, still editable
- `COMPLETED` — finished session; counts toward progress charts

**Metrics**

- **Volume** — sum of (weight × reps) across all sets, in kg·reps
- **RPE** — Rate of Perceived Exertion, 1 (easy) to 10 (max effort)
- **Est. 1RM** — Epley formula: `weight × (1 + reps / 30)`

---

## Project structure

```
workout-tracker/
├── src/main/java/com/example/workout_tracker/
│   ├── controller/       # REST endpoints (auth, workouts, catalog, progress)
│   ├── config/           # Security, catalog seed, schema patches
│   ├── dto/              # Request/response objects
│   ├── model/            # JPA entities (User, Workout, WorkoutExercise, WorkoutSet, …)
│   ├── repository/       # Spring Data repositories
│   ├── security/         # JWT filter and utilities
│   └── service/          # User lookup, workout mapping
├── src/main/resources/
│   └── application.properties
├── src/test/
└── workout-tracker-frontend/
    └── src/
        ├── api/          # fetch wrappers for auth, workouts, catalog, progress
        ├── components/   # pages (Home, Plan, Session, History, Progress)
        └── utils/        # formatting helpers
```

---

## API reference

All endpoints except `/auth/**` require a JWT in the header:

```
Authorization: Bearer <token>
```

### Auth (public)

| Method | Path | Body |
|---|---|---|
| POST | `/auth/register` | `{ "username", "password" }` |
| POST | `/auth/login` | `{ "username", "password" }` |

Returns `{ "token": "..." }`.

### Workouts

| Method | Path | Description |
|---|---|---|
| GET | `/api/workouts` | List current user's workouts |
| GET | `/api/workouts/{id}` | Get one workout (must be owned by caller) |
| POST | `/api/workouts` | Create workout |
| PUT | `/api/workouts/{id}` | Update workout |
| DELETE | `/api/workouts/{id}` | Delete workout |

Example create (plan a session):

```json
POST /api/workouts
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Upper push",
  "date": "2026-08-29",
  "status": "PLANNED",
  "exercises": [
    {
      "catalogId": 11,
      "name": "Barbell Bench Press",
      "sortOrder": 0,
      "targetSets": 3,
      "targetReps": 8,
      "targetWeight": 80,
      "sets": [
        { "setNumber": 1, "reps": 8, "weight": 80, "failed": false },
        { "setNumber": 2, "reps": 8, "weight": 80, "failed": false },
        { "setNumber": 3, "reps": 8, "weight": 80, "failed": false }
      ]
    }
  ]
}
```

To complete a session, `PUT` the same workout with `"status": "COMPLETED"`, `"sessionRpe": 7`, and updated set values.

### Catalog

| Method | Path | Query params |
|---|---|---|
| GET | `/api/catalog/exercises` | `q`, `muscleGroup` (both optional) |

### Progress

| Method | Path | Query params |
|---|---|---|
| GET | `/api/progress` | `catalogId` (required) |

Returns up to 12 completed sessions for that lift with volume, top set, estimated 1RM, and trend vs previous (`up` / `same` / `down`).

---

## Configuration

`src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/workoutdb
spring.datasource.username=workout_user
spring.datasource.password=strongpassword
spring.jpa.hibernate.ddl-auto=update

jwt.secret=mysecretkey123mysecretkey123mysecretkey123
jwt.expiration=36000000
```

Change database credentials and JWT secret for non-local use.

---

## Troubleshooting

| Problem | Likely cause |
|---|---|
| `ERR_CONNECTION_REFUSED` on `:3000` | Frontend not running — run `npm start` in `workout-tracker-frontend` |
| API errors / blank data in UI | Backend not running on `:8080` |
| `release version 24 not supported` | Point `JAVA_HOME` at JDK 24 |
| `npm` not found | Install Node.js LTS and open a new terminal |
| Progress page empty | Only **completed** sessions count; finish a session first |
| Login works but workouts 401 | Token missing or expired — log in again |

---

## License

Personal / educational project. No license specified.
