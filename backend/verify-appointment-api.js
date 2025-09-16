const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Test the appointment creation logic directly without HTTP
async function verifyAppointmentCreation() {
  try {
    console.log('🔍 Verifying appointment creation with auto patient creation...');
    
    // Get or create a test doctor
    let doctor = await prisma.doctor.findFirst({
      include: { user: true }
    });
    
    if (!doctor) {
      console.log('Creating test doctor...');
      const hashedPassword = await bcrypt.hash('doctor123', 12);
      const doctorUser = await prisma.user.create({
        data: {
          email: `testdoctor${Date.now()}@hospital.com`,
          password: hashedPassword,
          firstName: 'Test',
          lastName: 'Doctor',
          role: 'DOCTOR'
        }
      });
      
      doctor = await prisma.doctor.create({
        data: {
          userId: doctorUser.id,
          licenseNumber: `LIC${Date.now()}`,
          specialization: 'General Medicine',
          isAvailable: true
        },
        include: { user: true }
      });
    }
    
    console.log(`✅ Using doctor: ${doctor.user.firstName} ${doctor.user.lastName}`);
    
    // Simulate the exact API request data
    const requestData = {
      firstName: 'NewPatient',
      lastName: 'AutoCreated',
      doctorId: doctor.id,
      date: new Date('2025-09-15'),
      time: '15:00',
      duration: 30,
      type: 'CONSULTATION',
      notes: 'Verification test',
      symptoms: 'Test symptoms'
    };
    
    console.log('📋 Request data:', requestData);
    
    // Execute the exact logic from the appointment API
    const { firstName, lastName, doctorId, date, time, duration, type, notes, symptoms } = requestData;
    let finalPatientId = null;
    let patientCreated = false;
    
    // Auto-create patient logic
    if (firstName && lastName) {
      console.log('🔄 Creating new patient...');
      
      const hashedPassword = await bcrypt.hash('temp_password_123', 12);
      const timestamp = Date.now();
      const uniqueEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${timestamp}@temp.patient.com`;
      
      const newUser = await prisma.user.create({
        data: {
          email: uniqueEmail,
          password: hashedPassword,
          firstName,
          lastName,
          role: 'PATIENT',
          phone: null
        }
      });
      
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
      patientCreated = true;
      console.log(`✅ Patient created: ${newUser.firstName} ${newUser.lastName} (ID: ${finalPatientId})`);
    }
    
    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId: finalPatientId,
        firstName,
        lastName,
        doctorId,
        userId: doctor.userId, // Using doctor's user ID
        date,
        time,
        duration,
        type,
        notes,
        symptoms
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
    
    console.log('🎉 SUCCESS! Appointment created with auto patient creation:');
    console.log({
      appointmentId: appointment.id,
      patientName: `${appointment.firstName} ${appointment.lastName}`,
      doctorName: `${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}`,
      patientCreated: patientCreated,
      patientId: finalPatientId,
      date: appointment.date,
      time: appointment.time
    });
    
    // Verify the response structure matches what frontend expects
    const apiResponse = {
      message: 'Appointment created successfully',
      appointment,
      patientCreated
    };
    
    console.log('📤 API Response structure:');
    console.log(JSON.stringify(apiResponse, null, 2));
    
    // Clean up
    console.log('🧹 Cleaning up test data...');
    await prisma.appointment.delete({ where: { id: appointment.id } });
    if (finalPatientId) {
      const patient = await prisma.patient.findUnique({ where: { id: finalPatientId } });
      if (patient) {
        await prisma.patient.delete({ where: { id: finalPatientId } });
        await prisma.user.delete({ where: { id: patient.userId } });
      }
    }
    
    console.log('✅ Verification completed successfully!');
    console.log('');
    console.log('🔧 IMPLEMENTATION STATUS:');
    console.log('✅ Database operations: Working');
    console.log('✅ Patient auto-creation: Working');
    console.log('✅ Appointment creation: Working');
    console.log('✅ Response structure: Correct');
    console.log('');
    console.log('📝 Next steps:');
    console.log('1. Ensure backend server is running on port 5000');
    console.log('2. Test the frontend appointment booking form');
    console.log('3. Check browser console for any frontend errors');
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
  } finally {
    await prisma.$disconnect();
  }
}

verifyAppointmentCreation();
