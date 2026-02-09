🏋️ FitPro – Gym Management System

FitPro is a full-stack web application designed to digitize and streamline gym operations for administrators, trainers, and members. It features a Spring Boot REST API backend and a React-based frontend, with secure authentication, role-based access control, automated membership tracking, and online payment integration.

🚀 Key Features
👤 Members

Secure Dashboard: View active memberships, plans, and assigned trainers

BMI Calculator: Track health metrics and receive fitness insights

Attendance History: View personal check-in records

Online Payments: Renew memberships using Razorpay

🏋️ Trainers

Client Management: View assigned active members

Progress Tracking: Monitor client health data and membership status

🛠️ Administrators

Global Dashboard: Track revenue, active members, and trainer count

User & Plan Management: Full CRUD for members, trainers, and plans

Manual Payments: Record cash payments with automatic expiry updates

Attendance System: Digital member check-in and logging

🧰 Tech Stack
Backend

Java Spring Boot – RESTful API development

Spring Security + JWT – Stateless authentication & RBAC

MySQL + Hibernate (JPA) – Relational data persistence

Razorpay API – Secure online payment processing

Frontend

React (Vite) – Component-based UI

Bootstrap 5 + Custom CSS – Dark-themed responsive design

Context API – Authentication & session management

React Router – Role-based protected routing

Lucide-React – Icon library

🔐 Security Architecture

JWT-based authentication using a custom JwtRequestFilter

Role-Based Access Control (RBAC) with three roles:

ADMIN

TRAINER

MEMBER

Enforced at both layers:

Backend: Route-level authorization via SecurityConfig

Frontend: Role-aware ProtectedRoute components

⚙️ Configuration & Setup
Backend

Configure application.properties:

spring.datasource.url=jdbc:mysql://localhost:3306/fitpro_db?createDatabaseIfNotExist=true
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

razorpay.api.key=YOUR_KEY
razorpay.api.secret=YOUR_SECRET

Frontend

Ensure Axios base URL matches backend:

http://localhost:8080/api


Run:

npm install
npm run dev

🏗️ Project Structure
backend/
 └── src/main/java/com/fitpro/
     ├── controller/   # REST controllers
     ├── entity/       # JPA entities
     ├── service/      # Business logic
     └── config/       # Security & configuration

frontend/
 └── src/
     ├── context/      # AuthContext
     ├── api/          # Axios configuration
     └── components/  # Reusable UI components

🎯 Resume-Ready One-Liner (Very Important)

Developed FitPro, a full-stack gym management system using Spring Boot and React, implementing JWT-based authentication, role-based access control, automated membership tracking, and Razorpay payment integration.
