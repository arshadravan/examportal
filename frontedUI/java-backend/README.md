# ExamIntel Spring Boot Backend

This is the complete backend bundle for the ExamIntel platform, built with **Spring Boot 3.2** and **MongoDB**.

## Prerequisites
- **Java 17** or higher
- **Maven 3.6+**
- **MongoDB** (running on localhost:27017)

## Project Structure
- `com.examintel.model`: Data entities (Exam, Question, User, Result, Activity)
- `com.examintel.repository`: MongoRepository interfaces for database operations
- `com.examintel.controller`: REST API endpoints
- `com.examintel.security`: JWT and Spring Security configuration

## How to Run
1. Ensure MongoDB is running.
2. Open the project in your IDE (IntelliJ/Eclipse).
3. Run `mvn clean install` to download dependencies.
4. Run the `BackendApplication.java` file.
5. The API will be available at `http://localhost:8080`.

## API Endpoints
- `POST /api/auth/login`: Authenticate and get JWT
- `GET /api/exams`: List all exams
- `GET /api/admin/stats`: Get dashboard statistics
- `GET /api/students/{id}/portal`: Get student-specific dashboard data
