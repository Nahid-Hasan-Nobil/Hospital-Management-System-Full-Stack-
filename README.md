# 🏥 Smart Hospital Management System

A full-stack hospital management system built with **NestJS (Backend)** and **Next.js (Frontend)**, designed to streamline doctor-patient interactions including appointment booking, messaging, and feedback.

## 📌 Features

### 👨‍⚕️ Doctor Portal
- Register and log in securely using email and password.
- View appointments by searching your email.
- Cancel appointments with confirmation popup.
- Respond to messages sent by patients.
- Logout functionality.

### 🧑‍💼 Patient Portal
- Register and log in using phone number and password.
- Book appointments with doctors.
- View, update, and cancel appointments.
- Print appointment details.
- Send messages to doctors.
- Submit feedback for doctors.

### 🔐 Authentication
- JWT-based login for both patients and doctors.
- Forgot password flow with OTP via email (for doctors).
- Role-based navigation and access control.

### 💬 Messaging System
- Patients can send messages to specific doctors from the "Find Doctors" page.
- Doctors can view and reply to messages from their dashboard.

### 📅 Appointment Management
- Book, search, filter (all/upcoming/past), update, and cancel appointments.
- Doctor and patient can only access their respective data.

### 💬 Feedback System
- Patients can rate and comment on doctors.
- Feedback is visible when searching for doctors.

## 🔧 Tech Stack

| Layer        | Tech                       |
|--------------|----------------------------|
| Frontend     | Next.js, TypeScript, Tailwind CSS |
| Backend      | NestJS, TypeORM            |
| Database     | PostgreSQL                 |
| Auth         | JWT, Bcrypt, OTP Email     |
| Communication| Nodemailer                 |

## 🛠️ Setup Instructions

### Backend (NestJS)

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
Configure Environment
Create .env file:

ini
DATABASE_URL=postgresql://user:password@localhost:5432/hospital
JWT_SECRET=your_jwt_secret
Run the Server

bash
npm run start:dev
Frontend (Next.js)
Install Dependencies

bash
cd frontend
npm install
Start Development Server

bash
npm run dev
Visit App

arduino
http://localhost:3000

## 📂 Folder Structure

backend/
├── src/
│   ├── auth/
│   ├── doctors/
│   ├── patients/
│   ├── appointments/
│   ├── messages/
│   └── feedback/
frontend/
├── app/
│   ├── login/
│   ├── register/
│   ├── doctors/
│   ├── appointments/
│   ├── feedback/
│   └── doctor-dashboard/

## ✅ To-Do Features
 Patient login via phone number

 Doctor login with OTP-based password reset

 Book/cancel/update appointments

 Search doctors by name/specialty

 Patient-to-doctor messaging

 Feedback and ratings

 Responsive UI and Print support

 Notification system (upcoming)

 Admin dashboard (future enhancement)

👨‍💻 Author
Nahid Hasan Nobil

Built as part of a practical university full-stack project to simulate real-world healthcare system workflow.



