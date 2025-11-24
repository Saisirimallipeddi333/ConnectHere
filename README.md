# ConnectHere – Smart Campus Collaboration Platform

ConnectHere is a full-stack web application that centralizes **campus communication and collaboration** for students, faculty, and administrators.  

It replaces scattered WhatsApp groups, emails, and notice boards with a single, secure, role-based platform.
> **Backend:** Java, Spring Boot, PostgreSQL, JWT, Gmail SMTP  
> **Frontend:** React, Vite

## 🎯 Problem & Solution

### Problem
On most campuses:
- Important announcements are split across WhatsApp, email, and random messages.  
- Students miss deadlines and events.  
- Faculty has no single channel to share course updates.  
- Admins cannot easily broadcast verified information to everyone.

### Solution
**ConnectHere** provides a single portal where:
- **Admins** manage users and publish official campus-wide announcements.  
- **Faculty** share course updates, resources, and event information.  
- **Students** see a personalized feed of announcements and resources based on their role and department.

The system is designed using **Information Systems Design & Development** principles:
- clear separation of frontend, backend and database
- role-based access control
- modular services (auth, announcements, events, resources)

## 👥 User Roles & Capabilities

### 🛡️ Admin
- Activate / deactivate users.
- Manage roles (student, faculty, admin).
- Publish global campus announcements.
- View a centralized feed of all activity (planned).

### 🎓 Faculty
- Post class or department announcements.
- Share resources (links, files, references).
- View and manage content relevant to their courses.

### 🧑‍🎓 Student
- Register and log in securely.
- View a personalized **Campus Feed** with relevant announcements.
- Access shared resources and upcoming events (planned).

## ✨ Current Features

### ✅ Authentication & Security
- User registration and login via REST API.
- Passwords stored securely (via Spring Security).
- JWT-based authentication:
  - Access token created on login.
  - Secured backend endpoints with role-based authorization.

### ✅ Role-Based UI (Frontend)
- Separate view text for:
  - **Admin control center**
  - **Faculty campus feed**
  - **Student campus feed**
- Different navigation options by role (admin vs student vs faculty).

### ✅ Core Backend Modules
- **User module** – store and manage users, roles, and basic profile data.
- **Announcement module** – create and fetch campus announcements.
- **Resource module** – expose educational resources to the frontend.
- **Channel / Event / Comment models & repositories** – prepared for richer collaboration features.

### ✅ Email / OTP (Infrastructure Ready)
- Spring Boot Mail configured for **Gmail SMTP**.
- Email service layer in place for sending OTP or verification emails.
- Secrets handled safely (see **🔐 Security & Secrets** below).

## 🧱 Tech Stack

### Backend

- Java 17
- Spring Boot 3.x
  - Spring Web (REST APIs)
  - Spring Data JPA
  - Spring Security
  - Spring Validation
  - Spring Boot Mail
- JWT (JJWT library)
- PostgreSQL
- Maven

### Frontend

- React (Vite)
- JavaScript (or JSX)
- React Router
- Fetch/Axios via custom `apiClient`
- Tailwind CSS / custom CSS (based on implementation)

### Tools

- Git & GitHub
- pgAdmin for PostgreSQL
- VS Code
- Postman / REST client (for API testing)

## 🏗️ Project Structure

At the repository root:

```text
ConnectHere/
  backend/
    pom.xml
    src/
      main/
        java/
          com/connecthere/
            config/
            controller/
            dto/
            model/
            repository/
            security/
            service/
            ConnectHereApplication.java
        resources/
          application.properties
          application-secrets.properties (gitignored – local only)
  frontend/
    package.json
    vite.config.mjs
    src/
      components/
      pages/
        LoginPage.jsx
        RegisterPage.jsx
        FeedPage.jsx
        AdminPage.jsx
        ChannelsPage.jsx
        ProfilePage.jsx
        ResourcesPage.jsx
        OtpVerifyPage.jsx
      apiClient.js
      App.jsx
      main.jsx

```

##🧩 High-Level Architecture
text
Copy code
[ React Frontend (Vite) ]
        |
        |  JSON over HTTP (REST, JWT in Authorization header)
        v
[ Spring Boot Backend ]
        |
        |  JPA / Hibernate
        v
[ PostgreSQL Database ]
Frontend and backend are decoupled and can be deployed separately.

Authentication is stateless using JWT tokens.

##🗄️ Database (PostgreSQL)
Example configuration (defaults) used for local development:
Host: localhost
Port: 5432
Database: connecthere
User: postgres (or a dedicated user)
Password: your local Postgres password
Spring JPA auto-creates tables from entities such as User, Role, Announcement, Resource, Channel, Event, Comment, etc.

## Getting Started (Local Development)
1. Prerequisites
Java 17+
Maven 3+
Node.js 18+ and npm
PostgreSQL 14+ (with a database connecthere created)
Git (if pulling from GitHub)

2. Backend Setup (Spring Boot + PostgreSQL)
Create database in PostgreSQL
Using pgAdmin or psql:
sql
Copy code
CREATE DATABASE connecthere;
Configure application.properties

backend/src/main/resources/application.properties:
properties
Copy code
# Load local secrets (optional)
spring.config.import=optional:classpath:application-secrets.properties

# PostgreSQL
spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/connecthere}
spring.datasource.username=${DB_USERNAME:postgres}
spring.datasource.password=${DB_PASSWORD:postgres}
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect

spring.main.banner-mode=off

# JWT
app.jwt.secret=${JWT_SECRET:change_this_secret_to_a_long_random_string}
app.jwt.expiration-ms=${JWT_EXPIRATION_MS:3600000}

# Email (Gmail SMTP)
spring.mail.host=${SMTP_HOST:smtp.gmail.com}
spring.mail.port=${SMTP_PORT:587}
spring.mail.username=${SMTP_USERNAME:dummy-user}
spring.mail.password=${SMTP_PASSWORD:dummy-password}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
Create local secrets file (not committed)

backend/src/main/resources/application-secrets.properties:

properties
Copy code
# application-secrets.properties (DO NOT COMMIT)

DB_URL=jdbc:postgresql://localhost:5432/connecthere
DB_USERNAME=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD

JWT_SECRET=PUT_A_LONG_RANDOM_SECRET_HERE
JWT_EXPIRATION_MS=3600000

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=yourgmail@gmail.com
SMTP_PASSWORD=YOUR_GMAIL_APP_PASSWORD   # from Google App Passwords
Make sure this file is gitignored:

gitignore
Copy code
# backend/.gitignore
src/main/resources/application-secrets.properties
Run the backend

bash
Copy code
cd backend
mvn clean spring-boot:run
Backend runs at: http://localhost:8080

3. Frontend Setup (React + Vite)
Install dependencies

bash
Copy code
cd frontend
npm install
Configure API base URL

In frontend/src/apiClient.js (or similar):

js
Copy code
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

export default api;
Run the frontend dev server

bash
Copy code
npm run dev
Open the URL shown by Vite (usually http://localhost:5173).

##Login / Register

Use the registration page to create a new user.
Role-based behavior (Admin/Faculty/Student) is applied based on how the backend initializes roles and assigns them during registration/seed data.

☁️ Optional: Running From GitHub via Codespaces

If the project is on GitHub:
Open the repository in a browser.
Click Code → Codespaces → Create codespace on main.

In the Codespace terminal:

bash
Copy code
# Backend
cd backend
mvn spring-boot:run
Open another terminal tab:

bash
Copy code
# Frontend
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
GitHub will expose forwarded ports that you can open directly from the browser.

##🔐 Security & Secrets
Never commit real secrets (DB passwords, Gmail app passwords, JWT secrets) to Git.

This project uses the pattern:

Public config in application.properties with placeholders.

Real values in application-secrets.properties (ignored by Git).

Optionally, environment variables in production.

If you ever accidentally commit secrets:

Rotate / change them (Postgres password, Gmail app password).

Remove them from config.

Mark them as revoked in any secret-scanning tools (e.g., GitGuardian).

##📚 For Academic / ISDD Documentation
You can describe ConnectHere in your Information Systems Design & Development report as:

A three-tier architecture (Presentation, Application, Data).

Using role-based access control.

Implementing secure authentication with JWT.

Supporting email-based OTP/notifications via SMTP.

Designed with modular backend packages:

controller – REST endpoints

service – business logic

repository – data access

security – JWT, filters, config

model – JPA entities

dto – request/response objects

✅ Status
✅ Backend configured with PostgreSQL, JWT, and mail service.

✅ Role-based UI and routes implemented in frontend.

✅ Project ready for local development and GitHub hosting.

## 🚧 Upcoming:
- Full event management module
- Discussion/Q&A module
- Admin analytics dashboard

## 📸 Screenshots

### Login Page
![Login Page](./screenshots/login.png)

### Student Feed
![Register Page](./screenshots/feed.png)




