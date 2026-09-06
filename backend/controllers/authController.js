const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/User');
const generateTokens = require('../utils/generateTokens');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 1. Register a new CUSTOMER
async function registerCustomer(req, res) {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'email, password and confirmPassword are required' });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if (password.length < 4) {
      return res.status(400).json({ message: 'Password must be at least 4 characters' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, role: 'CUSTOMER' });

    return res.status(201).json({
      message: 'Customer registered successfully',
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Registration failed', error: err.message });
  }
}

// 2. Customer login (only CUSTOMER role allowed)
async function loginCustomer(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || user.role !== 'CUSTOMER') {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    return res.status(200).json({
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Login failed', error: err.message });
  }
}

// 3. Admin login (only ADMIN role allowed)
async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || user.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    return res.status(200).json({
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Login failed', error: err.message });
  }
}

// 4. Create a new admin (protected - only accessible by an already-authenticated ADMIN)
async function createAdmin(req, res) {
  try {
    const { email } = req.body;
    if (!email || !EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: 'Valid email is required' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Admin email already exists' });
    }

    // Auto-generate a random password
    const randomPassword = crypto.randomBytes(6).toString('hex'); // 12-char random password
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const admin = await User.create({ email, password: hashedPassword, role: 'ADMIN' });

    return res.status(201).json({
      message: 'Admin created successfully',
      admin: { id: admin.id, email: admin.email, role: admin.role },
      generatedPassword: randomPassword, // returned once, admin should change it later
    });
  } catch (err) {
    return res.status(500).json({ message: 'Admin creation failed', error: err.message });
  }
}

module.exports = { registerCustomer, loginCustomer, loginAdmin, createAdmin };
