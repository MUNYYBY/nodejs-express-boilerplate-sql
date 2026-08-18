const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('12345678', 10); // Replace 'your_password_here' with the actual password

  await prisma.user.create({
    data: {
      name: 'LogicLeaps',
      email: 'info@logicleaps.com',
      password: hashedPassword,
      phone: '123456789',
      role: 'admin',
      isEmailVerified: true,
      companyName: 'LogicLeaps',
      companyDomain: 'https://logicleaps.com',
      companyAddress: 'xyz',
      postalCode: '63100',
      city: 'BWP',
      country: 'PK',
      isBlock: false,
    },
  });

  // eslint-disable-next-line no-console
  console.log('User Seeded successfully');
}

main()
  .catch(() => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
