const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env' });

async function tryPasswords() {
  const commonPasswords = ['', 'root', 'admin', '1234', '12345678', 'password'];
  
  for (const pwd of commonPasswords) {
    console.log(`Trying password: "${pwd}"...`);
    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: pwd
      });
      console.log(`✅ SUCCESS! Password is "${pwd}"`);
      await connection.end();
      return pwd;
    } catch (error) {
      if (error.code !== 'ER_ACCESS_DENIED_ERROR') {
        console.error(`❌ Unexpected error: ${error.message}`);
        return null;
      }
    }
  }
  console.log('❌ Could not find the password among common ones.');
  return null;
}

tryPasswords();
