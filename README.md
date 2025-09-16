# I-Health Dynamic Healthcare Management System

A modern, dynamic healthcare management system built with Next.js 14 and a robust Node.js backend with complete database integration.

## 🚀 Features

- **Patient Management** - Complete patient records and medical history
- **Doctor Management** - Doctor profiles, schedules, and availability  
- **Appointment System** - Booking, scheduling, and conflict management
- **Pharmacy Management** - Medicine inventory with stock alerts
- **User Authentication** - Secure JWT-based auth with role permissions
- **Dashboard Analytics** - Real-time statistics and insights
- **Role-Based Access** - ADMIN, DOCTOR, PATIENT, STAFF permissions

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** with App Router & TypeScript
- **Tailwind CSS** + **Bootstrap 5** for styling
- **React Hook Form** + **Zod** for forms & validation
- **Axios** with interceptors for API calls
- **React Context** for authentication state

### Backend
- **Node.js** + **Express** REST API
- **Prisma ORM** with SQLite database
- **JWT** authentication with refresh tokens
- **bcryptjs** password hashing
- **Joi** input validation
- **Rate limiting** & **CORS** security

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Frontend dependencies
npm install
## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="your_database_url"

# Authentication
NEXTAUTH_SECRET="your_secret_key"
NEXTAUTH_URL="http://localhost:3000"

# API Keys
API_KEY="your_api_key"
```

## 📝 License

This project is licensed under the MIT License.
