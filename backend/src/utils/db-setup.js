const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env' });

async function setupDatabase() {
  const connectionConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: 'holystar', // User provided password
  };

  console.log('Attempting to connect to MySQL with password "holystar"...');

  try {
    const connection = await mysql.createConnection(connectionConfig);
    console.log('✅ Connected to MySQL server.');
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    console.log(`✅ Database "${process.env.DB_NAME}" created or already exists.`);
    
    await connection.end();
    return true;
  } catch (error) {
    console.error('❌ Failed to setup database:', error.message);
    return false;
  }
}

setupDatabase();
