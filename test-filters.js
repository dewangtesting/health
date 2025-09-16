const axios = require('axios');

// Test the appointment filters
async function testFilters() {
  const baseURL = 'http://localhost:5000/api';
  
  // You'll need to replace this with a valid JWT token
  const token = 'your-jwt-token-here';
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  console.log('Testing Appointment Filters...\n');

  try {
    // Test 1: Get all appointments (no filters)
    console.log('1. Testing: Get all appointments (no filters)');
    const allResponse = await axios.get(`${baseURL}/appointments`, { headers });
    console.log(`   Result: Found ${allResponse.data.appointments.length} appointments`);
    console.log(`   Total: ${allResponse.data.pagination.total}\n`);

    // Test 2: Filter by patient name
    console.log('2. Testing: Filter by patient name "John"');
    const nameResponse = await axios.get(`${baseURL}/appointments?patientSearch=John`, { headers });
    console.log(`   Result: Found ${nameResponse.data.appointments.length} appointments`);
    console.log(`   Total: ${nameResponse.data.pagination.total}\n`);

    // Test 3: Filter by today's date
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    console.log(`3. Testing: Filter by created date "${today}"`);
    const dateResponse = await axios.get(`${baseURL}/appointments?createdDate=${today}`, { headers });
    console.log(`   Result: Found ${dateResponse.data.appointments.length} appointments`);
    console.log(`   Total: ${dateResponse.data.pagination.total}\n`);

    // Test 4: Filter by both patient name and date
    console.log(`4. Testing: Filter by patient name "John" AND created date "${today}"`);
    const bothResponse = await axios.get(`${baseURL}/appointments?patientSearch=John&createdDate=${today}`, { headers });
    console.log(`   Result: Found ${bothResponse.data.appointments.length} appointments`);
    console.log(`   Total: ${bothResponse.data.pagination.total}\n`);

    // Display sample appointment data to verify createdAt field
    if (allResponse.data.appointments.length > 0) {
      console.log('Sample appointment data:');
      const sample = allResponse.data.appointments[0];
      console.log({
        id: sample.id,
        patientName: sample.firstName && sample.lastName ? 
          `${sample.firstName} ${sample.lastName}` : 
          (sample.patient ? `${sample.patient.user.firstName} ${sample.patient.user.lastName}` : 'N/A'),
        createdAt: sample.createdAt,
        date: sample.date
      });
    }

  } catch (error) {
    console.error('Error testing filters:', error.response?.data || error.message);
    console.log('\nNote: Make sure to:');
    console.log('1. Replace "your-jwt-token-here" with a valid JWT token');
    console.log('2. Ensure the backend server is running on http://localhost:5000');
    console.log('3. You have valid authentication credentials');
  }
}

// Instructions for running the test
console.log('='.repeat(60));
console.log('APPOINTMENT FILTERS TEST SCRIPT');
console.log('='.repeat(60));
console.log('Before running this test:');
console.log('1. Start the backend server: cd backend && npm start');
console.log('2. Login to get a JWT token from the frontend');
console.log('3. Replace "your-jwt-token-here" with your actual token');
console.log('4. Run: node test-filters.js');
console.log('='.repeat(60));
console.log('');

// Run the test if token is provided
if (process.argv.includes('--run')) {
  testFilters();
} else {
  console.log('Add --run flag to execute the test: node test-filters.js --run');
}
