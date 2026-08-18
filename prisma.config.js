require('dotenv').config();
const { defineConfig, env } = require('prisma/config');

module.exports = defineConfig({
  schema: 'src/prisma/schema.prisma',
  migrations: {
    path: 'src/prisma/migrations',
    seed: 'node src/prisma/seed.js',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
