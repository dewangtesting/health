const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testFullAppointmentFlow() {
  try {
    console.log('Testing full appointment creation with auto patient creation...');
    
    // First, let's check if we have any doctors in the database
    const doctors = await prisma.doctor.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
      take: 1
    });
    
    if (doctors.length === 0) {
      console.log('No doctors found in database. Creating a test doctor...');
      
      // Create a test doctor
      const hashedPassword = await bcrypt.hash('doctor123', 12);
      const doctorUser = await prisma.user.create({
        data: {
          email: `test.doctor.${Date.now()}@hospital.com`,
          password: hashedPassword,
          firstName: 'Test',
          lastName: 'Doctor',
          role: 'DOCTOR',
          phone: '+1234567890'
        }
      });
      
      const doctor = await prisma.doctor.create({
        data: {
          userId: doctorUser.id,
          licenseNumber: `LIC${Date.now()}`,
          specialization: 'General Medicine',
          qualification: 'MBBS',
          experience: 5,
          consultationFee: 100.0,
          isAvailable: true
        }
      });
      
      console.log('Test doctor created:', { id: doctor.id, name: `${doctorUser.firstName} ${doctorUser.lastName}` });
      doctors.push({ ...doctor, user: doctorUser });
    }
    
    const testDoctor = doctors[0];
    console.log('Using doctor:', { id: testDoctor.id, name: `${testDoctor.user.firstName} ${testDoctor.user.lastName}` });
    
    // Now test the appointment creation logic directly (simulating the API call)
    const appointmentData = {
      firstName: 'AutoPatient',
      lastName: 'TestCase',
      doctorId: testDoctor.id,
      date: new Date('2025-09-15'),
      time: '10:00',
      duration: 30,
      type: 'CONSULTATION',
      notes: 'Test appointment for auto patient creation',
      symptoms: 'Test symptoms'
    };
    
    console.log('Testing appointment creation with data:', appointmentData);
    
    // Simulate the appointment creation logic from the API
    let finalPatientId = null;
    
    // If no patientId provided but firstName and lastName are provided, create a new patient
    if (!appointmentData.patientId && appointmentData.firstName && appointmentData.lastName) {
      console.log('Creating new patient...');
      
      // Hash the temporary password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash('temp_password_123', saltRounds);
      
      // Generate unique email to avoid conflicts
      const timestamp = Date.now();
      const uniqueEmail = `${appointmentData.firstName.toLowerCase()}.${appointmentData.lastName.toLowerCase()}.${timestamp}@temp.patient.com`;
      
      // Create a new user for the patient with minimal required fields
      const newUser = await prisma.user.create({
        data: {
          email: uniqueEmail,
          password: hashedPassword,
          firstName: appointmentData.firstName,
          lastName: appointmentData.lastName,
          role: 'PATIENT',
          phone: null
        }
      });
      
      console.log('Patient user created:', { id: newUser.id, email: newUser.email });
      
      // Create patient record with minimal required fields
      const newPatient = await prisma.patient.create({
        data: {
          userId: newUser.id,
          dateOfBirth: new Date('1990-01-01'),
          gender: 'OTHER',
          address: null,
          emergencyContactName: null,
          emergencyContactPhone: null,
          medicalHistory: null,
          allergies: null,
          bloodGroup: null,
          admitDate: null,
          admitTime: null,
          notes: null,
          bloodPressure: null,
          weight: null,
          sugarStatus: null,
          sugarLevel: null,
          diabetes: null,
          problem: null,
          diagnosis: null,
          treatmentPlan: null,
          doctorNotes: null,
          labReports: null,
          pastMedicationHistory: null,
          currentMedication: null,
          paymentOption: null,
          hasInsurance: null,
          insuranceNumber: null,
          wardNumber: null,
          doctorId: null,
          advanceAmount: null
        }
      });
      
      finalPatientId = newPatient.id;
      console.log('Patient record created:', { patientId: newPatient.id });
    }
    
    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId: finalPatientId,
        firstName: appointmentData.firstName,
        lastName: appointmentData.lastName,
        doctorId: appointmentData.doctorId,
        userId: testDoctor.userId, // Using doctor's userId for now
        date: appointmentData.date,
        time: appointmentData.time,
        duration: appointmentData.duration,
        type: appointmentData.type,
        notes: appointmentData.notes,
        symptoms: appointmentData.symptoms
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true
              }
            }
          }
        },
        doctor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });
    
    console.log('✅ Appointment created successfully!');
    console.log('Appointment details:', {
      id: appointment.id,
      patientName: `${appointment.firstName} ${appointment.lastName}`,
      doctorName: `${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}`,
      date: appointment.date,
      time: appointment.time,
      patientCreated: !!finalPatientId
    });
    
    if (finalPatientId) {
      console.log('✅ New patient was automatically created with ID:', finalPatientId);
    }
    
    // Clean up test data
    console.log('Cleaning up test data...');
    await prisma.appointment.delete({ where: { id: appointment.id } });
    if (finalPatientId) {
      const patient = await prisma.patient.findUnique({ where: { id: finalPatientId } });
      if (patient) {
        await prisma.patient.delete({ where: { id: finalPatientId } });
        await prisma.user.delete({ where: { id: patient.userId } });
      }
    }
    
    console.log('✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error in appointment creation test:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
  } finally {
    await prisma.$disconnect();
  }
}

testFullAppointmentFlow();
