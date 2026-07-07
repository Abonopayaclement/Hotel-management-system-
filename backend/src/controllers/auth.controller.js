const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role_id } = req.body;
    const normalizedEmail = email ? email.trim().toLowerCase() : '';

    console.log(`[Auth Register] Attempting registration: name="${name}", email="${normalizedEmail}", role_id=${role_id}`);

    // Check if user exists
    const existingUser = await db('users').where({ email: normalizedEmail }).first();
    if (existingUser) {
      console.log(`[Auth Register] User already exists: ${normalizedEmail}`);
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    let targetRoleId = role_id;
    if (!targetRoleId) {
      const customerRole = await db('roles').where({ name: 'Customer' }).first();
      if (customerRole) {
        targetRoleId = customerRole.id;
      } else {
        const firstRole = await db('roles').first();
        targetRoleId = firstRole ? firstRole.id : 6;
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [userId] = await db('users').insert({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role_id: targetRoleId
    });

    console.log(`[Auth Register] User registered successfully. ID: ${userId}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      userId
    });
  } catch (error) {
    console.error(`[Auth Register] Error registering user:`, error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email ? email.trim().toLowerCase() : '';

    console.log(`[Auth Login] Attempting login for email="${normalizedEmail}"`);

    const user = await db('users')
      .leftJoin('roles', 'users.role_id', 'roles.id')
      .select('users.*', 'roles.name as role_name')
      .where('users.email', normalizedEmail)
      .first();

    if (!user) {
      console.log(`[Auth Login] User not found with email: ${normalizedEmail}`);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const roleName = user.role_name || 'Customer';
    console.log(`[Auth Login] User found. ID: ${user.id}, Role: ${roleName}`);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`[Auth Login] Password matches: ${isMatch}`);
    
    if (!isMatch) {
      console.log(`[Auth Login] Password comparison failed for user: ${normalizedEmail}`);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: roleName },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log(`[Auth Login] Login successful. Token generated for user ID: ${user.id}`);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: roleName
      }
    });
  } catch (error) {
    console.error(`[Auth Login] Error logging in user:`, error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  // Logic to get current user from token (middleware will populate req.user)
  res.json({ success: true, user: req.user });
};
