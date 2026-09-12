# syntax=docker/dockerfile:1

# 1) Build the React single-page app.
FROM node:22-bookworm-slim AS frontend
WORKDIR /app
COPY workout-tracker-frontend/package.json workout-tracker-frontend/package-lock.json ./
RUN npm ci
COPY workout-tracker-frontend/ ./
RUN npm run build

# 2) Build the Spring Boot jar, bundling the built SPA into its static resources
#    so the API and UI are served from a single origin.
FROM eclipse-temurin:24-jdk-noble AS backend
WORKDIR /app
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
COPY src/ src/
COPY --from=frontend /app/build/ src/main/resources/static/
RUN chmod +x mvnw && ./mvnw -q -B -DskipTests clean package

# 3) Slim runtime image that just runs the jar.
FROM eclipse-temurin:24-jdk-noble AS runtime
WORKDIR /app
COPY --from=backend /app/target/workout-tracker-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
# --enable-preview is required because the app is compiled with preview features.
ENTRYPOINT ["java", "--enable-preview", "-jar", "app.jar"]
