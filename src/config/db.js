const psql = require("pg");
const { Pool } = psql;

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
// const db = new Pool({
//     connectionString: process.env.DATABASE_URL || 'postgresql://billhikmah:bill21@localhost:5432/billhikmah',
//     ssl: process.env.DATABASE_URL ? true : false
// });
module.exports = db;
