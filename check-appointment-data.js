const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAppointmentData() {
  console.log('🔍 Checking Appointment Table Data\n');
  
  try {
    // Check total appointment count
    const totalAppointments = await prisma.appointment.count();
    console.log(`📊 Total Appointments: ${totalAppointments}`);
    
    if (totalAppointments === 0) {
      console.log('❌ No appointments found in database');
      console.log('💡 Run: node seed.js to create sample data');
      return;
    }

    // Get all appointments with related data
    const appointments = await prisma.appointment.findMany({
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
                lastName: true,
                email: true
              }
            }
          }
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            role: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    console.log('\n📋 Appointment Details:\n');
    
    appointments.forEach((apt, index) => {
      console.log(`${index + 1}. Appointment ID: ${apt.id}`);
      console.log(`   Patient: ${apt.patient.user.firstName} ${apt.patient.user.lastName}`);
      console.log(`   Doctor: Dr. ${apt.doctor.user.firstName} ${apt.doctor.user.lastName}`);
      console.log(`   Specialization: ${apt.doctor.specialization}`);
      console.log(`   Date: ${apt.date.toDateString()}`);
      console.log(`   Time: ${apt.time}`);
      console.log(`   Duration: ${apt.duration} minutes`);
      console.log(`   Type: ${apt.type}`);
      console.log(`   Status: ${apt.status}`);
      console.log(`   Notes: ${apt.notes || 'None'}`);
      console.log(`   Symptoms: ${apt.symptoms || 'None'}`);
      console.log(`   Created: ${apt.createdAt.toLocaleString()}`);
      console.log('   ' + '─'.repeat(50));
    });

    // Check appointment status distribution
    const statusCounts = await prisma.appointment.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    console.log('\n📈 Appointment Status Distribution:');
    statusCounts.forEach(status => {
      console.log(`   ${status.status}: ${status._count.status} appointments`);
    });

    // Check appointment types
    const typeCounts = await prisma.appointment.groupBy({
      by: ['type'],
      _count: {
        type: true
      }
    });

    console.log('\n🏥 Appointment Type Distribution:');
    typeCounts.forEach(type => {
      console.log(`   ${type.type}: ${type._count.type} appointments`);
    });

    // Check upcoming appointments
    const today = new Date();
    const upcomingAppointments = await prisma.appointment.count({
      where: {
        date: {
          gte: today
        },
        status: {
          in: ['SCHEDULED', 'CONFIRMED']
        }
      }
    });

    console.log(`\n⏰ Upcoming Appointments: ${upcomingAppointments}`);

    // Check doctors with appointments
    const doctorsWithAppointments = await prisma.doctor.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        _count: {
          select: {
            appointments: true
          }
        }
      }
    });

    console.log('\n👩‍⚕️ Doctors and Their Appointment Counts:');
    doctorsWithAppointments.forEach(doctor => {
      console.log(`   Dr. ${doctor.user.firstName} ${doctor.user.lastName} (${doctor.specialization}): ${doctor._count.appointments} appointments`);
    });

    // Check patients with appointments
    const patientsWithAppointments = await prisma.patient.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        _count: {
          select: {
            appointments: true
          }
        }
      }
    });

    console.log('\n👤 Patients and Their Appointment Counts:');
    patientsWithAppointments.forEach(patient => {
      console.log(`   ${patient.user.firstName} ${patient.user.lastName}: ${patient._count.appointments} appointments`);
    });

    console.log('\n✅ Appointment data check completed!');

  } catch (error) {
    console.error('❌ Error checking appointment data:', error.message);
    
    if (error.code === 'P1001') {
      console.log('💡 Database connection failed. Please check:');
      console.log('   - MySQL server is running');
      console.log('   - Database credentials in .env file');
      console.log('   - Database "ihealth_db" exists');
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Run the check
checkAppointmentData();
