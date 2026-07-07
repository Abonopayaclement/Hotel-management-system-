/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const addColumnIfMissing = async (tableName, columnName, addColumn) => {
    const hasColumn = await knex.schema.hasColumn(tableName, columnName);
    if (!hasColumn) {
      await knex.schema.alterTable(tableName, addColumn);
    }
  };

  if (!(await knex.schema.hasTable('food_orders'))) {
    await knex.schema.createTable('food_orders', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL');
      table.string('customer_name').nullable();
      table.string('customer_email').nullable();
      table.string('customer_phone').nullable();
      table.string('order_type').defaultTo('room');
      table.text('items').notNullable();
      table.decimal('total_price', 10, 2).notNullable();
      table.string('delivery_room').nullable();
      table.string('delivery_location').nullable();
      table.decimal('delivery_fee', 10, 2).defaultTo(0);
      table.string('payment_method').defaultTo('Mobile Money');
      table.string('payment_status').defaultTo('Pending');
      table.string('transaction_id').nullable();
      table.string('status').defaultTo('Pending');
      table.timestamps(true, true);
    });
  } else {
    await addColumnIfMissing('food_orders', 'customer_name', (table) => table.string('customer_name').nullable());
    await addColumnIfMissing('food_orders', 'customer_email', (table) => table.string('customer_email').nullable());
    await addColumnIfMissing('food_orders', 'customer_phone', (table) => table.string('customer_phone').nullable());
    await addColumnIfMissing('food_orders', 'order_type', (table) => table.string('order_type').defaultTo('room'));
    await addColumnIfMissing('food_orders', 'delivery_location', (table) => table.string('delivery_location').nullable());
    await addColumnIfMissing('food_orders', 'delivery_fee', (table) => table.decimal('delivery_fee', 10, 2).defaultTo(0));
    await addColumnIfMissing('food_orders', 'payment_method', (table) => table.string('payment_method').defaultTo('Mobile Money'));
    await addColumnIfMissing('food_orders', 'payment_status', (table) => table.string('payment_status').defaultTo('Pending'));
    await addColumnIfMissing('food_orders', 'transaction_id', (table) => table.string('transaction_id').nullable());
  }

  if (!(await knex.schema.hasTable('service_bookings'))) {
    await knex.schema.createTable('service_bookings', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.string('service_name').notNullable();
      table.date('booking_date').notNullable();
      table.string('booking_time').notNullable();
      table.text('notes').nullable();
      table.decimal('price', 10, 2).defaultTo(0);
      table.string('payment_method').defaultTo('Mobile Money');
      table.string('payment_status').defaultTo('Pending');
      table.string('transaction_id').nullable();
      table.string('status').defaultTo('Pending');
      table.timestamps(true, true);
    });
  } else {
    await addColumnIfMissing('service_bookings', 'price', (table) => table.decimal('price', 10, 2).defaultTo(0));
    await addColumnIfMissing('service_bookings', 'payment_method', (table) => table.string('payment_method').defaultTo('Mobile Money'));
    await addColumnIfMissing('service_bookings', 'payment_status', (table) => table.string('payment_status').defaultTo('Pending'));
    await addColumnIfMissing('service_bookings', 'transaction_id', (table) => table.string('transaction_id').nullable());
  }

  if (!(await knex.schema.hasTable('support_requests'))) {
    await knex.schema.createTable('support_requests', (table) => {
      table.increments('id').primary();
      table.string('guest_name').notNullable();
      table.string('email').notNullable();
      table.string('phone').nullable();
      table.string('room_number').nullable();
      table.string('category').notNullable();
      table.text('description').notNullable();
      table.string('urgency').defaultTo('Medium');
      table.string('status').defaultTo('Pending');
      table.timestamps(true, true);
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('support_requests');
};
