const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testPatientCreation() {
  try {
    console.log('Testing patient creation logic...');
    
    // Test the same logic as in the appointment creation
    const firstName = 'TestJohn';
    const lastName = 'TestDoe';
    
    // Hash the temporary password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('temp_password_123', saltRounds);
    
    // Generate unique email to avoid conflicts
    const timestamp = Date.now();
    const uniqueEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${timestamp}@temp.patient.com`;
    
    console.log('Creating user with email:', uniqueEmail);
    
    // Create a new user for the patient with minimal required fields
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
    
    console.log('User created successfully:', { id: newUser.id, email: newUser.email });
    
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
    
    console.log('✅ Patient created successfully:', { 
      patientId: newPatient.id, 
      userId: newUser.id 
    });
    
    // Clean up - delete the test records
    await prisma.patient.delete({ where: { id: newPatient.id } });
    await prisma.user.delete({ where: { id: newUser.id } });
    
    console.log('✅ Test completed successfully - records cleaned up');
    
  } catch (error) {
    console.error('❌ Error in patient creation test:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
  } finally {
    await prisma.$disconnect();
  }
}

testPatientCreation();
