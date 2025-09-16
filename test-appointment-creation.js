const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestAppointment() {
  try {
    console.log('Creating test appointment for today...');
    
    // Get the first available doctor and patient
    const doctor = await prisma.doctor.findFirst();
    const patient = await prisma.patient.findFirst();
    const user = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    
    if (!doctor || !patient || !user) {
      console.log('Missing required data. Need at least one doctor, patient, and admin user.');
      return;
    }
    
    // Create appointment for today
    const today = new Date();
    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        userId: user.id,
        date: today,
        time: '10:00',
        duration: 30,
        type: 'CONSULTATION',
        status: 'SCHEDULED',
        firstName: 'Test',
        lastName: 'Patient',
        notes: 'Test appointment for filter testing'
      }
    });
    
    console.log('Test appointment created:', {
      id: appointment.id,
      patientName: `${appointment.firstName} ${appointment.lastName}`,
      createdAt: appointment.createdAt,
      date: appointment.date
    });
    
    // Query appointments with filters
    console.log('\nTesting filters...');
    
    // Test patient search
    const nameResults = await prisma.appointment.findMany({
      where: {
        OR: [
          {
            firstName: {
              contains: 'Test',
              mode: 'insensitive'
            }
          },
          {
            lastName: {
              contains: 'Patient',
              mode: 'insensitive'
            }
          }
        ]
      }
    });
    console.log(`Patient name search for "Test": ${nameResults.length} results`);
    
    // Test created date filter
    const todayStart = new Date(today.toISOString().split('T')[0] + 'T00:00:00.000Z');
    const todayEnd = new Date(todayStart);
    todayEnd.setUTCDate(todayEnd.getUTCDate() + 1);
    
    const dateResults = await prisma.appointment.findMany({
      where: {
        createdAt: {
          gte: todayStart,
          lt: todayEnd
        }
      }
    });
    console.log(`Created date filter for today: ${dateResults.length} results`);
    
    console.log('\nFilter test completed successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestAppointment();
