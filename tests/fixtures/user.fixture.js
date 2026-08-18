const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const { prisma } = require('../../src/prisma/prisma-connection');

const password = 'password1';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

// The id is generated client-side (rather than left to Prisma's DB-side default) so
// fixtures and pre-built tokens (see token.fixture.js) can reference a known user id
// before insertUsers() actually creates the row.
const userOne = {
  id: crypto.randomUUID(),
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password,
  phone: faker.phone.number(),
  role: 'user',
  isEmailVerified: false,
};

const userTwo = {
  id: crypto.randomUUID(),
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password,
  phone: faker.phone.number(),
  role: 'user',
  isEmailVerified: false,
};

const admin = {
  id: crypto.randomUUID(),
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password,
  phone: faker.phone.number(),
  role: 'admin',
  isEmailVerified: false,
};

const insertUsers = async (users) => {
  return Promise.all(
    users.map((user) =>
      prisma.user.create({
        data: { ...user, password: hashedPassword },
      }),
    ),
  );
};

module.exports = {
  userOne,
  userTwo,
  admin,
  insertUsers,
};
