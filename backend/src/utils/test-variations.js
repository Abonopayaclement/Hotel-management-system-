const mysql = require('mysql2/promise');

async function tryPwd(pwd) {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: pwd
    });
    console.log(`✅ SUCCESS: "${pwd}"`);
    await connection.end();
    return true;
  } catch (e) {
    console.log(`❌ FAIL: "${pwd}" (${e.message})`);
    return false;
  }
}

async function run() {
  await tryPwd('holystar');
  await tryPwd('HolyStar');
  await tryPwd('HOLYSTAR');
  await tryPwd('Holy star');
  await tryPwd('holystar123');
}

run();
