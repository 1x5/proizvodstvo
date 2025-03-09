const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  companyName: {
    type: String,
    default: 'Производственная компания'
  },
  logo: {
    type: String
  },
  taskFields: [{
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['text', 'number', 'date', 'dropdown', 'checkbox'],
      required: true
    },
    required: {
      type: Boolean,
      default: false
    },
    options: [{
      type: String
    }],
    order: {
      type: Number,
      required: true
    }
  }],
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Settings', SettingsSchema);