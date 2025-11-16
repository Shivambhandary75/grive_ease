const Complaint = require('../Models/Complaint');
const Institution = require('../Models/Institution');
const User = require('../Models/UserModel');

// Lodge complaint (Student/Teacher)
exports.lodgeComplaint = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      accusedUserId, 
      accusedType, 
      accusedName,
      category, 
      severity, 
      isAnonymous,
      tags 
    } = req.body;

    if (!['student', 'teacher', 'institutional_facility'].includes(accusedType)) {
      return res.status(400).json({ message: 'Invalid accused type' });
    }

    let accused = { type: accusedType };
    
    if (accusedType === 'institutional_facility') {
      accused.institution = req.user.institution;
      accused.name = accusedName || 'Institutional Facility';
    } else {
      if (!accusedUserId) {
        return res.status(400).json({ message: 'Accused user ID is required' });
      }
      
      const accusedUser = await User.findOne({
        _id: accusedUserId,
        institution: req.user.institution
      });
      
      if (!accusedUser) {
        return res.status(404).json({ message: 'Accused user not found in your institution' });
      }
      
      accused.user = accusedUserId;
      accused.name = isAnonymous ? 'Anonymous' : accusedUser.name;
    }

    const complaint = new Complaint({
      title,
      description,
      complainant: req.user._id,
      accused,
      category,
      severity,
      isAnonymous: isAnonymous || false,
      institution: req.user.institution,
      tags: tags || [],
      priority: severity === 'critical' ? 'urgent' : 
               severity === 'high' ? 'high' : 'medium'
    });

    await complaint.save();

    // Update institution stats
    const institution = await Institution.findById(req.user.institution);
    await institution.updateStats();

    res.status(201).json({ 
      message: 'Complaint lodged successfully', 
      complaint: {
        id: complaint._id,
        title: complaint.title,
        status: complaint.status,
        createdAt: complaint.createdAt
      }
    });
  } catch (error) {
    console.error('Lodge complaint error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get complaints against me (Student/Teacher)
exports.getComplaintsAgainstMe = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let filter = { 
      $or: [
        { 'accused.user': req.user._id },
        { 
          'accused.name': req.user.name,
          'accused.user': { $exists: false }
        }
      ]
    };

    if (status) {
      filter.status = status;
    }

    const complaints = await Complaint.find(filter)
      .populate('complainant', 'name role')
      .populate('institution', 'name')
      .populate('resolution.resolvedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Complaint.countDocuments(filter);

    res.json({
      complaints,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get complaints on me error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get complaint history - complaints filed by user (Student/Teacher)
exports.getComplaintHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let filter = { complainant: req.user._id };
    if (status) {
      filter.status = status;
    }

    const complaints = await Complaint.find(filter)
      .populate('accused.user', 'name role studentId employeeId')
      .populate('institution', 'name')
      .populate('resolution.resolvedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Complaint.countDocuments(filter);

    res.json({
      complaints,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get complaint history error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get complaint details
exports.getComplaintDetails = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('complainant', 'name role studentId employeeId')
      .populate('accused.user', 'name role studentId employeeId')
      .populate('resolution.resolvedBy', 'name')
      .populate('institution', 'name');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Check if user has permission to view this complaint
    const canView = 
      complaint.complainant._id.toString() === req.user._id.toString() ||
      (complaint.accused.user && complaint.accused.user._id.toString() === req.user._id.toString()) ||
      (req.user.role === 'institutional' && complaint.institution._id.toString() === req.user.institution.toString());

    if (!canView) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(complaint);
  } catch (error) {
    console.error('Get complaint details error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Institutional: Get all complaints for institution
exports.getInstitutionalComplaints = async (req, res) => {
  try {
    const { 
      status, 
      category, 
      severity,
      priority,
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    let filter = { institution: req.user.institution };
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (severity) filter.severity = severity;
    if (priority) filter.priority = priority;

    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const complaints = await Complaint.find(filter)
      .populate('complainant', 'name role studentId employeeId department')
      .populate('accused.user', 'name role studentId employeeId department')
      .populate('resolution.resolvedBy', 'name')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Complaint.countDocuments(filter);

    // Get stats for filters
    const stats = await Complaint.aggregate([
      { $match: { institution: req.user.institution } },
      {
        $group: {
          _id: null,
          statusCounts: {
            $push: '$status'
          },
          categoryCounts: {
            $push: '$category'
          },
          severityCounts: {
            $push: '$severity'
          }
        }
      }
    ]);

    res.json({
      complaints,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
      stats: stats[0] || {}
    });
  } catch (error) {
    console.error('Get institutional complaints error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Institutional: Update complaint status
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status, resolutionDescription, resolutionSteps } = req.body;
    
    const complaint = await Complaint.findOne({
      _id: req.params.id,
      institution: req.user.institution
    });

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;
    
    if (status === 'resolved') {
      complaint.resolution = {
        description: resolutionDescription,
        resolvedBy: req.user._id,
        resolvedAt: new Date(),
        resolutionSteps: resolutionSteps || []
      };
    } else if (status === 'in_progress') {
      complaint.priority = 'high';
    }

    await complaint.save();

    // Update institution stats
    const institution = await Institution.findById(req.user.institution);
    await institution.updateStats();

    res.json({ 
      message: 'Complaint status updated successfully', 
      complaint: {
        id: complaint._id,
        status: complaint.status,
        priority: complaint.priority,
        resolution: complaint.resolution
      }
    });
  } catch (error) {
    console.error('Update complaint status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Start poll for complaint authenticity
exports.startPoll = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      _id: req.params.id,
      institution: req.user.institution
    });

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Check if institution has poll feature
    const institution = await Institution.findById(req.user.institution);
    if (!institution.features.polls && institution.subscription === 'free') {
      return res.status(403).json({ 
        message: 'Poll feature is not available for your subscription plan' 
      });
    }

    complaint.poll = {
      isActive: true,
      votes: [],
      authenticityScore: 0,
      totalVotes: 0,
      startedBy: req.user._id,
      startedAt: new Date()
    };

    await complaint.save();

    res.json({ 
      message: 'Poll started successfully', 
      poll: complaint.poll 
    });
  } catch (error) {
    console.error('Start poll error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Vote in poll
exports.voteInPoll = async (req, res) => {
  try {
    const { vote, comment } = req.body;
    
    const complaint = await Complaint.findById(req.params.id)
      .populate('institution');
    
    if (!complaint || !complaint.poll.isActive) {
      return res.status(400).json({ message: 'Poll not active or complaint not found' });
    }

    // Check if user belongs to the same institution
    if (complaint.institution._id.toString() !== req.user.institution.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if user already voted
    const existingVoteIndex = complaint.poll.votes.findIndex(
      v => v.voter.toString() === req.user._id.toString()
    );

    if (existingVoteIndex > -1) {
      // Update existing vote
      complaint.poll.votes[existingVoteIndex].vote = vote;
      complaint.poll.votes[existingVoteIndex].comment = comment;
      complaint.poll.votes[existingVoteIndex].votedAt = new Date();
    } else {
      // Add new vote
      complaint.poll.votes.push({
        voter: req.user._id,
        vote,
        comment,
        votedAt: new Date()
      });
    }

    // Calculate authenticity score
    const votes = complaint.poll.votes;
    const authenticCount = votes.filter(v => v.vote === 'authentic').length;
    const exaggeratedCount = votes.filter(v => v.vote === 'exaggerated').length;
    const falseCount = votes.filter(v => v.vote === 'false').length;
    const needsInvestigationCount = votes.filter(v => v.vote === 'needs_investigation').length;
    
    const totalWeighted = (authenticCount * 1) + (exaggeratedCount * 0.5) + (falseCount * 0) + (needsInvestigationCount * 0.75);
    complaint.poll.authenticityScore = totalWeighted / votes.length;
    complaint.poll.totalVotes = votes.length;

    await complaint.save();

    res.json({ 
      message: 'Vote recorded successfully', 
      vote: {
        vote,
        comment,
        authenticityScore: complaint.poll.authenticityScore,
        totalVotes: complaint.poll.totalVotes
      }
    });
  } catch (error) {
    console.error('Vote in poll error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// End poll
exports.endPoll = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      _id: req.params.id,
      institution: req.user.institution
    });

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.poll.isActive = false;
    complaint.poll.endedAt = new Date();

    // Update complaint priority based on poll results
    if (complaint.poll.authenticityScore < 0.3) {
      complaint.priority = 'low';
    } else if (complaint.poll.authenticityScore < 0.7) {
      complaint.priority = 'medium';
    } else {
      complaint.priority = 'high';
    }

    await complaint.save();

    res.json({ 
      message: 'Poll ended successfully', 
      poll: complaint.poll,
      updatedPriority: complaint.priority
    });
  } catch (error) {
    console.error('End poll error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};