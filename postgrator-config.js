require('dotenv').config();
console.log(process.env.DATABASE_URL)
module.exports = {
  "migrationDirectory": "migrations",
  "driver": "pg",
  "database" : "gig24",
  "role" : "dunder-mifflin",
  "connectionString": (process.env.NODE_ENV === 'test')
     ? process.env.TEST_DATABASE_URL
     : process.env.DATABASE_URL,
     //"postgresql://dunder-mifflin@localhost/gig24",
     "ssl": !!process.env.SSL,
}
