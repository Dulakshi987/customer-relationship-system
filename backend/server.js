const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('ENV CHECK:', {
  DB_NAME: process.env.DB_NAME,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET ? 'loaded' : 'MISSING',
});

const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Load models so Sequelize knows about them for sync/associations
require('./models/User');
require('./models/Submission');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/submissions', submissionRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// 404 handler - for unmatched routes
app.use(notFoundHandler);

// Global error handler - must be registered last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
  console.error('Failed to sync database:', err.message);
});
