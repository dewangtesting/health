# I-Health Backend API

A comprehensive Node.js/Express backend API for the I-Health Healthcare Management System.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
Copy `.env` file and update values as needed:
```bash
# Database
DATABASE_URL="file:./dev.db"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=5000
NODE_ENV="development"
```

4. **Initialize database:**
```bash
npm run generate
npm run migrate
```

5. **Start development server:**
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## 📊 Database Schema

### Core Entities
- **Users** - Base user accounts with authentication
- **Doctors** - Doctor profiles with specializations and schedules
- **Patients** - Patient profiles with medical history
- **Appointments** - Appointment scheduling and management
- **Medicines** - Pharmacy inventory management
- **Invoices** - Patient billing system

### Key Features
- Role-based access control (ADMIN, DOCTOR, PATIENT, STAFF)
- JWT authentication
- Comprehensive validation
- Audit trails
- Soft deletes where appropriate

## 🔐 Authentication

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "PATIENT"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

## 📋 API Endpoints

### Patients
- `GET /api/patients` - Get all patients (paginated)
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Doctors
- `GET /api/doctors` - Get all doctors (paginated)
- `GET /api/doctors/:id` - Get doctor by ID
- `POST /api/doctors` - Create new doctor
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor
- `GET /api/doctors/:id/schedules` - Get doctor schedules
- `PUT /api/doctors/:id/schedules` - Update doctor schedules

### Appointments
- `GET /api/appointments` - Get all appointments (paginated, filtered)
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment
- `GET /api/appointments/doctor/:doctorId/available-slots` - Get available time slots

### Medicines
- `GET /api/medicines` - Get all medicines (paginated)
- `GET /api/medicines/:id` - Get medicine by ID
- `POST /api/medicines` - Create new medicine
- `PUT /api/medicines/:id` - Update medicine
- `DELETE /api/medicines/:id` - Delete medicine
- `GET /api/medicines/alerts/low-stock` - Get low stock alerts
- `GET /api/medicines/alerts/expired` - Get expired medicines
- `PATCH /api/medicines/:id/stock` - Update medicine stock

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/today-appointments` - Get today's appointments
- `GET /api/dashboard/upcoming-appointments` - Get upcoming appointments
- `GET /api/dashboard/recent-patients` - Get recent patients
- `GET /api/dashboard/medicine-alerts` - Get medicine alerts

### Users
- `GET /api/users` - Get all users (Admin only)
- `PUT /api/users/:id` - Update user profile
- `PATCH /api/users/:id/toggle-status` - Toggle user active status

## 🔒 Authorization

### Roles & Permissions

**ADMIN**
- Full access to all resources
- User management
- System configuration

**DOCTOR**
- View/update own profile
- Manage own appointments
- View assigned patients
- Update appointment status and notes

**PATIENT**
- View/update own profile
- View own appointments
- Book new appointments

**STAFF**
- Manage patients
- Manage medicines
- View appointments
- Generate reports

## 🛡️ Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt with salt rounds
- **Rate Limiting** - Prevent API abuse
- **CORS Protection** - Configurable cross-origin requests
- **Helmet Security** - Security headers
- **Input Validation** - Joi schema validation
- **Role-based Access** - Granular permission control

## 📊 Database Commands

```bash
# Generate Prisma client
npm run generate

# Run database migrations
npm run migrate

# Open Prisma Studio (database GUI)
npm run studio

# Reset database (development only)
npx prisma migrate reset
```

## 🔧 Development

### Project Structure
```
backend/
├── middleware/          # Authentication & authorization
├── routes/             # API route handlers
├── prisma/            # Database schema & migrations
├── uploads/           # File upload directory
├── server.js          # Main server file
├── package.json       # Dependencies
└── .env              # Environment variables
```

### Adding New Routes
1. Create route file in `/routes`
2. Add validation schemas
3. Implement CRUD operations
4. Add authentication/authorization
5. Register route in `server.js`

### Database Changes
1. Update `prisma/schema.prisma`
2. Run `npm run migrate`
3. Update TypeScript types if needed

## 🚀 Deployment

### Environment Variables (Production)
```bash
DATABASE_URL="postgresql://user:password@host:port/database"
JWT_SECRET="your-production-secret-key"
NODE_ENV="production"
PORT=5000
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
EXPOSE 5000
CMD ["npm", "start"]
```

## 📈 Monitoring & Logging

- **Morgan** - HTTP request logging
- **Error Handling** - Centralized error middleware
- **Health Check** - `/health` endpoint
- **Graceful Shutdown** - Proper cleanup on exit

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

## 📝 API Documentation

Visit `/health` endpoint to verify API is running.

For detailed API documentation, consider integrating:
- Swagger/OpenAPI
- Postman collections
- API Blueprint

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details.
