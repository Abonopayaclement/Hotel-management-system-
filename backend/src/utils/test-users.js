const mysql = require('mysql2/promise');

async function tryUser(user, pwd) {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: user,
      password: pwd
    });
    console.log(`✅ SUCCESS! User: "${user}", Password: "${pwd}"`);
    await connection.end();
    return true;
  } catch (error) {
    console.log(`❌ Failed for "${user}"/"${pwd}": ${error.message}`);
    return false;
  }
}

async function run() {
  await tryUser('clement', 'clement');
  await tryUser('clement', '');
  await tryUser('admin', 'admin');
  await tryUser('admin', 'clement');
}

run();
