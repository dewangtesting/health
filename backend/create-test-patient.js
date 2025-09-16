// Script to create a comprehensive test patient with all fields filled
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestPatient() {
  try {
    console.log('Creating comprehensive test patient with all fields filled...\n');

    // Check if test patient already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test.patient@ihealth.com' }
    });

    if (existingUser) {
      console.log('❌ Test patient already exists with email: test.patient@ihealth.com');
      console.log('Please delete the existing record or use a different email.');
      return;
    }

    // Get a random doctor for assignment
    const doctors = await prisma.doctor.findMany({ take: 1 });
    const doctorId = doctors.length > 0 ? doctors[0].id : null;

    // Create comprehensive test patient data
    const testPatientData = {
      // User Information
      email: 'test.patient@ihealth.com',
      password: await bcrypt.hash('patient123', 12),
      firstName: 'Rajesh',
      lastName: 'Kumar',
      phone: '+91-9876543210',
      role: 'PATIENT',
      
      // Patient Profile Data
      patientData: {
        // Basic Information
        dateOfBirth: new Date('1985-03-15'),
        gender: 'MALE',
        address: '123 MG Road, Sector 15, Gurgaon, Haryana 122001, India',
        emergencyContactName: 'Priya Kumar',
        emergencyContactPhone: '+91-9876543211',
        
        // Medical Information
        bloodGroup: 'B+',
        medicalHistory: 'Previous history of hypertension (2018), minor surgery for appendicitis (2020). Family history of diabetes (father) and heart disease (mother). No known drug allergies.',
        allergies: 'Penicillin, Shellfish, Pollen (seasonal)',
        
        // Admission Information  
        admitDate: new Date('2025-01-15'),
        admitTime: '14:30',
        notes: 'Patient admitted for comprehensive health checkup and management of chronic hypertension. Cooperative and follows medication schedule well.',
        
        // Detailed Medical Information
        bloodPressure: '140/90 mmHg',
        weight: '75 kg',
        sugarStatus: 'yes',
        sugarLevel: '110 mg/dL (fasting)',
        diabetes: 'type2',
        problem: 'Chronic hypertension with occasional headaches and dizziness. Patient reports fatigue and difficulty sleeping. Recent weight gain of 5kg over past 6 months.',
        diagnosis: 'Essential Hypertension (Stage 1), Pre-diabetes, Mild obesity (BMI 26.5), Sleep disorder - likely sleep apnea',
        treatmentPlan: `1. Antihypertensive medication: Amlodipine 5mg once daily
2. Lifestyle modifications: Low sodium diet (<2g/day), regular exercise 30min/day
3. Weight management program - target weight loss 8-10kg
4. Sleep study referral for suspected sleep apnea
5. Regular BP monitoring at home
6. Follow-up appointments every 2 weeks initially, then monthly`,
        doctorNotes: `Patient is a 39-year-old male with well-controlled hypertension on current medication. Compliant with treatment but needs lifestyle counseling. Recent stress at work may be contributing to BP elevation. Recommend stress management techniques and possible counseling referral. Patient educated about DASH diet and provided with meal planning resources.`,
        labReports: `Recent Lab Results (Date: 2025-01-10):
- Complete Blood Count: Normal
- Lipid Profile: Total Cholesterol 220 mg/dL (High), LDL 145 mg/dL (High), HDL 38 mg/dL (Low), Triglycerides 180 mg/dL (High)
- Fasting Glucose: 110 mg/dL (Pre-diabetic range)
- HbA1c: 6.2% (Pre-diabetic)
- Kidney Function: Creatinine 1.1 mg/dL (Normal), BUN 18 mg/dL (Normal)
- Liver Function: ALT 28 U/L (Normal), AST 24 U/L (Normal)
- Thyroid Function: TSH 2.8 mIU/L (Normal)
- Urine Analysis: Normal`,
        pastMedicationHistory: `Previous Medications:
- Atenolol 50mg (2018-2022) - Discontinued due to fatigue
- Lisinopril 10mg (2022-2023) - Discontinued due to dry cough
- Hydrochlorothiazide 25mg (2020-2021) - Discontinued due to electrolyte imbalance
- Metformin 500mg (2023) - Discontinued when glucose levels normalized with diet`,
        currentMedication: `Current Medications:
1. Amlodipine 5mg - Once daily in morning with food
2. Aspirin 81mg - Once daily (cardioprotective)
3. Atorvastatin 20mg - Once daily at bedtime
4. Multivitamin - Once daily
5. Omega-3 Fish Oil 1000mg - Twice daily with meals

PRN Medications:
- Paracetamol 500mg - For headache (max 3g/day)
- Antacid tablets - For occasional heartburn`,
        
        // Registration Information
        paymentOption: 'credit',
        hasInsurance: 'yes',
        insuranceNumber: 'HDFC-ERGO-2024-789456123',
        wardNumber: 'W-205',
        doctorId: doctorId,
        advanceAmount: '15000'
      }
    };

    // Create user and patient in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email: testPatientData.email,
          password: testPatientData.password,
          firstName: testPatientData.firstName,
          lastName: testPatientData.lastName,
          phone: testPatientData.phone,
          role: testPatientData.role
        }
      });

      console.log('✅ Created user account:', {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`
      });

      // Create patient profile
      const patient = await tx.patient.create({
        data: {
          userId: user.id,
          ...testPatientData.patientData
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true
            }
          }
        }
      });

      console.log('✅ Created patient profile:', {
        id: patient.id,
        userId: patient.userId,
        bloodGroup: patient.bloodGroup,
        admitDate: patient.admitDate
      });

      return { user, patient };
    });

    console.log('\n🎉 Test patient created successfully!');
    console.log('\n📋 Patient Details:');
    console.log('==================');
    console.log(`Name: ${result.user.firstName} ${result.user.lastName}`);
    console.log(`Email: ${result.user.email}`);
    console.log(`Phone: ${result.user.phone}`);
    console.log(`Patient ID: ${result.patient.id}`);
    console.log(`Blood Group: ${result.patient.bloodGroup}`);
    console.log(`Gender: ${result.patient.gender}`);
    console.log(`Date of Birth: ${result.patient.dateOfBirth.toDateString()}`);
    console.log(`Admit Date: ${result.patient.admitDate.toDateString()}`);
    console.log(`Insurance: ${result.patient.hasInsurance === 'yes' ? 'Yes' : 'No'}`);
    console.log(`Ward Number: ${result.patient.wardNumber}`);
    
    console.log('\n🔐 Login Credentials:');
    console.log('====================');
    console.log(`Email: ${result.user.email}`);
    console.log('Password: patient123');
    
    console.log('\n📊 Medical Summary:');
    console.log('==================');
    console.log(`Diagnosis: ${result.patient.diagnosis.substring(0, 100)}...`);
    console.log(`Current Medications: ${result.patient.currentMedication.split('\n')[1]}`);
    console.log(`Blood Pressure: ${result.patient.bloodPressure}`);
    console.log(`Weight: ${result.patient.weight}`);
    
    console.log('\n✨ This patient record includes:');
    console.log('- Complete basic information (name, contact, demographics)');
    console.log('- Comprehensive medical history and allergies');
    console.log('- Detailed current diagnosis and treatment plan');
    console.log('- Complete medication history (past and current)');
    console.log('- Recent lab reports and test results');
    console.log('- Insurance and payment information');
    console.log('- Doctor notes and admission details');
    console.log('- Emergency contact information');

  } catch (error) {
    console.error('❌ Error creating test patient:', error);
    
    if (error.code === 'P2002') {
      console.log('\n💡 Tip: The email address might already be in use. Try with a different email.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createTestPatient();
