// User and Authentication Types
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'doctor' | 'nurse' | 'receptionist';
  profile: UserProfile;
  preferences: UserPreferences;
  lastLogin?: Date;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  department?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
  dashboardLayout: string[];
}

// Patient Types
export interface Patient {
  id: string;
  medicalRecordNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  phone?: string;
  email?: string;
  address?: Address;
  emergencyContact?: EmergencyContact;
  medicalHistory?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

// Doctor Types
export interface Doctor {
  id: string;
  userId: string;
  licenseNumber: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  consultationFee: number;
  availability: DoctorAvailability[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DoctorAvailability {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
  isAvailable: boolean;
}

// Appointment Types
export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: Date;
  durationMinutes: number;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Medicine Types
export interface Medicine {
  id: string;
  name: string;
  genericName?: string;
  manufacturer: string;
  dosageForm: string;
  strength: string;
  price: number;
  stockQuantity: number;
  expiryDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface PatientFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone?: string;
  email?: string;
  address?: Partial<Address>;
  emergencyContact?: Partial<EmergencyContact>;
  medicalHistory?: string;
}

export interface DoctorFormData {
  firstName: string;
  lastName: string;
  email: string;
  licenseNumber: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  consultationFee: number;
  phone?: string;
}

export interface AppointmentFormData {
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  durationMinutes: number;
  notes?: string;
}
