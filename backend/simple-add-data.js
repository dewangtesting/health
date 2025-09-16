const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Adding dummy data...');
  
  try {
    // Check connection
    await prisma.$connect();
    console.log('Database connected successfully');

    // Add 2 new users (Staff roles)
    const hashedPassword = await bcrypt.hash('staff123', 12);
    
    const newUser1 = await prisma.user.create({
      data: {
        email: 'staff1@ihealth.com',
        password: hashedPassword,
        firstName: 'Alice',
        lastName: 'Cooper',
        role: 'STAFF',
        phone: '+1-555-0501'
      }
    });

    const newUser2 = await prisma.user.create({
      data: {
        email: 'staff2@ihealth.com',
        password: hashedPassword,
        firstName: 'Bob',
        lastName: 'Miller',
        role: 'STAFF',
        phone: '+1-555-0502'
      }
    });

    console.log('✅ Added 2 new staff users');

    // Add 2 new medicines
    await prisma.medicine.create({
      data: {
        name: 'Paracetamol Extra',
        genericName: 'Acetaminophen',
        category: 'Pain Relief',
        manufacturer: 'HealthCorp',
        dosage: '500mg',
        form: 'TABLET',
        price: 6.99,
        stock: 250,
        expiryDate: new Date('2025-12-31'),
        batchNumber: 'PAR008',
        description: 'Extra strength pain reliever',
        sideEffects: 'Rare liver toxicity with overdose',
        minStockLevel: 25,
        requiresPrescription: false
      }
    });

    await prisma.medicine.create({
      data: {
        name: 'Cetirizine',
        genericName: 'Cetirizine HCl',
        category: 'Antihistamine',
        manufacturer: 'AllergyFree',
        dosage: '10mg',
        form: 'TABLET',
        price: 9.50,
        stock: 180,
        expiryDate: new Date('2025-08-30'),
        batchNumber: 'CET009',
        description: 'Antihistamine for allergies',
        sideEffects: 'Drowsiness, dry mouth',
        minStockLevel: 20,
        requiresPrescription: false
      }
    });

    console.log('✅ Added 2 new medicines');

    // Get existing patients and doctors for appointments
    const patients = await prisma.patient.findMany({ take: 2 });
    const doctors = await prisma.doctor.findMany({ take: 2 });
    const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });

    if (patients.length > 0 && doctors.length > 0 && adminUser) {
      // Add 2 new appointments
      const futureDate1 = new Date();
      futureDate1.setDate(futureDate1.getDate() + 3);

      const futureDate2 = new Date();
      futureDate2.setDate(futureDate2.getDate() + 5);

      await prisma.appointment.create({
        data: {
          patientId: patients[0].id,
          doctorId: doctors[0].id,
          userId: adminUser.id,
          date: futureDate1,
          time: '09:30',
          duration: 45,
          type: 'CONSULTATION',
          status: 'SCHEDULED',
          notes: 'New patient consultation',
          symptoms: 'General health checkup'
        }
      });

      await prisma.appointment.create({
        data: {
          patientId: patients[1] ? patients[1].id : patients[0].id,
          doctorId: doctors[1] ? doctors[1].id : doctors[0].id,
          userId: adminUser.id,
          date: futureDate2,
          time: '13:45',
          duration: 30,
          type: 'FOLLOW_UP',
          status: 'CONFIRMED',
          notes: 'Follow-up appointment',
          symptoms: 'Review previous treatment'
        }
      });

      console.log('✅ Added 2 new appointments');

      // Add 2 new invoices
      await prisma.invoice.create({
        data: {
          patientId: patients[0].id,
          amount: 175.00,
          description: 'Consultation fee and tests',
          status: 'PENDING',
          dueDate: new Date('2024-09-25')
        }
      });

      await prisma.invoice.create({
        data: {
          patientId: patients[1] ? patients[1].id : patients[0].id,
          amount: 125.00,
          description: 'Follow-up consultation',
          status: 'PAID',
          dueDate: new Date('2024-09-20'),
          paidDate: new Date('2024-09-18')
        }
      });

      console.log('✅ Added 2 new invoices');
    }

    // Add 2 more doctor schedules (weekend schedules for existing doctors)
    const existingDoctors = await prisma.doctor.findMany({ take: 2 });
    
    if (existingDoctors.length > 0) {
      // Add Saturday schedule for first doctor
      await prisma.doctorSchedule.create({
        data: {
          doctorId: existingDoctors[0].id,
          dayOfWeek: 6, // Saturday
          startTime: '10:00',
          endTime: '14:00',
          isActive: true
        }
      });

      // Add Saturday schedule for second doctor if exists
      if (existingDoctors.length > 1) {
        await prisma.doctorSchedule.create({
          data: {
            doctorId: existingDoctors[1].id,
            dayOfWeek: 6, // Saturday
            startTime: '09:00',
            endTime: '13:00',
            isActive: true
          }
        });
      }

      console.log('✅ Added 2 new doctor schedules');
    }

    console.log('\n🎉 Successfully added dummy data to all tables!');
    console.log('\n📊 Summary of added records:');
    console.log('• 2 Staff users');
    console.log('• 2 Medicines');
    console.log('• 2 Appointments');
    console.log('• 2 Invoices');
    console.log('• 2 Doctor Schedules');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
