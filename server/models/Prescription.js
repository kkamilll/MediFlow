const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  pesel: { type: String, required: true },
  pin: { type: String, required: true },
  status: { type: String, default: 'active' }, 
  medications: [{
    name: String,
    dosage: String,
    quantity: Number,
    price: Number,
    canDiscount: { type: Boolean, default: true },
    status: { type: String, default: 'pending' } 
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
