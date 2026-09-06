const express = require('express');
const router = express.Router();
const { registerCustomer, loginCustomer, loginAdmin, createAdmin, refreshToken } = require('../controllers/authController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.post('/admin/login', loginAdmin);
router.post('/refresh', refreshToken);

// Protected: only an authenticated ADMIN can create another admin
router.post('/admin/create', verifyToken, requireRole('ADMIN'), createAdmin);

module.exports = router;
