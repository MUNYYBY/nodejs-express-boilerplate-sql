const { prisma, connectDatabase, disconnectDatabase } = require('../../src/prisma/prisma-connection');

const setupTestDB = () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  beforeEach(async () => {
    await prisma.token.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });
};

module.exports = setupTestDB;
