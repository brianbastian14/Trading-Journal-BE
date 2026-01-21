const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },

  username: {
    type: String,
    unique: true,
    sparse: true // ⬅️ BOLEH NULL, TAPI TETAP UNIQUE
  },

  password: {
    type: String
  },

  otp: String,
  otpExpired: Date,

  isVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema)