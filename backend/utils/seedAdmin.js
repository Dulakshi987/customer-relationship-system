require('dotenv').config();
const bcrypt = require('bcrypt');
const sequelize = require('../config/db');
const User = require('../models/User');

async function seed() {
  await sequelize.sync();

  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    console.log('Seed admin already exists:', email);
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ email, password: hashedPassword, role: 'ADMIN' });

  console.log('Seed admin created:', email, '/ password:', password);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err.message);
  process.exit(1);
});
