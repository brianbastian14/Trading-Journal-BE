const express = require('express')
const cors = require('cors')

const app = express()
const allowedOrigins = [
  'http://localhost:5173',
  'https://mytradejournal.vercel.app'
]


app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('CORS not allowed'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

app.get('/', (_req, res) => {
  res.type('text').send('BACKEND CONNECTED');
});

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/trades', require('./routes/trade.routes'))

module.exports = app
