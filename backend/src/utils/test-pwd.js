const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env' });

async function tryPassword(pwd) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: pwd
    });
    console.log(`✅ SUCCESS! Password is "${pwd}"`);
    await connection.end();
    return true;
  } catch (error) {
    console.log(`❌ Failed for "${pwd}": ${error.message}`);
    return false;
  }
}

async function run() {
  await tryPassword('Clement');
  await tryPassword('Clement@123');
  await tryPassword('clement123');
}

run();
