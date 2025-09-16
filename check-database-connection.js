const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabaseConnection() {
  console.log('🔍 Checking Database Connection Details\n');
  
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Get database info
    const result = await prisma.$queryRaw`SELECT DATABASE() as current_db, VERSION() as version`;
    console.log(`📊 Current Database: ${result[0].current_db}`);
    console.log(`🗄️ MySQL Version: ${result[0].version}`);
    
    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = DATABASE()
    `;
    
    console.log('\n📋 Tables in Database:');
    tables.forEach(table => {
      console.log(`   - ${table.TABLE_NAME}`);
    });
    
    // Check appointment table specifically
    const appointmentCount = await prisma.appointment.count();
    console.log(`\n📅 Appointments in database: ${appointmentCount}`);
    
    if (appointmentCount > 0) {
      const sampleAppointment = await prisma.appointment.findFirst({
        include: {
          patient: {
            include: {
              user: true
            }
          },
          doctor: {
            include: {
              user: true
            }
          }
        }
      });
      
      console.log('\n📝 Sample Appointment Data:');
      console.log(`   ID: ${sampleAppointment.id}`);
      console.log(`   Patient: ${sampleAppointment.patient.user.firstName} ${sampleAppointment.patient.user.lastName}`);
      console.log(`   Doctor: Dr. ${sampleAppointment.doctor.user.firstName} ${sampleAppointment.doctor.user.lastName}`);
      console.log(`   Date: ${sampleAppointment.date}`);
      console.log(`   Status: ${sampleAppointment.status}`);
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    if (error.code === 'P1001') {
      console.log('\n💡 Possible issues:');
      console.log('   - MySQL server is not running');
      console.log('   - Incorrect database credentials');
      console.log('   - Database "ihealth_db" does not exist');
      console.log('   - Network connectivity issues');
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseConnection();
