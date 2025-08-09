# workout-tracker

## Workout Tracker API

A Java Spring Boot REST API for tracking workouts, exercises, and progress over time.
Built with **Java 24**, **Spring Boot**, and **PostgreSQL** — designed for scalability and future integration with a full-stack front end.

---

### 🚀 Features

* **CRUD operations** for Workouts and Exercises
* **DTO-based design** for cleaner API responses
* **Validation** with Jakarta Bean Validation (`@NotNull`, `@Size`, etc.)
* **PostgreSQL** integration for persistent data storage
* **RESTful structure** with consistent HTTP responses

---

### 🛠️ Tech Stack

* **Backend:** Java 24, Spring Boot 3, Maven
* **Database:** PostgreSQL
* **Libraries:** Spring Data JPA, Jakarta Validation, Hibernate
* **Tools:** Maven, Postman (for testing), pgAdmin (optional)

---

### 📂 Project Structure

```
src/
 ├── main/
 │   ├── java/com/example/workouttracker
 │   │   ├── controller/     # REST Controllers
 │   │   ├── dto/            # Data Transfer Objects
 │   │   ├── entity/         # JPA Entities
 │   │   ├── repository/     # Spring Data Repositories
 │   │   └── service/        # Business Logic
 │   └── resources/
 │       ├── application.properties
 └── test/                   # Unit & Integration Tests
```

---

### ⚙️ Installation & Setup

#### 1️⃣ Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/workout-tracker-api.git
cd workout-tracker-api
```

#### 2️⃣ Install PostgreSQL

Make sure PostgreSQL is installed locally. Then create the database and user:

```sql
CREATE DATABASE workoutdb;
CREATE USER workout_user WITH PASSWORD 'strongpassword';
GRANT ALL PRIVILEGES ON DATABASE workoutdb TO workout_user;
```

#### 3️⃣ Configure the database connection

Check `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/workoutdb
spring.datasource.username=workout_user
spring.datasource.password=strongpassword
spring.jpa.hibernate.ddl-auto=update
```

#### 4️⃣ Build & run the app

```bash
mvn clean install
mvn spring-boot:run
```

---

**Create a Workout**

```bash
POST http://localhost:8080/api/workouts
Content-Type: application/json

{
  "name": "Leg Day",
  "description": "Squats, deadlifts, lunges"
}
```

**Get All Workouts**

```bash
GET http://localhost:8080/api/workouts
```

---

### 📝 Future Plans

* Add user authentication (JWT)
* Frontend integration (React)
* Progress tracking & analytics dashboard

---

