const express = require('express');
const {
  browseInstitutions,
  getInstitutionDetails,
  getDashboardStats,
  addReview
} = require('../Controllers/institutionController');
const { auth, requireRole } = require('../middleware/auth');
const router = express.Router();

router.get('/browse', auth, browseInstitutions);
router.get('/:id', auth, getInstitutionDetails);
router.get('/dashboard/stats', auth, requireRole(['institutional']), getDashboardStats);
router.post('/:id/review', auth, requireRole(['student', 'teacher']), addReview);

module.exports = router;