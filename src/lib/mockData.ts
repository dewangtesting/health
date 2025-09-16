'use client'

// Mock data for when backend is unavailable
export const mockAppointments = [
  {
    id: 'apt-001',
    patientId: 'pat-001',
    firstName: 'John',
    lastName: 'Smith',
    doctorId: 'doc-001',
    date: '2025-01-15',
    time: '10:00',
    duration: 30,
    type: 'CONSULTATION',
    status: 'SCHEDULED',
    notes: 'Regular checkup',
    symptoms: 'General wellness check',
    createdAt: new Date(Date.now() + (5.5 * 60 * 60 * 1000)).toISOString(), // IST timestamp
    patient: {
      id: 'pat-001',
      user: {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@email.com',
        phone: '+1-555-0201'
      }
    },
    doctor: {
      id: 'doc-001',
      specialization: 'Cardiology',
      user: {
        firstName: 'Sarah',
        lastName: 'Wilson'
      }
    }
  },
  {
    id: 'apt-002',
    patientId: 'pat-002',
    firstName: 'Emma',
    lastName: 'Johnson',
    doctorId: 'doc-002',
    date: '2025-01-16',
    time: '14:30',
    duration: 45,
    type: 'FOLLOW_UP',
    status: 'CONFIRMED',
    notes: 'Follow-up for previous treatment',
    symptoms: 'Headaches, dizziness',
    createdAt: new Date(Date.now() + (5.5 * 60 * 60 * 1000)).toISOString(), // IST timestamp
    patient: {
      id: 'pat-002',
      user: {
        firstName: 'Emma',
        lastName: 'Johnson',
        email: 'emma.johnson@email.com',
        phone: '+1-555-0202'
      }
    },
    doctor: {
      id: 'doc-002',
      specialization: 'Neurology',
      user: {
        firstName: 'Michael',
        lastName: 'Brown'
      }
    }
  },
  {
    id: 'apt-003',
    firstName: 'Alice',
    lastName: 'Davis',
    doctorId: 'doc-003',
    date: '2025-01-17',
    time: null,
    duration: 30,
    type: 'CHECK_UP',
    status: 'SCHEDULED',
    notes: 'Annual physical exam',
    symptoms: 'Routine checkup',
    createdAt: new Date(Date.now() + (5.5 * 60 * 60 * 1000)).toISOString(), // IST timestamp
    doctor: {
      id: 'doc-003',
      specialization: 'Pediatrics',
      user: {
        firstName: 'Lisa',
        lastName: 'Anderson'
      }
    }
  }
];

export const mockDoctors = [
  {
    id: 'doc-001',
    user: {
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'dr.wilson@ihealth.com',
      phone: '+1-555-0101'
    },
    specialization: 'Cardiology',
    licenseNumber: 'MD001234',
    experience: 15,
    qualification: 'MD, FACC',
    department: 'Cardiology',
    consultationFee: 200.00,
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'doc-002',
    user: {
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'dr.brown@ihealth.com',
      phone: '+1-555-0102'
    },
    specialization: 'Neurology',
    licenseNumber: 'MD005678',
    experience: 12,
    qualification: 'MD, PhD',
    department: 'Neurology',
    consultationFee: 250.00,
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'doc-003',
    user: {
      firstName: 'Lisa',
      lastName: 'Anderson',
      email: 'dr.anderson@ihealth.com',
      phone: '+1-555-0103'
    },
    specialization: 'Pediatrics',
    licenseNumber: 'MD009012',
    experience: 8,
    qualification: 'MD, FAAP',
    department: 'Pediatrics',
    consultationFee: 150.00,
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const mockPatients = [
  {
    id: 'pat-001',
    user: {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@email.com',
      phone: '+1-555-0201'
    },
    dateOfBirth: '1985-03-15',
    gender: 'MALE',
    address: '123 Main St, Anytown, AT 12345',
    emergencyContactName: 'Jane Smith',
    emergencyContactPhone: '+1-555-0301',
    medicalHistory: 'Hypertension, managed with medication',
    allergies: 'Penicillin',
    bloodGroup: 'O+',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'pat-002',
    user: {
      firstName: 'Emma',
      lastName: 'Johnson',
      email: 'emma.johnson@email.com',
      phone: '+1-555-0202'
    },
    dateOfBirth: '1990-07-22',
    gender: 'FEMALE',
    address: '456 Oak Ave, Somewhere, SW 67890',
    emergencyContactName: 'Mike Johnson',
    emergencyContactPhone: '+1-555-0302',
    medicalHistory: 'No significant medical history',
    allergies: 'None known',
    bloodGroup: 'A+',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'pat-003',
    user: {
      firstName: 'Robert',
      lastName: 'Davis',
      email: 'robert.davis@email.com',
      phone: '+1-555-0203'
    },
    dateOfBirth: '1978-11-08',
    gender: 'MALE',
    address: '789 Pine St, Elsewhere, EW 54321',
    emergencyContactName: 'Mary Davis',
    emergencyContactPhone: '+1-555-0303',
    medicalHistory: 'Diabetes Type 2, well controlled',
    allergies: 'Shellfish',
    bloodGroup: 'B+',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const mockMedicines = [
  {
    id: 'med-001',
    name: 'Aspirin',
    genericName: 'Acetylsalicylic Acid',
    category: 'Pain Relief',
    manufacturer: 'PharmaCorp',
    dosage: '325mg',
    form: 'TABLET',
    price: 5.99,
    stock: 500,
    expiryDate: '2025-12-31',
    batchNumber: 'ASP001',
    description: 'Pain reliever and anti-inflammatory',
    sideEffects: 'Stomach upset, bleeding risk',
    minStockLevel: 50,
    requiresPrescription: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'med-002',
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    category: 'Blood Pressure',
    manufacturer: 'CardioMed',
    dosage: '10mg',
    form: 'TABLET',
    price: 15.50,
    stock: 200,
    expiryDate: '2025-08-15',
    batchNumber: 'LIS002',
    description: 'ACE inhibitor for hypertension',
    sideEffects: 'Dry cough, dizziness',
    minStockLevel: 25,
    requiresPrescription: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'med-003',
    name: 'Metformin',
    genericName: 'Metformin HCl',
    category: 'Diabetes',
    manufacturer: 'DiabetesCare',
    dosage: '500mg',
    form: 'TABLET',
    price: 12.00,
    stock: 300,
    expiryDate: '2025-10-20',
    batchNumber: 'MET003',
    description: 'Diabetes medication',
    sideEffects: 'Nausea, diarrhea',
    minStockLevel: 30,
    requiresPrescription: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const mockDashboardStats = {
  totalPatients: 156,
  totalDoctors: 12,
  totalAppointments: 89,
  totalMedicines: 245,
  todayAppointments: 8,
  pendingAppointments: 15,
  completedAppointments: 67,
  cancelledAppointments: 7
};
