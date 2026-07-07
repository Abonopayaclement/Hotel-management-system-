const db = require('../config/db');

// Map service names to pricing in Ghana cedis (GH₵)
const SERVICE_PRICES = {
  'Gym / Fitness Center': 50.00,
  'Spa / Massage': 150.00,
  'Massage / Spa Center': 150.00,
  'Sports Complex': 80.00,
  'Indoor Games / Game Center': 40.00,
  'Clinic': 120.00,
  'Conference Halls': 1500.00,
  'Conference Hall': 1500.00,
  'Restaurant / Dining': 0.00
};

// Map service name to standard categories
const getServiceCategory = (serviceName) => {
  if (serviceName.includes('Gym') || serviceName.includes('Sports') || serviceName.includes('Pool') || serviceName.includes('Games') || serviceName.includes('Game')) {
    return 'Gym / Sports / Games';
  } else if (serviceName.includes('Massage') || serviceName.includes('Spa')) {
    return 'Massage / Spa';
  } else if (serviceName.includes('Laundry')) {
    return 'Laundry';
  } else if (serviceName.includes('Clinic')) {
    return 'Clinic';
  } else if (serviceName.includes('Conference')) {
    return 'Conference Hall';
  } else {
    return 'Other Services';
  }
};

exports.getFinanceDashboard = async (req, res) => {
  try {
    const { status, source, method, search, startDate, endDate, dateRange } = req.query;
    const hasFoodOrders = await db.schema.hasTable('food_orders');
    const hasServiceBookings = await db.schema.hasTable('service_bookings');

    // 1. Fetch Room Payments
    const roomPayments = await db('payments')
      .join('bookings', 'payments.booking_id', 'bookings.id')
      .join('guests', 'bookings.guest_id', 'guests.id')
      .select(
        'payments.id as pay_id',
        'payments.amount',
        'payments.method',
        'payments.status',
        'payments.transaction_id',
        'payments.created_at',
        'bookings.id as booking_id',
        'bookings.status as booking_status',
        'guests.full_name as guest_name'
      );

    // 2. Fetch Food Orders
    let foodOrders = [];
    if (hasFoodOrders) {
      const foodColumns = await db('food_orders').columnInfo();
      const foodSelect = [
        'food_orders.id as order_id',
        'food_orders.total_price as amount',
        'food_orders.status as order_status',
        'food_orders.delivery_room',
        'food_orders.created_at',
        'users.name as user_name'
      ];
      if (foodColumns.delivery_location) foodSelect.push('food_orders.delivery_location');
      if (foodColumns.customer_name) foodSelect.push('food_orders.customer_name');
      if (foodColumns.payment_method) foodSelect.push('food_orders.payment_method');
      if (foodColumns.transaction_id) foodSelect.push('food_orders.transaction_id');

      foodOrders = await db('food_orders')
        .leftJoin('users', 'food_orders.user_id', 'users.id')
        .select(foodSelect);
    }

    // 3. Fetch Service Bookings
    let serviceBookings = [];
    if (hasServiceBookings) {
      const serviceColumns = await db('service_bookings').columnInfo();
      const serviceSelect = [
        'service_bookings.id as service_id',
        'service_bookings.service_name',
        'service_bookings.status as service_status',
        'service_bookings.created_at',
        'users.name as guest_name'
      ];
      if (serviceColumns.price) serviceSelect.push('service_bookings.price');
      if (serviceColumns.payment_method) serviceSelect.push('service_bookings.payment_method');
      if (serviceColumns.payment_status) serviceSelect.push('service_bookings.payment_status');
      if (serviceColumns.transaction_id) serviceSelect.push('service_bookings.transaction_id');

      serviceBookings = await db('service_bookings')
        .leftJoin('users', 'service_bookings.user_id', 'users.id')
        .select(serviceSelect);
    }

    // 4. Combine and standardize all transactions
    let allTransactions = [];

    // Map payments to standard transaction format
    roomPayments.forEach(p => {
      // Differentiate Rooms vs Reservations
      // Reservations are bookings in 'Pending' or 'Confirmed' status
      // Rooms are active 'Checked In' or completed 'Checked Out' bookings
      const category = (p.booking_status === 'Checked In' || p.booking_status === 'Checked Out') 
        ? 'Rooms' 
        : 'Reservations';

      allTransactions.push({
        id: `PAY-${p.pay_id}`,
        transaction_id: p.transaction_id || `TXN-BK-${p.pay_id}`,
        guest_name: p.guest_name,
        category: category,
        reference: `BK${p.booking_id}`,
        amount: Number(p.amount),
        method: p.method,
        status: p.status, // Paid, Pending, Failed, Refunded
        date: p.created_at
      });
    });

    // Map food orders
    foodOrders.forEach(o => {
      let payStatus = 'Pending';
      if (o.order_status === 'Completed') payStatus = 'Paid';
      if (o.order_status === 'Cancelled') payStatus = 'Failed';
      const guestName = o.customer_name || o.user_name || 'Restaurant Customer';
      const reference = o.delivery_location || o.delivery_room || 'Restaurant order';

      allTransactions.push({
        id: `FOOD-${o.order_id}`,
        transaction_id: o.transaction_id || `TXN-FD-${o.order_id}`,
        guest_name: guestName,
        category: 'Restaurant',
        reference,
        amount: Number(o.amount),
        method: o.payment_method || 'Mobile Money',
        status: payStatus,
        date: o.created_at
      });
    });

    // Map service bookings
    serviceBookings.forEach(s => {
      let payStatus = 'Pending';
      if (s.payment_status === 'Paid' || s.service_status === 'Completed' || s.payment_status === 'Completed') payStatus = 'Paid';
      if (s.service_status === 'Cancelled') payStatus = 'Failed';

      const price = Number(s.price ?? SERVICE_PRICES[s.service_name] ?? 75.00);
      const category = getServiceCategory(s.service_name);

      allTransactions.push({
        id: `SRV-${s.service_id}`,
        transaction_id: s.transaction_id || `TXN-SRV-${s.service_id}`,
        guest_name: s.guest_name || 'Hotel Guest',
        category: category,
        reference: s.service_name,
        amount: price,
        method: s.payment_method || 'Mobile Money',
        status: payStatus,
        date: s.created_at
      });
    });

    // Sort all transactions by date descending
    allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 5. Apply filters
    let filteredTransactions = [...allTransactions];

    // Status Filter
    if (status && status !== 'All') {
      filteredTransactions = filteredTransactions.filter(t => t.status.toLowerCase() === status.toLowerCase());
    }

    // Category / Source Filter
    if (source && source !== 'All') {
      filteredTransactions = filteredTransactions.filter(t => t.category.toLowerCase() === source.toLowerCase());
    }

    // Payment Method Filter
    if (method && method !== 'All') {
      // Normalize Visa Card / Mastercard into 'Card'
      filteredTransactions = filteredTransactions.filter(t => {
        const tMethod = t.method.toLowerCase();
        const fMethod = method.toLowerCase();
        if (fMethod === 'card') {
          return tMethod.includes('card') || tMethod.includes('visa') || tMethod.includes('mastercard');
        }
        return tMethod === fMethod;
      });
    }

    // Search Filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredTransactions = filteredTransactions.filter(t => 
        String(t.guest_name || '').toLowerCase().includes(searchLower) ||
        String(t.transaction_id || '').toLowerCase().includes(searchLower) ||
        String(t.id || '').toLowerCase().includes(searchLower) ||
        String(t.reference || '').toLowerCase().includes(searchLower)
      );
    }

    // Date Filters
    const now = new Date();
    // Use user-provided current time or system date
    const todayStr = now.toISOString().split('T')[0];

    const getStartOfDay = (d) => {
      const date = new Date(d);
      date.setHours(0,0,0,0);
      return date;
    };

    if (dateRange && dateRange !== 'All') {
      filteredTransactions = filteredTransactions.filter(t => {
        const tDate = new Date(t.date);
        
        if (dateRange === 'Today') {
          return t.date.startsWith(todayStr);
        }
        
        if (dateRange === 'This Week') {
          // Last 7 days
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          return tDate >= oneWeekAgo;
        }
        
        if (dateRange === 'This Month') {
          // Current month
          return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
        }
        
        if (dateRange === 'This Year') {
          // Current year
          return tDate.getFullYear() === now.getFullYear();
        }

        return true;
      });
    } else if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0,0,0,0);
      const end = new Date(endDate);
      end.setHours(23,59,59,999);

      filteredTransactions = filteredTransactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate >= start && tDate <= end;
      });
    }

    // 6. Calculate Stats (on filtered or overall? Usually dashboard summary stats are overall or filtered. Let's calculate overall stats first)
    const overallPaid = allTransactions.filter(t => t.status === 'Paid');
    const overallPending = allTransactions.filter(t => t.status === 'Pending');
    const overallFailed = allTransactions.filter(t => t.status === 'Failed');

    const totalRevenue = overallPaid.reduce((sum, t) => sum + t.amount, 0);
    
    // Revenue by date buckets
    const todayRevenue = overallPaid
      .filter(t => t.date.startsWith(todayStr))
      .reduce((sum, t) => sum + t.amount, 0);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyRevenue = overallPaid
      .filter(t => new Date(t.date) >= oneWeekAgo)
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyRevenue = overallPaid
      .filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const yearlyRevenue = overallPaid
      .filter(t => new Date(t.date).getFullYear() === now.getFullYear())
      .reduce((sum, t) => sum + t.amount, 0);

    const totalPendingAmount = overallPending.reduce((sum, t) => sum + t.amount, 0);
    const totalCompletedCount = overallPaid.length;
    const totalFailedCount = overallFailed.length;
    const totalTransactionsCount = allTransactions.length;

    // Category Breakdown (Overall Paid Revenue)
    const breakdown = {
      'Rooms': 0,
      'Reservations': 0,
      'Restaurant': 0,
      'Laundry': 0,
      'Massage / Spa': 0,
      'Clinic': 0,
      'Conference Hall': 0,
      'Gym / Sports / Games': 0,
      'Other Services': 0
    };

    overallPaid.forEach(t => {
      if (breakdown[t.category] !== undefined) {
        breakdown[t.category] += t.amount;
      } else {
        breakdown['Other Services'] += t.amount;
      }
    });

    // Create percentage for each
    const breakdownList = Object.keys(breakdown).map(cat => {
      const rev = breakdown[cat];
      const percent = totalRevenue > 0 ? Math.round((rev / totalRevenue) * 100) : 0;
      return {
        category: cat,
        revenue: rev,
        percent: percent
      };
    }).sort((a, b) => b.revenue - a.revenue);

    // Pending payments list
    const pendingPaymentsList = overallPending.map(t => ({
      id: t.id,
      guest_name: t.guest_name,
      reference: t.reference,
      category: t.category,
      amount: t.amount,
      date: t.date,
      status: t.status
    }));

    res.json({
      success: true,
      stats: {
        totalRevenue,
        todayRevenue,
        weeklyRevenue,
        monthlyRevenue,
        yearlyRevenue,
        pendingAmount: totalPendingAmount,
        completedCount: totalCompletedCount,
        failedCount: totalFailedCount,
        totalTransactions: totalTransactionsCount
      },
      breakdown: breakdownList,
      transactions: filteredTransactions,
      pendingPayments: pendingPaymentsList
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAsPaid = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (id.startsWith('PAY-')) {
      const payId = id.split('-')[1];
      await db('payments').where({ id: payId }).update({ status: 'Paid' });
      
      // Update linked booking status to Confirmed if it was pending
      const payment = await db('payments').where({ id: payId }).first();
      if (payment && payment.booking_id) {
        await db('bookings').where({ id: payment.booking_id }).update({ status: 'Confirmed' });
      }
    } else if (id.startsWith('FOOD-')) {
      const orderId = id.split('-')[1];
      await db('food_orders').where({ id: orderId }).update({ status: 'Completed' });
    } else if (id.startsWith('SRV-')) {
      const serviceId = id.split('-')[1];
      await db('service_bookings').where({ id: serviceId }).update({ status: 'Completed' });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid transaction ID format' });
    }

    res.json({ success: true, message: 'Transaction marked as paid successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
