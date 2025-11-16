const express = require('express');
const {
  lodgeComplaint,
  getComplaintsAgainstMe,
  getComplaintHistory,
  getComplaintDetails,
  getInstitutionalComplaints,
  updateComplaintStatus,
  startPoll,
  voteInPoll,
  endPoll
} = require('../Controllers/complaintController');
const { auth, requireRole } = require('../middleware/auth');
const router = express.Router();

// Specific routes BEFORE generic :id routes (prevents :id from matching everything)

// Student/Teacher routes
router.post('/lodge', auth, requireRole(['student', 'teacher']), lodgeComplaint);
router.get('/complaints-on-me', auth, requireRole(['student', 'teacher']), getComplaintsAgainstMe);
router.get('/history', auth, requireRole(['student', 'teacher']), getComplaintHistory);

// Institutional routes
router.get('/institutional/all', auth, requireRole(['institutional']), getInstitutionalComplaints);

// Generic :id routes AFTER specific routes
router.get('/:id', auth, getComplaintDetails);
router.put('/:id/status', auth, requireRole(['institutional']), updateComplaintStatus);
router.post('/:id/start-poll', auth, requireRole(['institutional']), startPoll);
router.post('/:id/vote', auth, requireRole(['student', 'teacher']), voteInPoll);
router.post('/:id/end-poll', auth, requireRole(['institutional']), endPoll);

module.exports = router;