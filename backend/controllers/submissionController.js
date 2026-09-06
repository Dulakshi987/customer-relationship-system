const { Op } = require('sequelize');
const Submission = require('../models/Submission');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^0\d{9}$/; // e.g. local Sri Lankan format: 0771234567
const VALID_GENDERS = ['MALE', 'FEMALE', 'OTHER'];

// 1. Create submission (customer protected)
async function createSubmission(req, res) {
  try {
    const { firstName, lastName, email, gender, mobileNumber, address, feedback } = req.body;

    if (!firstName || !firstName.trim()) return res.status(400).json({ message: 'firstName is required' });
    if (!lastName || !lastName.trim()) return res.status(400).json({ message: 'lastName is required' });
    if (!email || !EMAIL_REGEX.test(email)) return res.status(400).json({ message: 'Valid email is required' });
    if (!gender || !VALID_GENDERS.includes(gender)) return res.status(400).json({ message: 'gender must be MALE, FEMALE or OTHER' });
    if (!mobileNumber || !MOBILE_REGEX.test(mobileNumber)) return res.status(400).json({ message: 'Invalid mobile number format' });
    if (!address || !address.trim()) return res.status(400).json({ message: 'address is required' });

    const existing = await Submission.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'A submission with this email already exists' });

    const submission = await Submission.create({
      firstName, lastName, email, gender, mobileNumber, address,
      feedback: feedback || null,
      userCreated: req.user.id,
      dateCreated: new Date(),
    });

    return res.status(201).json({ message: 'Submission created', submission });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create submission', error: err.message });
  }
}

// 2. Get all submissions (admin) with optional gender filter + name search
async function getAllSubmissions(req, res) {
  try {
    const { gender, search } = req.query;
    const where = {};

    if (gender) {
      if (!VALID_GENDERS.includes(gender)) {
        return res.status(400).json({ message: 'Invalid gender filter' });
      }
      where.gender = gender;
    }

    if (search) {
      where[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
      ];
    }

    const submissions = await Submission.findAll({ where, order: [['dateCreated', 'DESC']] });
    return res.status(200).json({ count: submissions.length, submissions });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch submissions', error: err.message });
  }
}

// 3. Update a submission by ID (admin)
async function updateSubmission(req, res) {
  try {
    const { id } = req.params;
    const submission = await Submission.findByPk(id);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    const { firstName, lastName, email, gender, mobileNumber, address, feedback } = req.body;

    if (email && !EMAIL_REGEX.test(email)) return res.status(400).json({ message: 'Invalid email format' });
    if (gender && !VALID_GENDERS.includes(gender)) return res.status(400).json({ message: 'Invalid gender value' });
    if (mobileNumber && !MOBILE_REGEX.test(mobileNumber)) return res.status(400).json({ message: 'Invalid mobile number format' });

    await submission.update({
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(email && { email }),
      ...(gender && { gender }),
      ...(mobileNumber && { mobileNumber }),
      ...(address && { address }),
      ...(feedback !== undefined && { feedback }),
      userModified: req.user.id,
      dateModified: new Date(),
    });

    return res.status(200).json({ message: 'Submission updated', submission });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update submission', error: err.message });
  }
}

// 4. Delete a submission by ID (admin)
async function deleteSubmission(req, res) {
  try {
    const { id } = req.params;
    const submission = await Submission.findByPk(id);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    await submission.destroy();
    return res.status(200).json({ message: 'Submission deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete submission', error: err.message });
  }
}

module.exports = { createSubmission, getAllSubmissions, updateSubmission, deleteSubmission };
