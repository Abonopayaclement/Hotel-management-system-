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
    // 1. Create support_requests table
    const hasSupport = await db.schema.hasTable('support_requests');
    if (!hasSupport) {
      await db.schema.createTable('support_requests', (table) => {
        table.increments('id').primary();
        table.string('guest_name').notNullable();
        table.string('email').notNullable();
        table.string('phone').notNullable();
        table.string('room_number').nullable();
        table.string('category').notNullable();
        table.text('description').notNullable();
        table.string('urgency').defaultTo('Medium');
        table.string('status').defaultTo('Pending');
        table.timestamps(true, true);
      });
      console.log('Created support_requests table.');
    } else {
      console.log('support_requests table already exists.');
    }

    // 2. Create service_bookings table
    const hasServiceBookings = await db.schema.hasTable('service_bookings');
    if (!hasServiceBookings) {
      await db.schema.createTable('service_bookings', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.string('service_name').notNullable();
        table.string('booking_date').notNullable();
        table.string('booking_time').notNullable();
        table.string('status').defaultTo('Pending');
        table.text('notes').nullable();
        table.timestamps(true, true);
      });
      console.log('Created service_bookings table.');
    } else {
      console.log('service_bookings table already exists.');
    }

    // 3. Create food_orders table
    const hasFoodOrders = await db.schema.hasTable('food_orders');
    if (!hasFoodOrders) {
      await db.schema.createTable('food_orders', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.text('items').notNullable();
        table.decimal('total_price', 10, 2).notNullable();
        table.string('status').defaultTo('Pending');
        table.string('delivery_room').notNullable();
        table.timestamps(true, true);
      });
      console.log('Created food_orders table.');
    } else {
      console.log('food_orders table already exists.');
    }

    const rooms = await db('rooms').select('*');
    console.log('Rooms:', rooms.length);
    const types = await db('room_types').select('*');
    console.log('Types:', types.length);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await db.destroy();
  }
}

check();

