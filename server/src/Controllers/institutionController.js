const Institution = require('../Models/Institution');
const Complaint = require('../Models/Complaint');
const User = require('../Models/UserModel');

// Browse institutions with search and filtering
exports.browseInstitutions = async (req, res) => {
  try {
    const { 
      search, 
      minRating, 
      maxRating, 
      minResolved, 
      sortBy = 'rating', 
      page = 1, 
      limit = 10 
    } = req.query;
    
    let filter = { isActive: true };
    
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    
    if (minRating || maxRating) {
      filter['rating.average'] = {};
      if (minRating) filter['rating.average'].$gte = parseFloat(minRating);
      if (maxRating) filter['rating.average'].$lte = parseFloat(maxRating);
    }

    if (minResolved) {
      filter['stats.resolvedComplaints'] = { $gte: parseInt(minResolved) };
    }

    let sort = {};
    switch(sortBy) {
      case 'rating':
        sort = { 'rating.average': -1, 'stats.resolvedComplaints': -1 };
        break;
      case 'resolved':
        sort = { 'stats.resolvedComplaints': -1 };
        break;
      case 'name':
        sort = { name: 1 };
        break;
      case 'resolution_rate':
        sort = { 'stats.resolutionRate': -1 };
        break;
      default:
        sort = { 'rating.average': -1 };
    }

    const institutions = await Institution.find(filter)
      .select('name address contact stats rating features subscription')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Institution.countDocuments(filter);

    res.json({
      institutions,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Browse institutions error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get institution details
exports.getInstitutionDetails = async (req, res) => {
  try {
    const institution = await Institution.findById(req.params.id)
      .select('name address contact stats rating departments features subscription')
      .populate('admin', 'name email');

    if (!institution) {
      return res.status(404).json({ message: 'Institution not found' });
    }

    // Get complaint statistics by category
    const categoryStats = await Complaint.aggregate([
      { 
        $match: { 
          institution: institution._id,
          status: 'resolved'
        } 
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgResolutionTime: {
            $avg: {
              $divide: [
                { $subtract: ['$resolution.resolvedAt', '$createdAt'] },
                1000 * 60 * 60 * 24 // Convert to days
              ]
            }
          }
        }
      }
    ]);

    // Get recent resolved complaints
    const recentResolved = await Complaint.find({
      institution: institution._id,
      status: 'resolved'
    })
    .select('title category severity createdAt resolution.resolvedAt')
    .populate('complainant', 'name role')
    .sort({ 'resolution.resolvedAt': -1 })
    .limit(5);

    res.json({
      institution,
      categoryStats,
      recentResolved,
      performance: {
        resolutionRate: institution.stats.resolutionRate,
        avgResolutionTime: institution.stats.averageResolutionTime,
        totalResolved: institution.stats.resolvedComplaints
      }
    });
  } catch (error) {
    console.error('Get institution details error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Institutional dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const institution = await Institution.findById(req.user.institution);
    
    // Update stats first
    await institution.updateStats();

    // Get complaints by status
    const complaintsByStatus = await Complaint.aggregate([
      { $match: { institution: req.user.institution } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Get complaints by category
    const complaintsByCategory = await Complaint.aggregate([
      { $match: { institution: req.user.institution } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Get complaints by severity
    const complaintsBySeverity = await Complaint.aggregate([
      { $match: { institution: req.user.institution } },
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);

    // Get resolution timeline (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const resolutionTimeline = await Complaint.aggregate([
      { 
        $match: { 
          institution: req.user.institution,
          status: 'resolved',
          'resolution.resolvedAt': { $gte: sixMonthsAgo }
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: '$resolution.resolvedAt' },
            month: { $month: '$resolution.resolvedAt' }
          },
          count: { $sum: 1 },
          avgResolutionDays: {
            $avg: {
              $divide: [
                { $subtract: ['$resolution.resolvedAt', '$createdAt'] },
                1000 * 60 * 60 * 24 // Convert to days
              ]
            }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get top complainants
    const topComplainants = await Complaint.aggregate([
      { $match: { institution: req.user.institution } },
      {
        $group: {
          _id: '$complainant',
          count: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $project: {
          name: { $arrayElemAt: ['$user.name', 0] },
          role: { $arrayElemAt: ['$user.role', 0] },
          count: 1,
          resolved: 1
        }
      }
    ]);

    res.json({
      institutionStats: institution.stats,
      rating: institution.rating,
      complaintsByStatus,
      complaintsByCategory,
      complaintsBySeverity,
      resolutionTimeline,
      topComplainants
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add review/rating for institution
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const institution = await Institution.findById(req.params.id);
    
    if (!institution) {
      return res.status(404).json({ message: 'Institution not found' });
    }

    // Check if user belongs to this institution
    if (req.user.institution.toString() !== institution._id.toString()) {
      return res.status(403).json({ message: 'You can only review your own institution' });
    }

    // Check if user already reviewed
    const existingReviewIndex = institution.rating.reviews.findIndex(
      review => review.user.toString() === req.user._id.toString()
    );

    if (existingReviewIndex > -1) {
      // Update existing review
      institution.rating.reviews[existingReviewIndex].rating = rating;
      institution.rating.reviews[existingReviewIndex].comment = comment;
    } else {
      // Add new review
      institution.rating.reviews.push({
        user: req.user._id,
        rating,
        comment
      });
    }

    // Recalculate average rating
    const totalRating = institution.rating.reviews.reduce((sum, review) => sum + review.rating, 0);
    institution.rating.average = totalRating / institution.rating.reviews.length;
    institution.rating.count = institution.rating.reviews.length;

    await institution.save();

    res.json({ 
      message: 'Review submitted successfully', 
      rating: institution.rating 
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};