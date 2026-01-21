const tradeService = require('../services/trade.service')

// ================= GET ALL =================
exports.getAll = async (req, res) => {
  const trades = await tradeService.getAll(req.user.id)
  res.json(trades)
}

// ================= CREATE =================
exports.create = async (req, res) => {
  const trade = await tradeService.create(req.user.id, req.body)
  res.json(trade)
}

// ================= SELL =================
exports.sell = async (req, res) => {
  const trade = await tradeService.sell(
    req.params.id,
    req.user.id,
    req.body.hargaJual
  )
  res.json(trade)
}

// ================= UPDATE =================
exports.update = async (req, res) => {
  const trade = await tradeService.update(
    req.params.id,
    req.user.id,
    req.body
  )
  res.json(trade)
}

// ================= REMOVE =================
exports.remove = async (req, res) => {
  await tradeService.remove(req.params.id, req.user.id)
  res.json({ success: true })
}

// ================= SUMMARY =================
exports.summary = async (req, res) => {
  const { date, month } = req.query
  const data = await tradeService.summary(req.user.id, date, month)
  res.json(data)
}

// ================= PROFIT CURVE =================
exports.profitCurve = async (req, res) => {
  const { period, type } = req.query
  const data = await tradeService.profitCurve(
    req.user.id,
    period,
    type
  )
  res.json(data)
}
