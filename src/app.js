const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors({
  origin: [
    'https://trading-journal-fe.vercel.app',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))

app.options('*', cors())
app.use(express.json())

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/trades', require('./routes/trade.routes'))

module.exports = app
