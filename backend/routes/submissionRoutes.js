const express = require('express');
const router = express.Router();
const {
  createSubmission,
  getAllSubmissions,
  updateSubmission,
  deleteSubmission,
} = require('../controllers/submissionController');
const { verifyToken, requireRole } = require('../middleware/auth');

// Customer protected route
router.post('/', verifyToken, requireRole('CUSTOMER'), createSubmission);

// Admin protected routes
router.get('/', verifyToken, requireRole('ADMIN'), getAllSubmissions);
router.put('/:id', verifyToken, requireRole('ADMIN'), updateSubmission);
router.delete('/:id', verifyToken, requireRole('ADMIN'), deleteSubmission);

module.exports = router;
