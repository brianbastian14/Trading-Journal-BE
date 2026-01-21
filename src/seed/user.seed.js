require('dotenv').config()
const mongoose = require('mongoose')
const User = require('../models/User')

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)

  const existing = await User.findOne({ username: 'admin' })
  if (existing) {
    console.log('User already exists')
    process.exit()
  }

  await User.create({
    username: 'admin',
    password: 'admin123'
  })

  console.log('User admin created')
  process.exit()
}

seed()
