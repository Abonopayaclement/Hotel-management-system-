const path = require('path');
const knex = require('knex');
const knexConfig = require('./backend/knexfile');

const db = knex(knexConfig.development);

async function test() {
  try {
    const rooms = await db('rooms')
      .join('room_types', 'rooms.type_id', 'room_types.id')
      .select('rooms.*', 'room_types.name as type_name', 'room_types.price_per_night', 'room_types.capacity');
    console.log('Rooms found:', rooms.length);
  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    process.exit();
  }
}

test();
