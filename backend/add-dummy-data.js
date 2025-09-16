const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function addDummyData() {
  console.log('🌱 Adding additional dummy data to all tables...');

  try {
    // Add 2 more users with different roles
    const staffPassword = await bcrypt.hash('staff123', 12);
    
    const staff1 = await prisma.user.create({
      data: {
        email: 'nurse.jennifer@ihealth.com',
        password: staffPassword,
        firstName: 'Jennifer',
        lastName: 'Martinez',
        role: 'STAFF',
        phone: '+1-555-0401',
        isActive: true
      }
    });

    const staff2 = await prisma.user.create({
      data: {
        email: 'receptionist.david@ihealth.com',
        password: staffPassword,
        firstName: 'David',
        lastName: 'Thompson',
        role: 'STAFF',
        phone: '+1-555-0402',
        isActive: true
      }
    });

    // Add 2 more doctors
    const newDoctorPassword = await bcrypt.hash('doctor123', 12);
    
    const doctor4 = await prisma.user.create({
      data: {
        email: 'dr.garcia@ihealth.com',
        password: newDoctorPassword,
        firstName: 'Carlos',
        lastName: 'Garcia',
        role: 'DOCTOR',
        phone: '+1-555-0104'
      }
    });

    const doctor5 = await prisma.user.create({
      data: {
        email: 'dr.patel@ihealth.com',
        password: newDoctorPassword,
        firstName: 'Priya',
        lastName: 'Patel',
        role: 'DOCTOR',
        phone: '+1-555-0105'
      }
    });

    // Create doctor profiles for new doctors
    const doctorProfile4 = await prisma.doctor.create({
      data: {
        userId: doctor4.id,
        licenseNumber: 'MD013456',
        specialization: 'Orthopedics',
        qualification: 'MD, MS Orthopedics',
        experience: 10,
        consultationFee: 180.00,
        address: '321 Bone Care Center, Health City, HC 12345'
      }
    });

    const doctorProfile5 = await prisma.doctor.create({
      data: {
        userId: doctor5.id,
        licenseNumber: 'MD017890',
        specialization: 'Dermatology',
        qualification: 'MD, Dermatology',
        experience: 7,
        consultationFee: 160.00,
        address: '654 Skin Clinic Ave, Health City, HC 12345'
      }
    });

    // Add schedules for new doctors
    const weekdays = [1, 2, 3, 4, 5]; // Monday to Friday
    
    for (const doctor of [doctorProfile4, doctorProfile5]) {
      for (const dayOfWeek of weekdays) {
        await prisma.doctorSchedule.create({
          data: {
            doctorId: doctor.id,
            dayOfWeek: dayOfWeek,
            startTime: '08:00',
            endTime: '16:00',
            isActive: true
          }
        });
      }
    }

    // Add 2 more patients
    const newPatientPassword = await bcrypt.hash('patient123', 12);
    
    const patient4 = await prisma.user.create({
      data: {
        email: 'maria.rodriguez@email.com',
        password: newPatientPassword,
        firstName: 'Maria',
        lastName: 'Rodriguez',
        role: 'PATIENT',
        phone: '+1-555-0204'
      }
    });

    const patient5 = await prisma.user.create({
      data: {
        email: 'james.wilson@email.com',
        password: newPatientPassword,
        firstName: 'James',
        lastName: 'Wilson',
        role: 'PATIENT',
        phone: '+1-555-0205'
      }
    });

    // Create patient profiles
    await prisma.patient.create({
      data: {
        userId: patient4.id,
        dateOfBirth: new Date('1992-05-18'),
        gender: 'FEMALE',
        address: '987 Maple St, Newtown, NT 98765',
        emergencyContactName: 'Carlos Rodriguez',
        emergencyContactPhone: '+1-555-0304',
        medicalHistory: 'Asthma, well controlled with inhaler',
        allergies: 'Dust, pollen',
        bloodGroup: 'AB+'
      }
    });

    await prisma.patient.create({
      data: {
        userId: patient5.id,
        dateOfBirth: new Date('1975-12-03'),
        gender: 'MALE',
        address: '147 Cedar Ave, Oldtown, OT 13579',
        emergencyContactName: 'Sarah Wilson',
        emergencyContactPhone: '+1-555-0305',
        medicalHistory: 'Previous knee surgery (2020), recovered well',
        allergies: 'Latex',
        bloodGroup: 'O-'
      }
    });

    // Add 2 more medicines
    const newMedicines = [
      {
        name: 'Ibuprofen',
        genericName: 'Ibuprofen',
        category: 'Pain Relief',
        manufacturer: 'PainFree Pharma',
        dosage: '400mg',
        form: 'TABLET',
        price: 7.50,
        stock: 350,
        expiryDate: new Date('2025-11-30'),
        batchNumber: 'IBU006',
        description: 'Non-steroidal anti-inflammatory drug',
        sideEffects: 'Stomach irritation, drowsiness',
        minStockLevel: 35,
        requiresPrescription: false
      },
      {
        name: 'Omeprazole',
        genericName: 'Omeprazole',
        category: 'Gastric',
        manufacturer: 'GastroHealth',
        dosage: '20mg',
        form: 'CAPSULE',
        price: 22.00,
        stock: 180,
        expiryDate: new Date('2025-09-15'),
        batchNumber: 'OME007',
        description: 'Proton pump inhibitor for acid reflux',
        sideEffects: 'Headache, nausea',
        minStockLevel: 20,
        requiresPrescription: true
      }
    ];

    for (const medicine of newMedicines) {
      await prisma.medicine.create({
        data: medicine
      });
    }

    // Add 2 more appointments
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    // Get all patients and doctors for appointments
    const allPatients = await prisma.patient.findMany();
    const allDoctors = await prisma.doctor.findMany();
    const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });

    await prisma.appointment.create({
      data: {
        patientId: allPatients[3].id, // Maria Rodriguez
        doctorId: allDoctors[3].id,   // Dr. Garcia (Orthopedics)
        userId: adminUser.id,
        date: dayAfterTomorrow,
        time: '11:30',
        duration: 60,
        type: 'CHECK_UP',
        status: 'SCHEDULED',
        notes: 'Knee pain evaluation',
        symptoms: 'Knee stiffness and pain'
      }
    });

    await prisma.appointment.create({
      data: {
        patientId: allPatients[4].id, // James Wilson
        doctorId: allDoctors[4].id,   // Dr. Patel (Dermatology)
        userId: adminUser.id,
        date: nextMonth,
        time: '15:00',
        duration: 30,
        type: 'CONSULTATION',
        status: 'CONFIRMED',
        notes: 'Skin rash consultation',
        symptoms: 'Persistent skin rash on arms'
      }
    });

    // Add 2 invoices
    await prisma.invoice.create({
      data: {
        patientId: allPatients[0].id,
        amount: 200.00,
        description: 'Cardiology consultation - Dr. Wilson',
        status: 'PAID',
        dueDate: new Date('2024-09-15'),
        paidDate: new Date('2024-09-10')
      }
    });

    await prisma.invoice.create({
      data: {
        patientId: allPatients[1].id,
        amount: 250.00,
        description: 'Neurology follow-up - Dr. Brown',
        status: 'PENDING',
        dueDate: new Date('2024-09-20')
      }
    });

    console.log('✅ Additional dummy data added successfully!');
    console.log('\n📋 New Accounts Created:');
    console.log('👨‍💼 Staff: nurse.jennifer@ihealth.com / staff123');
    console.log('👨‍💼 Staff: receptionist.david@ihealth.com / staff123');
    console.log('👨‍⚕️ Doctor: dr.garcia@ihealth.com / doctor123 (Orthopedics)');
    console.log('👩‍⚕️ Doctor: dr.patel@ihealth.com / doctor123 (Dermatology)');
    console.log('👤 Patient: maria.rodriguez@email.com / patient123');
    console.log('👤 Patient: james.wilson@email.com / patient123');
    console.log('\n📊 Data Summary:');
    console.log('• 2 new staff members added');
    console.log('• 2 new doctors with profiles and schedules');
    console.log('• 2 new patients with medical profiles');
    console.log('• 2 new medicines in inventory');
    console.log('• 2 new appointments scheduled');
    console.log('• 2 new invoices created');

  } catch (error) {
    console.error('❌ Error adding dummy data:', error);
    throw error;
  }
}

addDummyData()
  .catch((e) => {
    console.error('❌ Adding dummy data failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
