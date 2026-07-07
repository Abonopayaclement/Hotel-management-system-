const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deleting existing entries in reverse order of dependencies
  await knex('notifications').del();
  await knex('inventory').del();
  await knex('housekeeping').del();
  await knex('payments').del();
  await knex('bookings').del();
  await knex('staff').del();
  await knex('guests').del();
  await knex('rooms').del();
  await knex('room_types').del();
  await knex('users').del();
  await knex('roles').del();

  // 1. Roles
  const roles = [
    { name: 'Super Admin' },
    { name: 'Hotel Manager' },
    { name: 'Receptionist' },
    { name: 'Housekeeper' },
    { name: 'Accountant' },
    { name: 'Customer' }
  ];
  await knex('roles').insert(roles);

  const dbRoles = await knex('roles').select('*');
  const roleMap = {};
  dbRoles.forEach(r => { roleMap[r.name] = r.id; });

  // 2. Users
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const users = [
    { role_id: roleMap['Super Admin'], name: 'Abonopaya Clement Ayebono', email: 'admin@holystar.com', password: hashedPassword },
    { role_id: roleMap['Hotel Manager'], name: 'Cynthia Appiah', email: 'manager@holystar.com', password: hashedPassword },
    { role_id: roleMap['Receptionist'], name: 'Kofi Mensah', email: 'receptionist@holystar.com', password: hashedPassword },
    { role_id: roleMap['Housekeeper'], name: 'Abena Osei', email: 'housekeeper@holystar.com', password: hashedPassword },
    { role_id: roleMap['Accountant'], name: 'Kwame Boateng', email: 'accountant@holystar.com', password: hashedPassword },
    { role_id: roleMap['Customer'], name: 'John Anderson', email: 'customer1@gmail.com', password: hashedPassword },
    { role_id: roleMap['Customer'], name: 'Sarah Williams', email: 'customer2@gmail.com', password: hashedPassword }
  ];
  await knex('users').insert(users);

  const dbUsers = await knex('users').select('*');
  const userMap = {};
  dbUsers.forEach(u => { userMap[u.email] = u.id; });

  // 3. Room Types
  const roomTypes = [
    { name: 'Single', description: 'Cozy single room for solo travelers', price_per_night: 150.00, capacity: 1, amenities: JSON.stringify(['Free WiFi', 'AC', 'TV']) },
    { name: 'Double', description: 'Comfortable double room for couples', price_per_night: 250.00, capacity: 2, amenities: JSON.stringify(['Free WiFi', 'AC', 'TV', 'Mini Bar']) },
    { name: 'Deluxe', description: 'Spacious deluxe room with city view', price_per_night: 400.00, capacity: 2, amenities: JSON.stringify(['Free WiFi', 'AC', 'TV', 'Mini Bar', 'Bathtub']) },
    { name: 'Executive', description: 'Premium executive room with lounge access', price_per_night: 600.00, capacity: 3, amenities: JSON.stringify(['Free WiFi', 'AC', 'TV', 'Mini Bar', 'Bathtub', 'Balcony']) },
    { name: 'Presidential Suite', description: 'Ultimate luxury suite with all amenities', price_per_night: 1200.00, capacity: 4, amenities: JSON.stringify(['Free WiFi', 'AC', 'TV', 'Mini Bar', 'Bathtub', 'Private Terrace', 'Jacuzzi']) },
    { name: 'Duplex Suite', description: 'Two-story luxury suite with high ceilings and spiral staircase', price_per_night: 1800.00, capacity: 5, amenities: JSON.stringify(['Free WiFi', 'AC', 'TV', 'Mini Bar', 'Bathtub', 'Private Plunge Pool', 'Kitchenette']) }
  ];
  await knex('room_types').insert(roomTypes);

  const dbRoomTypes = await knex('room_types').select('*');
  const typeMap = {};
  dbRoomTypes.forEach(t => { typeMap[t.name] = t.id; });

  // 4. Rooms
  const rooms = [];
  const roomTypesList = ['Single', 'Double', 'Deluxe', 'Executive', 'Presidential Suite', 'Duplex Suite'];
  
  roomTypesList.forEach((typeName, index) => {
    for (let i = 1; i <= 5; i++) {
      let status = 'Available';
      // Set some specific status for testing
      if (typeName === 'Single' && i === 1) status = 'Occupied';
      if (typeName === 'Double' && i === 1) status = 'Reserved';
      if (typeName === 'Deluxe' && i === 1) status = 'Maintenance';
      if (typeName === 'Executive' && i === 1) status = 'Cleaning';
      
      rooms.push({
        type_id: typeMap[typeName],
        room_number: `${index + 1}0${i}`,
        floor: index + 1,
        status: status
      });
    }
  });
  await knex('rooms').insert(rooms);

  const dbRooms = await knex('rooms').select('*');
  const roomMapObj = {};
  dbRooms.forEach(r => { roomMapObj[r.room_number] = r.id; });

  // 5. Guests
  const guests = [
    { user_id: userMap['customer1@gmail.com'], full_name: 'John Anderson', email: 'customer1@gmail.com', phone: '+233244123456', nationality: 'American', id_type: 'Passport', id_number: 'US123456' },
    { user_id: userMap['customer2@gmail.com'], full_name: 'Sarah Williams', email: 'customer2@gmail.com', phone: '+233200112233', nationality: 'British', id_type: 'Passport', id_number: 'UK987654' },
    { user_id: null, full_name: 'Michael Johnson', email: 'michael@gmail.com', phone: '+233544998877', nationality: 'Canadian', id_type: 'Driver License', id_number: 'CAN555666' },
    { user_id: null, full_name: 'Emma Davis', email: 'emma.davis@yahoo.com', phone: '+233501234567', nationality: 'Nigerian', id_type: 'National ID', id_number: 'NGA888999' },
    { user_id: null, full_name: 'Robert Martinez', email: 'robert.m@gmail.com', phone: '+233277889900', nationality: 'German', id_type: 'Passport', id_number: 'GER444333' },
    { user_id: null, full_name: 'Abonopaya Clement', email: 'clement@gmail.com', phone: '+233550941056', nationality: 'Ghanaian', id_type: 'Voter ID', id_number: 'GHA111222' }
  ];
  await knex('guests').insert(guests);

  const dbGuests = await knex('guests').select('*');
  const guestMap = {};
  dbGuests.forEach(g => { guestMap[g.full_name] = g.id; });

  // 6. Bookings (5-7 realistic bookings)
  const bookings = [
    {
      guest_id: guestMap['John Anderson'],
      room_id: roomMapObj['101'],
      check_in: '2026-06-15',
      check_out: '2026-06-18',
      guests_count: 1,
      total_price: 450.00,
      status: 'Confirmed'
    },
    {
      guest_id: guestMap['Sarah Williams'],
      room_id: roomMapObj['201'],
      check_in: '2026-06-20',
      check_out: '2026-06-25',
      guests_count: 2,
      total_price: 1250.00,
      status: 'Confirmed'
    },
    {
      guest_id: guestMap['Michael Johnson'],
      room_id: roomMapObj['301'],
      check_in: '2026-06-12',
      check_out: '2026-06-15',
      guests_count: 2,
      total_price: 1200.00,
      status: 'Checked In'
    },
    {
      guest_id: guestMap['Emma Davis'],
      room_id: roomMapObj['401'],
      check_in: '2026-06-22',
      check_out: '2026-06-28',
      guests_count: 3,
      total_price: 3600.00,
      status: 'Pending'
    },
    {
      guest_id: guestMap['Robert Martinez'],
      room_id: roomMapObj['501'],
      check_in: '2026-06-10',
      check_out: '2026-06-12',
      guests_count: 4,
      total_price: 2400.00,
      status: 'Checked Out'
    },
    {
      guest_id: guestMap['Abonopaya Clement'],
      room_id: roomMapObj['102'],
      check_in: '2026-06-08',
      check_out: '2026-06-09',
      guests_count: 1,
      total_price: 150.00,
      status: 'Cancelled'
    }
  ];
  await knex('bookings').insert(bookings);

  const dbBookings = await knex('bookings').select('*');
  
  // 7. Payments
  const payments = [
    { booking_id: dbBookings[0].id, amount: 450.00, method: 'Visa Card', status: 'Paid', transaction_id: 'TXN001' },
    { booking_id: dbBookings[1].id, amount: 1250.00, method: 'Visa Card', status: 'Paid', transaction_id: 'TXN002' },
    { booking_id: dbBookings[2].id, amount: 1200.00, method: 'Mastercard', status: 'Paid', transaction_id: 'TXN003' },
    { booking_id: dbBookings[3].id, amount: 3600.00, method: 'Mobile Money', status: 'Pending', transaction_id: null },
    { booking_id: dbBookings[4].id, amount: 2400.00, method: 'Visa Card', status: 'Paid', transaction_id: 'TXN004' },
    { booking_id: dbBookings[5].id, amount: 150.00, method: 'Cash', status: 'Failed', transaction_id: 'TXN005' }
  ];
  await knex('payments').insert(payments);

  // 8. Staff
  const staff = [
    { user_id: userMap['manager@holystar.com'], position: 'Hotel Manager', salary: 5000.00, department: 'Management' },
    { user_id: userMap['receptionist@holystar.com'], position: 'Receptionist', salary: 3000.00, department: 'Front Desk' },
    { user_id: userMap['housekeeper@holystar.com'], position: 'Housekeeper', salary: 2000.00, department: 'Housekeeping' },
    { user_id: userMap['accountant@holystar.com'], position: 'Accountant', salary: 4000.00, department: 'Finance' }
  ];
  await knex('staff').insert(staff);

  const dbStaff = await knex('staff').select('*');

  // 9. Housekeeping
  const housekeeping = [
    { room_id: roomMapObj['101'], staff_id: dbStaff[2].id, status: 'Clean', last_cleaned: '2026-06-12 08:00:00' },
    { room_id: roomMapObj['201'], staff_id: dbStaff[2].id, status: 'In Progress', last_cleaned: null },
    { room_id: roomMapObj['301'], staff_id: dbStaff[2].id, status: 'Dirty', last_cleaned: null },
    { room_id: roomMapObj['401'], staff_id: dbStaff[2].id, status: 'Completed', last_cleaned: '2026-06-11 15:00:00' }
  ];
  await knex('housekeeping').insert(housekeeping);

  // 10. Inventory
  const inventory = [
    { item_name: 'Bed Sheets', quantity: 120, unit: 'pieces', min_stock: 50 },
    { item_name: 'Towels', quantity: 150, unit: 'pieces', min_stock: 60 },
    { item_name: 'Soap Bars', quantity: 30, unit: 'pieces', min_stock: 100 }, // Under stock
    { item_name: 'Toilet Paper Rolls', quantity: 45, unit: 'rolls', min_stock: 50 }, // Under stock
    { item_name: 'Shampoo Bottles', quantity: 200, unit: 'bottles', min_stock: 80 },
    { item_name: 'Tea Bags', quantity: 500, unit: 'bags', min_stock: 150 }
  ];
  await knex('inventory').insert(inventory);

  // 11. Notifications
  const adminId = userMap['admin@holystar.com'];
  const notifications = [
    { user_id: adminId, message: 'Low Stock Alert: Soap Bars quantity (30) is below minimum stock level (100)', is_read: false },
    { user_id: adminId, message: 'Low Stock Alert: Toilet Paper Rolls quantity (45) is below minimum stock level (50)', is_read: false },
    { user_id: adminId, message: 'New Reservation: Booking #1004 created for guest Emma Davis', is_read: false },
    { user_id: adminId, message: 'Guest Check-In: Michael Johnson checked into Room 301', is_read: false },
    { user_id: adminId, message: 'Guest Check-Out: Robert Martinez checked out of Room 501', is_read: true },
    { user_id: adminId, message: 'Payment Received: GH₵450.00 received from John Anderson', is_read: true },
    { user_id: adminId, message: 'Payment Failed: GH₵150.00 payment failed for Abonopaya Clement', is_read: false }
  ];
  await knex('notifications').insert(notifications);

  // 12. Seed Food Orders if table exists
  const hasFoodOrders = await knex.schema.hasTable('food_orders');
  if (hasFoodOrders) {
    await knex('food_orders').del();
    const foodOrders = [
      { user_id: userMap['customer1@gmail.com'], items: 'Club Sandwich, French Fries, Coca Cola', total_price: 120.00, status: 'Completed', delivery_room: '101', created_at: '2026-06-16 12:30:00' },
      { user_id: userMap['customer2@gmail.com'], items: 'Jollof Rice with Grilled Chicken, Fruit Juice', total_price: 85.00, status: 'Pending', delivery_room: '201', created_at: '2026-06-23 13:15:00' },
      { user_id: userMap['customer1@gmail.com'], items: 'Assorted Pizza (Large), Garlic Bread, Red Wine', total_price: 320.00, status: 'Completed', delivery_room: '101', created_at: '2026-06-20 20:00:00' },
      { user_id: userMap['customer2@gmail.com'], items: 'Banku with Tilapia, Water', total_price: 95.00, status: 'Cancelled', delivery_room: '201', created_at: '2026-06-22 18:45:00' }
    ];
    await knex('food_orders').insert(foodOrders);
  }

  // 13. Seed Service Bookings if table exists
  const hasServiceBookings = await knex.schema.hasTable('service_bookings');
  if (hasServiceBookings) {
    await knex('service_bookings').del();
    const serviceBookings = [
      { user_id: userMap['customer1@gmail.com'], service_name: 'Massage / Spa Center', booking_date: '2026-06-16', booking_time: '14:00', status: 'Completed', notes: 'Swedish massage', created_at: '2026-06-16 10:00:00' },
      { user_id: userMap['customer2@gmail.com'], service_name: 'Gym / Fitness Center', booking_date: '2026-06-21', booking_time: '08:00', status: 'Completed', notes: 'Cardio training session', created_at: '2026-06-20 17:00:00' },
      { user_id: userMap['customer2@gmail.com'], service_name: 'Laundry', booking_date: '2026-06-24', booking_time: '10:00', status: 'Pending', notes: 'Wash and fold dry clean', created_at: '2026-06-23 09:00:00' },
      { user_id: userMap['customer1@gmail.com'], service_name: 'Conference Hall', booking_date: '2026-06-25', booking_time: '09:00', status: 'Pending', notes: 'Corporate business retreat', created_at: '2026-06-22 11:30:00' },
      { user_id: userMap['customer2@gmail.com'], service_name: 'Clinic', booking_date: '2026-06-18', booking_time: '11:00', status: 'Completed', notes: 'Routine checkup', created_at: '2026-06-18 10:30:00' }
    ];
    await knex('service_bookings').insert(serviceBookings);
  }
};
