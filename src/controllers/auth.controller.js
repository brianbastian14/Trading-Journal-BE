const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sendEmail = require('../utils/sendEmail')
const  env  = require('../config/env');

exports.login = async (req, res) => {
  const { identifier, password } = req.body

  const user = await User.findOne({
    $or: [
      { email: identifier },
      { username: identifier }
    ]
  })

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  if (!user.isVerified) {
    return res.status(401).json({ message: 'Account not verified' })
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  )

  res.json({ token })
}

exports.sendOtp = async (req, res) => {
  const { email } = req.body

  const existing = await User.findOne({ email })
  if (existing && existing.isVerified) {
    return res.status(400).json({ message: 'Email already registered' })
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  if (existing) {
    existing.otp = otp
    existing.otpExpired = Date.now() + 5 * 60 * 1000
    await existing.save()
  } else {
    await User.create({
      email,
      otp,
      otpExpired: Date.now() + 5 * 60 * 1000
    })
  }

  await sendEmail(email, otp)
  res.json({ message: 'OTP sent' })
}

exports.register = async (req, res) => {
  const { email, username, password, otp } = req.body

  const user = await User.findOne({ email })
  if (!user) {
    return res.status(400).json({ message: 'User not found' })
  }

  if (user.otp !== otp || user.otpExpired < Date.now()) {
    return res.status(400).json({ message: 'OTP invalid or expired' })
  }

  const usernameUsed = await User.findOne({ username })
  if (usernameUsed) {
    return res.status(400).json({ message: 'Username already used' })
  }

  user.username = username
  user.password = await bcrypt.hash(password, 10)
  user.otp = null
  user.otpExpired = null
  user.isVerified = true

  await user.save()

  res.json({ message: 'Register success' })
}
