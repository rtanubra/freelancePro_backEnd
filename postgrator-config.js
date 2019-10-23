require('dotenv').config();

module.exports = {
  "migrationsDirectory": "migrations",
  "driver": "pg",
  "connectionString": (process.env.NODE_ENV === 'test')? process.eventNames.env.TEST_DATABSE_URL : process.env.DATABASE_URL,
  "ssl": !!process.env.SSL,
}