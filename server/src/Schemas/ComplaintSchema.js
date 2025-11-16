const mongoose = require("mongoose");
const { Schema } = mongoose;

const complaintSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  complainant: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accused: {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    institution: {
      type: Schema.Types.ObjectId,
      ref: 'Institution'
    },
    type: {
      type: String,
      enum: ['student', 'teacher', 'institutional_facility'],
      required: true
    },
    name: String // For anonymous complaints
  },
  category: {
    type: String,
    enum: ['academic', 'behavioral', 'facility', 'administrative', 'harassment', 'other'],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'resolved', 'rejected', 'in_progress'],
    default: 'pending'
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  institution: {
    type: Schema.Types.ObjectId,
    ref: 'Institution',
    required: true
  },
  evidenceFiles: [{
    filename: String,
    originalName: String,
    filePath: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  resolution: {
    description: String,
    resolvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: Date,
    resolutionSteps: [String]
  },
  poll: {
    isActive: {
      type: Boolean,
      default: false
    },
    votes: [{
      voter: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      vote: {
        type: String,
        enum: ['authentic', 'exaggerated', 'false', 'needs_investigation']
      },
      comment: String,
      votedAt: {
        type: Date,
        default: Date.now
      }
    }],
    authenticityScore: {
      type: Number,
      default: 0
    },
    totalVotes: {
      type: Number,
      default: 0
    },
    startedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    startedAt: Date,
    endedAt: Date
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  dueDate: Date,
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
complaintSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for better query performance
complaintSchema.index({ complainant: 1 });
complaintSchema.index({ 'accused.user': 1 });
complaintSchema.index({ institution: 1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ createdAt: -1 });
complaintSchema.index({ category: 1 });

module.exports = complaintSchema;