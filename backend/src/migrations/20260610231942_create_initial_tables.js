/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('roles', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable().unique();
    })
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.integer('role_id').unsigned().references('id').inTable('roles').onDelete('CASCADE');
      table.string('name').notNullable();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.string('profile_img').nullable();
      table.timestamps(true, true);
    })
    .createTable('room_types', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.text('description');
      table.decimal('price_per_night', 10, 2).notNullable();
      table.integer('capacity').notNullable();
      table.json('amenities');
    })
    .createTable('rooms', (table) => {
      table.increments('id').primary();
      table.integer('type_id').unsigned().references('id').inTable('room_types').onDelete('CASCADE');
      table.string('room_number').notNullable().unique();
      table.integer('floor').notNullable();
      table.enum('status', ['Available', 'Occupied', 'Reserved', 'Cleaning', 'Maintenance']).defaultTo('Available');
    })
    .createTable('guests', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
      table.string('full_name').notNullable();
      table.string('email').notNullable();
      table.string('phone').notNullable();
      table.string('nationality');
      table.string('id_type');
      table.string('id_number');
      table.timestamps(true, true);
    })
    .createTable('bookings', (table) => {
      table.increments('id').primary();
      table.integer('guest_id').unsigned().references('id').inTable('guests').onDelete('CASCADE');
      table.integer('room_id').unsigned().references('id').inTable('rooms').onDelete('CASCADE');
      table.date('check_in').notNullable();
      table.date('check_out').notNullable();
      table.integer('guests_count').notNullable();
      table.decimal('total_price', 10, 2).notNullable();
      table.enum('status', ['Pending', 'Confirmed', 'Checked In', 'Checked Out', 'Cancelled']).defaultTo('Pending');
      table.timestamps(true, true);
    })
    .createTable('payments', (table) => {
      table.increments('id').primary();
      table.integer('booking_id').unsigned().references('id').inTable('bookings').onDelete('CASCADE');
      table.decimal('amount', 10, 2).notNullable();
      table.enum('method', ['Mobile Money', 'Visa Card', 'Mastercard', 'Cash']).notNullable();
      table.enum('status', ['Paid', 'Pending', 'Failed', 'Refunded']).defaultTo('Pending');
      table.string('transaction_id').nullable();
      table.timestamps(true, true);
    })
    .createTable('staff', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.string('position').notNullable();
      table.decimal('salary', 10, 2).notNullable();
      table.string('department').notNullable();
      table.timestamps(true, true);
    })
    .createTable('housekeeping', (table) => {
      table.increments('id').primary();
      table.integer('room_id').unsigned().references('id').inTable('rooms').onDelete('CASCADE');
      table.integer('staff_id').unsigned().references('id').inTable('staff').onDelete('SET NULL');
      table.enum('status', ['Clean', 'Dirty', 'In Progress', 'Completed']).defaultTo('Dirty');
      table.timestamp('last_cleaned').nullable();
      table.timestamps(true, true);
    })
    .createTable('inventory', (table) => {
      table.increments('id').primary();
      table.string('item_name').notNullable();
      table.integer('quantity').notNullable();
      table.string('unit').notNullable();
      table.integer('min_stock').notNullable();
      table.timestamps(true, true);
    })
    .createTable('notifications', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.string('message').notNullable();
      table.boolean('is_read').defaultTo(false);
      table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('notifications')
    .dropTableIfExists('inventory')
    .dropTableIfExists('housekeeping')
    .dropTableIfExists('payments')
    .dropTableIfExists('bookings')
    .dropTableIfExists('staff')
    .dropTableIfExists('guests')
    .dropTableIfExists('rooms')
    .dropTableIfExists('room_types')
    .dropTableIfExists('users')
    .dropTableIfExists('roles');
};
