const axios = require('axios');

// Test script to verify appointment creation with auto patient creation
async function testAppointmentCreation() {
  try {
    // First, login to get a token (you'll need to replace with actual credentials)
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@example.com', // Replace with actual admin email
      password: 'admin123' // Replace with actual admin password
    });

    const token = loginResponse.data.token;
    console.log('Login successful, token obtained');

    // Test appointment creation with firstName and lastName (no patientId)
    const appointmentData = {
      firstName: 'John',
      lastName: 'TestPatient',
      doctorId: 'your-doctor-id-here', // You'll need to replace with actual doctor ID
      date: '2025-09-15',
      time: '10:00',
      duration: 30,
      type: 'CONSULTATION',
      notes: 'Test appointment for auto patient creation',
      symptoms: 'Test symptoms'
    };

    console.log('Creating appointment with data:', appointmentData);

    const response = await axios.post('http://localhost:5000/api/appointments', appointmentData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Appointment creation response:', response.data);
    
    if (response.data.patientCreated) {
      console.log('✅ SUCCESS: New patient was automatically created!');
    } else {
      console.log('❌ ISSUE: Patient was not created automatically');
    }

  } catch (error) {
    console.error('Error testing appointment creation:', error.response?.data || error.message);
  }
}

// Run the test
testAppointmentCreation();
