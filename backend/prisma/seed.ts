import { PrismaClient, Role, TripStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // Seed Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      name: 'Admin User',
      password: passwordHash,
      role: Role.ADMIN,
    },
  });
  console.log('Admin user created:', admin.email);

  // Seed Driver
  const driver = await prisma.user.upsert({
    where: { email: 'driver@test.com' },
    update: {},
    create: {
      email: 'driver@test.com',
      name: 'Driver User',
      password: passwordHash,
      role: Role.DRIVER,
    },
  });
  console.log('Driver user created:', driver.email);

  // Seed 10 Trips
  for (let i = 1; i <= 10; i++) {
    await prisma.trip.create({
      data: {
        vehicleNumber: `V-${1000 + i}`,
        origin: `City ${i}`,
        destination: `City ${i + 1}`,
        scheduledStart: new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000), // Future dates
        notes: `Sample trip ${i}`,
        status: i % 2 === 0 ? TripStatus.SCHEDULED : TripStatus.IN_PROGRESS,
        driverId: driver.id,
      },
    });
  }
  console.log('10 Sample trips created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
