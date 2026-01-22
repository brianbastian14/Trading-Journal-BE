const express = require('express')
const cors = require('cors')

const app = express()

app.use((req, res, next) => {
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://mytradejournal.vercel.app'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,DELETE,OPTIONS'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  )
  res.setHeader(
    'Access-Control-Allow-Credentials',
    'true'
  )

  // ⬅️ INI SUDAH CUKUP, JANGAN app.options('*')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }

  next()
})

app.use(express.json())

app.get('/', (_req, res) => {
  res.type('text').send('BACKEND CONNECTED');
});

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/trades', require('./routes/trade.routes'))

module.exports = app
