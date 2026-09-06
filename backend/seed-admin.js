/**
 * Seeds the very first admin account directly into the database.
 * Needed because /auth/admin/create requires an already-authenticated admin —
 * this script breaks that chicken-and-egg problem for the initial admin.
 *
 * Usage (from the backend folder):
 *   node seed-admin.js
 *
 * Change ADMIN_EMAIL / ADMIN_PASSWORD below before running, or set them
 * via environment variables:
 *   ADMIN_EMAIL=me@example.com ADMIN_PASSWORD=secret123 node seed-admin.js
 */

const bcrypt = require('bcrypt');
const sequelize = require('./config/db');
const User = require('./models/User');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@test.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin1234';

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    // Make sure the users table exists without dropping any existing data.
    await sequelize.sync();

    const existing = await User.findOne({ where: { email: ADMIN_EMAIL } });
    if (existing) {
      if (existing.role !== 'ADMIN') {
        existing.role = 'ADMIN';
        await existing.save();
        console.log(`Existing user ${ADMIN_EMAIL} was upgraded to ADMIN role.`);
      } else {
        console.log(`Admin ${ADMIN_EMAIL} already exists. Nothing to do.`);
      }
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const admin = await User.create({
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'ADMIN',
    });

    console.log('✅ Admin account created:');
    console.log('   email:   ', admin.email);
    console.log('   password:', ADMIN_PASSWORD, '(change this after first login if needed)');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
