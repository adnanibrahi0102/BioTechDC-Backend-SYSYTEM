import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  reports: [{
    result: {
      type: String,
      required: true
    },
    unit: {
      type: String,
      required: true
    },
    tests: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test'
    }]
  }],
  status: {
    type: String,
    enum: ['pending', 'sent'],
    default: 'pending'
  }
}, { timestamps: true });

export const Report = mongoose.model('Report', reportSchema);
