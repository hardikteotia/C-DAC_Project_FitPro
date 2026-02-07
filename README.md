FitPro - Gym Management System
FitPro is a full-stack web application designed to streamline gym operations for administrators, trainers, and members. It features a robust Spring Boot backend and a responsive React frontend, integrating secure authentication, automated membership tracking, and online payment processing.

🚀 Features
For Members
Secure Dashboard: View membership status, active plans, and assigned trainers.

BMI Calculator: Integrated tool for members to track health metrics and receive plan recommendations.

Attendance Tracking: View personal check-in history.

Online Payments: Seamless membership renewal via Razorpay integration.

For Trainers
Client Management: Access a roster of assigned active clients.

Progress Tracking: Monitor client health metrics and membership statuses.

For Administrators
Global Dashboard: Overview of total revenue, active members, and trainer staff.

Management Tools: Complete CRUD operations for members, trainers, and membership plans.

Manual Payments: Record cash payments and automatically sync membership expiry dates.

Attendance System: Check-in members and maintain digital logs.

🛠️ Tech Stack
Backend
Framework: Java Spring Boot

Security: Spring Security with JWT (JSON Web Tokens) for stateless authentication.

Database: MySQL with Spring Data JPA/Hibernate.

Payments: Razorpay API integration.

Frontend
Library: React.js (Vite)

Styling: Bootstrap 5 with custom CSS variables for a dark-themed UI.

State Management: React Context API for authentication and user sessions.

Routing: React Router for role-based protected routes.

Icons: Lucide-React.

⚙️ Configuration
Backend Setup
Navigate to src/main/resources/application.properties.

Configure your local MySQL database settings:

Properties
spring.datasource.url=jdbc:mysql://localhost:3306/fitpro_db?createDatabaseIfNotExist=true
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
Add your Razorpay API credentials:

Properties
razorpay.api.key=YOUR_KEY
razorpay.api.secret=YOUR_SECRET
Frontend Setup
Ensure the baseURL in src/api/axios.js matches your backend server (default: http://localhost:8080/api).

Install dependencies and start the development server:

Bash
npm install
npm run dev
🔒 Security Implementation
The project implements a custom JwtRequestFilter that intercepts every request to validate a Bearer token. Role-Based Access Control (RBAC) is enforced on both the frontend and backend:

Frontend: ProtectedRoute component validates user roles before rendering views.

Backend: SecurityConfig defines authorized paths for ADMIN, TRAINER, and MEMBER.

🏗️ Project Structure
src/main/java/com/fitpro/backend/controller: REST API endpoints.

src/main/java/com/fitpro/backend/entity: JPA Data Models.

src/main/java/com/fitpro/backend/service: Core Business Logic.

src/context/AuthContext.jsx: Global authentication state management.

src/api/axios.js: Centralized API client with automatic token attachment.
