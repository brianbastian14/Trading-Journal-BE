const mongoose = require('mongoose')

const TradeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  tradeDate: Date,
  sellDate: Date, 
  saham: String,
  hargaBeli: Number,
  hargaJual: Number,
  jumlahLot: Number,
  targetPercent: Number,
  cutLossPercent: Number,
  status: {
    type: String,
    enum: ['OPEN_ORDER', 'MATCHED', 'SELL'],
    default: 'MATCHED'
  }
}, { timestamps: true })

module.exports = mongoose.model('Trade', TradeSchema)