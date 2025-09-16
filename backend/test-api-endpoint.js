const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAPIEndpoint() {
  try {
    console.log('Testing appointment creation API endpoint...');
    
    // First, get an admin user to authenticate
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });
    
    if (!adminUser) {
      console.log('No admin user found. Please ensure there is an admin user in the database.');
      return;
    }
    
    console.log('Found admin user:', adminUser.email);
    
    // Login to get token
    try {
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: adminUser.email,
        password: 'admin123' // Assuming default password
      });
      
      const token = loginResponse.data.token;
      console.log('Login successful, token obtained');
      
      // Get a doctor for the appointment
      const doctor = await prisma.doctor.findFirst({
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });
      
      if (!doctor) {
        console.log('No doctor found in database');
        return;
      }
      
      console.log('Using doctor:', `${doctor.user.firstName} ${doctor.user.lastName}`);
      
      // Test appointment creation with auto patient creation
      const appointmentData = {
        firstName: 'APITest',
        lastName: 'Patient',
        doctorId: doctor.id,
        date: '2025-09-15',
        time: '14:00',
        duration: 30,
        type: 'CONSULTATION',
        notes: 'API test appointment',
        symptoms: 'Test symptoms for API'
      };
      
      console.log('Sending appointment creation request...');
      console.log('Request data:', appointmentData);
      
      const response = await axios.post('http://localhost:5000/api/appointments', appointmentData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ API Response received:');
      console.log('Status:', response.status);
      console.log('Response data:', JSON.stringify(response.data, null, 2));
      
      if (response.data.patientCreated) {
        console.log('✅ SUCCESS: New patient was automatically created via API!');
      } else {
        console.log('❌ ISSUE: Patient was not created automatically via API');
      }
      
      // Clean up - delete the created appointment and patient
      if (response.data.appointment) {
        const appointmentId = response.data.appointment.id;
        console.log('Cleaning up created appointment...');
        
        try {
          await axios.delete(`http://localhost:5000/api/appointments/${appointmentId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          console.log('Appointment deleted successfully');
        } catch (deleteError) {
          console.log('Note: Could not delete appointment (may need manual cleanup)');
        }
      }
      
    } catch (authError) {
      if (authError.response?.status === 401) {
        console.log('Authentication failed. Trying with default password...');
        
        // Try with a different password or create a test user
        console.log('Please ensure admin user exists with correct password, or check the authentication setup.');
      } else {
        console.error('Authentication error:', authError.response?.data || authError.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing API endpoint:', error.response?.data || error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('Backend server is not running. Please start the backend server first.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testAPIEndpoint();
