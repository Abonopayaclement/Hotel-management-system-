const knex = require('knex');
const path = require('path');

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, 'src', 'database', 'hotel.sqlite')
  },
  useNullAsDefault: true
});

async function check() {
  try {
    const rooms = await db('rooms').select('*');
    console.log('Rooms:', rooms.length);
    if (rooms.length > 0) {
      console.log('First Room:', rooms[0]);
    }
    const types = await db('room_types').select('*');
    console.log('Types:', types.length);
    if (types.length > 0) {
      console.log('First Type:', types[0]);
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await db.destroy();
  }
}

check();
