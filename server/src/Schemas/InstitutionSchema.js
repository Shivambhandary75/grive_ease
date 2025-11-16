const mongoose = require("mongoose");
const { Schema } = mongoose;

const institutionSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  contact: {
    phone: String,
    website: String,
    principalName: String,
    principalEmail: String
  },
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  departments: [String],
  facilities: [String],
  stats: {
    totalComplaints: {
      type: Number,
      default: 0
    },
    resolvedComplaints: {
      type: Number,
      default: 0
    },
    pendingComplaints: {
      type: Number,
      default: 0
    },
    inProgressComplaints: {
      type: Number,
      default: 0
    },
    resolutionRate: {
      type: Number,
      default: 0
    },
    averageResolutionTime: {
      type: Number,
      default: 0
    },
    studentComplaints: {
      type: Number,
      default: 0
    },
    teacherComplaints: {
      type: Number,
      default: 0
    },
    facilityComplaints: {
      type: Number,
      default: 0
    }
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    },
    reviews: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
    rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  subscription: {
    type: String,
    enum: ['free', 'premium', 'enterprise'],
    default: 'free'
  },
  features: {
    polls: {
      type: Boolean,
      default: false
    },
    analytics: {
      type: Boolean,
      default: true
    },
    customCategories: {
      type: Boolean,
      default: false
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update stats method
institutionSchema.methods.updateStats = async function() {
  const Complaint = mongoose.model('Complaint');
  
  const stats = await Complaint.aggregate([
    { $match: { institution: this._id } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        resolved: { 
          $sum: { 
            $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] 
          } 
        },
        pending: { 
          $sum: { 
            $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] 
          } 
        },
        inProgress: { 
          $sum: { 
            $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] 
          } 
        },
        studentComplaints: {
          $sum: {
            $cond: [{ $eq: ['$accused.type', 'student'] }, 1, 0]
          }
        },
        teacherComplaints: {
          $sum: {
            $cond: [{ $eq: ['$accused.type', 'teacher'] }, 1, 0]
          }
        },
        facilityComplaints: {
          $sum: {
            $cond: [{ $eq: ['$accused.type', 'institutional_facility'] }, 1, 0]
          }
        }
      }
    }
  ]);

  if (stats.length > 0) {
    this.stats = {
      totalComplaints: stats[0].total,
      resolvedComplaints: stats[0].resolved,
      pendingComplaints: stats[0].pending,
      inProgressComplaints: stats[0].inProgress,
      resolutionRate: stats[0].total > 0 ? (stats[0].resolved / stats[0].total) * 100 : 0,
      studentComplaints: stats[0].studentComplaints,
      teacherComplaints: stats[0].teacherComplaints,
      facilityComplaints: stats[0].facilityComplaints
    };

    // Calculate rating based on multiple factors
    const resolutionRate = this.stats.resolutionRate;
    const resolvedCount = this.stats.resolvedComplaints;
    const baseRating = (resolutionRate / 20); // Convert percentage to 0-5 scale
    const volumeBonus = Math.min(resolvedCount * 0.01, 2); // Bonus for handling volume (max 2 points)
    const speedBonus = this.stats.averageResolutionTime < 7 ? 0.5 : 0; // Bonus for quick resolution
    
    this.rating.average = Math.min(baseRating + volumeBonus + speedBonus, 5);
    this.rating.count = resolvedCount;
  }

  await this.save();
};

module.exports = institutionSchema;