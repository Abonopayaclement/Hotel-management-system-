require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Root Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Holy Star Hotel Management API' });
});

// Import Routes
const authRoutes = require('./routes/auth.routes');
const roomRoutes = require('./routes/room.routes');
const bookingRoutes = require('./routes/booking.routes');
const guestRoutes = require('./routes/guest.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const paymentRoutes = require('./routes/payment.routes');
const staffRoutes = require('./routes/staff.routes');
const housekeepingRoutes = require('./routes/housekeeping.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const notificationRoutes = require('./routes/notification.routes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/housekeeping', housekeepingRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/notifications', notificationRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('--- API ERROR ---');
  console.error(err);
  console.error('-----------------');
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
