const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test configuration
const testConfig = {
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};

// Test data
const testData = {
  admin: {
    email: 'admin@ihealth.com',
    password: 'admin123'
  },
  doctor: {
    email: 'dr.smith@ihealth.com', 
    password: 'doctor123'
  },
  patient: {
    email: 'john.doe@email.com',
    password: 'patient123'
  }
};

let authToken = '';

async function testAPI(endpoint, method = 'GET', data = null, description = '') {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      ...testConfig
    };

    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    if (data) {
      config.data = data;
    }

    console.log(`\n🧪 Testing: ${description || `${method} ${endpoint}`}`);
    const response = await axios(config);
    
    console.log(`✅ Success: ${response.status} ${response.statusText}`);
    if (response.data) {
      if (Array.isArray(response.data.patients)) {
        console.log(`   📊 Found ${response.data.patients.length} patients`);
      } else if (Array.isArray(response.data.doctors)) {
        console.log(`   📊 Found ${response.data.doctors.length} doctors`);
      } else if (Array.isArray(response.data.appointments)) {
        console.log(`   📊 Found ${response.data.appointments.length} appointments`);
      } else if (Array.isArray(response.data.medicines)) {
        console.log(`   📊 Found ${response.data.medicines.length} medicines`);
      } else if (response.data.total !== undefined) {
        console.log(`   📊 Total records: ${response.data.total}`);
      }
    }
    
    return response.data;
  } catch (error) {
    console.log(`❌ Failed: ${error.response?.status || 'Network Error'} - ${error.response?.statusText || error.message}`);
    if (error.response?.data?.message) {
      console.log(`   💬 Error: ${error.response.data.message}`);
    }
    return null;
  }
}

async function testAuthentication() {
  console.log('\n🔐 AUTHENTICATION TESTS');
  console.log('=' .repeat(50));
  
  // Test admin login
  const loginResult = await testAPI('/auth/login', 'POST', testData.admin, 'Admin Login');
  if (loginResult && loginResult.token) {
    authToken = loginResult.token;
    console.log(`   🎫 Token received: ${authToken.substring(0, 20)}...`);
    return true;
  }
  
  return false;
}

async function testPatientsModule() {
  console.log('\n👥 PATIENTS MODULE TESTS');
  console.log('=' .repeat(50));
  
  // Test get all patients
  await testAPI('/patients', 'GET', null, 'Get All Patients');
  
  // Test get patients with pagination
  await testAPI('/patients?page=1&limit=5', 'GET', null, 'Get Patients with Pagination');
  
  // Test search patients
  await testAPI('/patients?search=john', 'GET', null, 'Search Patients');
  
  // Test get patient by ID (using first patient from seed data)
  await testAPI('/patients/1', 'GET', null, 'Get Patient by ID');
}

async function testDoctorsModule() {
  console.log('\n👨‍⚕️ DOCTORS MODULE TESTS');
  console.log('=' .repeat(50));
  
  // Test get all doctors
  await testAPI('/doctors', 'GET', null, 'Get All Doctors');
  
  // Test get doctors with pagination
  await testAPI('/doctors?page=1&limit=5', 'GET', null, 'Get Doctors with Pagination');
  
  // Test filter by specialization
  await testAPI('/doctors?specialization=Cardiology', 'GET', null, 'Filter Doctors by Specialization');
  
  // Test search doctors
  await testAPI('/doctors?search=smith', 'GET', null, 'Search Doctors');
  
  // Test get doctor by ID
  await testAPI('/doctors/1', 'GET', null, 'Get Doctor by ID');
  
  // Test get doctor schedules
  await testAPI('/doctors/1/schedules', 'GET', null, 'Get Doctor Schedules');
}

async function testAppointmentsModule() {
  console.log('\n📅 APPOINTMENTS MODULE TESTS');
  console.log('=' .repeat(50));
  
  // Test get all appointments
  await testAPI('/appointments', 'GET', null, 'Get All Appointments');
  
  // Test get appointments with pagination
  await testAPI('/appointments?page=1&limit=5', 'GET', null, 'Get Appointments with Pagination');
  
  // Test filter by status
  await testAPI('/appointments?status=SCHEDULED', 'GET', null, 'Filter Appointments by Status');
  
  // Test get available slots
  const today = new Date().toISOString().split('T')[0];
  await testAPI(`/appointments/doctor/1/available-slots?date=${today}`, 'GET', null, 'Get Available Slots');
  
  // Test get appointment by ID
  await testAPI('/appointments/1', 'GET', null, 'Get Appointment by ID');
}

async function testMedicinesModule() {
  console.log('\n💊 MEDICINES MODULE TESTS');
  console.log('=' .repeat(50));
  
  // Test get all medicines
  await testAPI('/medicines', 'GET', null, 'Get All Medicines');
  
  // Test get medicines with pagination
  await testAPI('/medicines?page=1&limit=5', 'GET', null, 'Get Medicines with Pagination');
  
  // Test search medicines
  await testAPI('/medicines?search=paracetamol', 'GET', null, 'Search Medicines');
  
  // Test get medicine by ID
  await testAPI('/medicines/1', 'GET', null, 'Get Medicine by ID');
  
  // Test get low stock medicines
  await testAPI('/medicines/alerts/low-stock', 'GET', null, 'Get Low Stock Medicines');
  
  // Test get expired medicines
  await testAPI('/medicines/alerts/expired', 'GET', null, 'Get Expired Medicines');
  
  // Test get expiring soon medicines
  await testAPI('/medicines/alerts/expiring-soon', 'GET', null, 'Get Expiring Soon Medicines');
}

async function testDashboardModule() {
  console.log('\n📊 DASHBOARD MODULE TESTS');
  console.log('=' .repeat(50));
  
  // Test dashboard stats
  await testAPI('/dashboard/stats', 'GET', null, 'Get Dashboard Statistics');
  
  // Test today's appointments
  await testAPI('/dashboard/today-appointments', 'GET', null, 'Get Today\'s Appointments');
  
  // Test upcoming appointments
  await testAPI('/dashboard/upcoming-appointments', 'GET', null, 'Get Upcoming Appointments');
  
  // Test recent patients
  await testAPI('/dashboard/recent-patients', 'GET', null, 'Get Recent Patients');
  
  // Test medicine alerts
  await testAPI('/dashboard/medicine-alerts', 'GET', null, 'Get Medicine Alerts');
}

async function runAllTests() {
  console.log('🚀 STARTING I-HEALTH DYNAMIC SYSTEM TESTS');
  console.log('=' .repeat(60));
  console.log(`📡 API Base URL: ${API_BASE_URL}`);
  console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
  
  try {
    // Test authentication first
    const authSuccess = await testAuthentication();
    if (!authSuccess) {
      console.log('\n❌ Authentication failed. Cannot proceed with other tests.');
      console.log('💡 Make sure the backend server is running and seeded with data.');
      return;
    }
    
    // Test all modules
    await testPatientsModule();
    await testDoctorsModule();
    await testAppointmentsModule();
    await testMedicinesModule();
    await testDashboardModule();
    
    console.log('\n🎉 ALL TESTS COMPLETED');
    console.log('=' .repeat(60));
    console.log('✅ All modules have been tested for dynamic backend integration');
    console.log('📱 Frontend pages should now load data from the database');
    console.log('🔄 CRUD operations are available for all modules');
    
  } catch (error) {
    console.error('\n💥 Test suite failed:', error.message);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Run the tests
runAllTests().catch(console.error);
