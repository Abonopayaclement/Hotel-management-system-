const knex = require('knex');
const path = require('path');

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, 'backend', 'src', 'database', 'hotel.sqlite')
  },
  useNullAsDefault: true
});

async function checkDb() {
  try {
    const rooms = await db('rooms').select('*');
    console.log('Rooms:', rooms.length);
    if (rooms.length > 0) {
      console.log('First room:', rooms[0]);
    }
    const roomTypes = await db('room_types').select('*');
    console.log('Room Types:', roomTypes.length);
    if (roomTypes.length > 0) {
      console.log('First room type:', roomTypes[0]);
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await db.destroy();
  }
}

checkDb();
