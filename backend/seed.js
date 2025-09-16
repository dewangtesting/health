const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ihealth.com' },
    update: {},
    create: {
      email: 'admin@ihealth.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      phone: '+1-555-0001'
    }
  });

  // Create sample doctors
  const doctorPassword = await bcrypt.hash('doctor123', 12);
  
  const doctor1 = await prisma.user.upsert({
    where: { email: 'dr.wilson@ihealth.com' },
    update: {},
    create: {
      email: 'dr.wilson@ihealth.com',
      password: doctorPassword,
      firstName: 'Sarah',
      lastName: 'Wilson',
      role: 'DOCTOR',
      phone: '+1-555-0101'
    }
  });

  const doctor2 = await prisma.user.upsert({
    where: { email: 'dr.brown@ihealth.com' },
    update: {},
    create: {
      email: 'dr.brown@ihealth.com',
      password: doctorPassword,
      firstName: 'Michael',
      lastName: 'Brown',
      role: 'DOCTOR',
      phone: '+1-555-0102'
    }
  });

  const doctor3 = await prisma.user.upsert({
    where: { email: 'dr.anderson@ihealth.com' },
    update: {},
    create: {
      email: 'dr.anderson@ihealth.com',
      password: doctorPassword,
      firstName: 'Lisa',
      lastName: 'Anderson',
      role: 'DOCTOR',
      phone: '+1-555-0103'
    }
  });

  // Create doctor profiles
  const doctorProfile1 = await prisma.doctor.upsert({
    where: { userId: doctor1.id },
    update: {},
    create: {
      userId: doctor1.id,
      licenseNumber: 'MD001234',
      specialization: 'Cardiology',
      qualification: 'MD, FACC',
      experience: 15,
      consultationFee: 200.00,
      address: '123 Medical Center Dr, Health City, HC 12345'
    }
  });

  const doctorProfile2 = await prisma.doctor.upsert({
    where: { userId: doctor2.id },
    update: {},
    create: {
      userId: doctor2.id,
      licenseNumber: 'MD005678',
      specialization: 'Neurology',
      qualification: 'MD, PhD',
      experience: 12,
      consultationFee: 250.00,
      address: '456 Brain Institute Ave, Health City, HC 12345'
    }
  });

  const doctorProfile3 = await prisma.doctor.upsert({
    where: { userId: doctor3.id },
    update: {},
    create: {
      userId: doctor3.id,
      licenseNumber: 'MD009012',
      specialization: 'Pediatrics',
      qualification: 'MD, FAAP',
      experience: 8,
      consultationFee: 150.00,
      address: '789 Children Hospital Rd, Health City, HC 12345'
    }
  });

  // Create doctor schedules
  const weekdays = [1, 2, 3, 4, 5]; // Monday to Friday
  
  for (const doctor of [doctorProfile1, doctorProfile2, doctorProfile3]) {
    for (const dayOfWeek of weekdays) {
      await prisma.doctorSchedule.upsert({
        where: {
          doctorId_dayOfWeek: {
            doctorId: doctor.id,
            dayOfWeek: dayOfWeek
          }
        },
        update: {},
        create: {
          doctorId: doctor.id,
          dayOfWeek: dayOfWeek,
          startTime: '09:00',
          endTime: '17:00',
          isActive: true
        }
      });
    }
  }

  // Create sample patients
  const patientPassword = await bcrypt.hash('patient123', 12);
  
  const patient1 = await prisma.user.upsert({
    where: { email: 'john.smith@email.com' },
    update: {},
    create: {
      email: 'john.smith@email.com',
      password: patientPassword,
      firstName: 'John',
      lastName: 'Smith',
      role: 'PATIENT',
      phone: '+1-555-0201'
    }
  });

  const patient2 = await prisma.user.upsert({
    where: { email: 'emma.johnson@email.com' },
    update: {},
    create: {
      email: 'emma.johnson@email.com',
      password: patientPassword,
      firstName: 'Emma',
      lastName: 'Johnson',
      role: 'PATIENT',
      phone: '+1-555-0202'
    }
  });

  const patient3 = await prisma.user.upsert({
    where: { email: 'robert.davis@email.com' },
    update: {},
    create: {
      email: 'robert.davis@email.com',
      password: patientPassword,
      firstName: 'Robert',
      lastName: 'Davis',
      role: 'PATIENT',
      phone: '+1-555-0203'
    }
  });

  // Create patient profiles
  await prisma.patient.upsert({
    where: { userId: patient1.id },
    update: {},
    create: {
      userId: patient1.id,
      dateOfBirth: new Date('1985-03-15'),
      gender: 'MALE',
      address: '123 Main St, Anytown, AT 12345',
      emergencyContactName: 'Jane Smith',
      emergencyContactPhone: '+1-555-0301',
      medicalHistory: 'Hypertension, managed with medication',
      allergies: 'Penicillin',
      bloodGroup: 'O+'
    }
  });

  await prisma.patient.upsert({
    where: { userId: patient2.id },
    update: {},
    create: {
      userId: patient2.id,
      dateOfBirth: new Date('1990-07-22'),
      gender: 'FEMALE',
      address: '456 Oak Ave, Somewhere, SW 67890',
      emergencyContactName: 'Mike Johnson',
      emergencyContactPhone: '+1-555-0302',
      medicalHistory: 'No significant medical history',
      allergies: 'None known',
      bloodGroup: 'A+'
    }
  });

  await prisma.patient.upsert({
    where: { userId: patient3.id },
    update: {},
    create: {
      userId: patient3.id,
      dateOfBirth: new Date('1978-11-08'),
      gender: 'MALE',
      address: '789 Pine St, Elsewhere, EW 54321',
      emergencyContactName: 'Mary Davis',
      emergencyContactPhone: '+1-555-0303',
      medicalHistory: 'Diabetes Type 2, well controlled',
      allergies: 'Shellfish',
      bloodGroup: 'B+'
    }
  });

  // Create sample medicines
  const medicines = [
    {
      id: 'med-aspirin-001',
      name: 'Aspirin',
      genericName: 'Acetylsalicylic Acid',
      category: 'Pain Relief',
      manufacturer: 'PharmaCorp',
      dosage: '325mg',
      form: 'TABLET',
      price: 5.99,
      stock: 500,
      expiryDate: new Date('2025-12-31'),
      batchNumber: 'ASP001',
      description: 'Pain reliever and anti-inflammatory',
      sideEffects: 'Stomach upset, bleeding risk',
      minStockLevel: 50,
      requiresPrescription: false
    },
    {
      id: 'med-lisinopril-002',
      name: 'Lisinopril',
      genericName: 'Lisinopril',
      category: 'Blood Pressure',
      manufacturer: 'CardioMed',
      dosage: '10mg',
      form: 'TABLET',
      price: 15.50,
      stock: 200,
      expiryDate: new Date('2025-08-15'),
      batchNumber: 'LIS002',
      description: 'ACE inhibitor for hypertension',
      sideEffects: 'Dry cough, dizziness',
      minStockLevel: 25,
      requiresPrescription: true
    },
    {
      id: 'med-metformin-003',
      name: 'Metformin',
      genericName: 'Metformin HCl',
      category: 'Diabetes',
      manufacturer: 'DiabetesCare',
      dosage: '500mg',
      form: 'TABLET',
      price: 12.00,
      stock: 300,
      expiryDate: new Date('2025-10-20'),
      batchNumber: 'MET003',
      description: 'Diabetes medication',
      sideEffects: 'Nausea, diarrhea',
      minStockLevel: 30,
      requiresPrescription: true
    },
    {
      id: 'med-amoxicillin-004',
      name: 'Amoxicillin',
      genericName: 'Amoxicillin',
      category: 'Antibiotics',
      manufacturer: 'AntibioTech',
      dosage: '250mg',
      form: 'CAPSULE',
      price: 18.75,
      stock: 150,
      expiryDate: new Date('2025-06-30'),
      batchNumber: 'AMX004',
      description: 'Broad-spectrum antibiotic',
      sideEffects: 'Allergic reactions, diarrhea',
      minStockLevel: 20,
      requiresPrescription: true
    },
    {
      id: 'med-vitamin-d3-005',
      name: 'Vitamin D3',
      genericName: 'Cholecalciferol',
      category: 'Vitamins',
      manufacturer: 'VitaHealth',
      dosage: '1000 IU',
      form: 'TABLET',
      price: 8.99,
      stock: 400,
      expiryDate: new Date('2026-03-15'),
      batchNumber: 'VIT005',
      description: 'Vitamin D supplement',
      sideEffects: 'Rare: hypercalcemia',
      minStockLevel: 40,
      requiresPrescription: false
    }
  ];

  for (const medicine of medicines) {
    await prisma.medicine.upsert({
      where: { id: medicine.id },
      update: {},
      create: medicine
    });
  }

  // Create sample appointments
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const patientProfiles = await prisma.patient.findMany();
  const doctorProfiles = await prisma.doctor.findMany();

  await prisma.appointment.upsert({
    where: { id: 'sample-apt-1' },
    update: {},
    create: {
      id: 'sample-apt-1',
      patientId: patientProfiles[0].id,
      doctorId: doctorProfiles[0].id,
      userId: admin.id,
      date: tomorrow,
      time: '10:00',
      duration: 30,
      type: 'CONSULTATION',
      status: 'SCHEDULED',
      notes: 'Regular checkup',
      symptoms: 'General wellness check'
    }
  });

  await prisma.appointment.upsert({
    where: { id: 'sample-apt-2' },
    update: {},
    create: {
      id: 'sample-apt-2',
      patientId: patientProfiles[1].id,
      doctorId: doctorProfiles[1].id,
      userId: admin.id,
      date: nextWeek,
      time: '14:30',
      duration: 45,
      type: 'FOLLOW_UP',
      status: 'CONFIRMED',
      notes: 'Follow-up for previous treatment',
      symptoms: 'Headaches, dizziness'
    }
  });

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📋 Sample Accounts Created:');
  console.log('👨‍💼 Admin: admin@ihealth.com / admin123');
  console.log('👩‍⚕️ Doctor: dr.wilson@ihealth.com / doctor123');
  console.log('👨‍⚕️ Doctor: dr.brown@ihealth.com / doctor123');
  console.log('👩‍⚕️ Doctor: dr.anderson@ihealth.com / doctor123');
  console.log('👤 Patient: john.smith@email.com / patient123');
  console.log('👤 Patient: emma.johnson@email.com / patient123');
  console.log('👤 Patient: robert.davis@email.com / patient123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
