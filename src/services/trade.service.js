const Trade = require('../models/Trade')
const mongoose = require('mongoose')

// ================= GET ALL =================
exports.getAll = async (userId) => {
  return Trade.find({ userId }).sort({ tradeDate: 1 })
}

// ================= CREATE =================
exports.create = async (userId, data) => {
  return Trade.create({
    ...data,
    userId
  })
}

// ================= SELL =================
exports.sell = async (id, userId, hargaJual) => {
  return Trade.findOneAndUpdate(
    { _id: id, userId },
    {
      hargaJual,
      status: 'SELL',
      sellDate: new Date()
    },
    { new: true }
  )
}

// ================= UPDATE =================
exports.update = async (id, userId, data) => {
  return Trade.findOneAndUpdate(
    { _id: id, userId },
    {
      tradeDate: data.tradeDate,
      hargaBeli: data.hargaBeli,
      jumlahLot: data.jumlahLot,
      targetPercent: data.targetPercent,
      cutLossPercent: data.cutLossPercent,
      status: data.status
    },
    { new: true }
  )
}

// ================= REMOVE =================
exports.remove = async (id, userId) => {
  return Trade.findOneAndDelete({ _id: id, userId })
}

// ================= SUMMARY =================
exports.summary = async (userId, date, month) => {
  const baseMatch = {
    userId: new mongoose.Types.ObjectId(userId),
    status: 'SELL'
  }

  const total = await Trade.aggregate([
    { $match: baseMatch },
    {
      $project: {
        profit: {
          $multiply: [
            { $subtract: ['$hargaJual', '$hargaBeli'] },
            '$jumlahLot',
            100
          ]
        }
      }
    },
    { $group: { _id: null, value: { $sum: '$profit' } } }
  ])

  let dailyProfit = 0
  if (date) {
    const start = new Date(date)
    const end = new Date(date)
    end.setDate(end.getDate() + 1)

    const daily = await Trade.aggregate([
      {
        $match: {
          ...baseMatch,
          sellDate: { $gte: start, $lt: end }
        }
      },
      {
        $project: {
          profit: {
            $multiply: [
              { $subtract: ['$hargaJual', '$hargaBeli'] },
              '$jumlahLot',
              100
            ]
          }
        }
      },
      { $group: { _id: null, value: { $sum: '$profit' } } }
    ])

    dailyProfit = daily[0]?.value || 0
  }

  let monthlyProfit = 0
  if (month) {
    const [year, m] = month.split('-')
    const startMonth = new Date(year, m - 1, 1)
    const endMonth = new Date(year, m, 1)

    const monthly = await Trade.aggregate([
      {
        $match: {
          ...baseMatch,
          tradeDate: { $gte: startMonth, $lt: endMonth }
        }
      },
      {
        $project: {
          profit: {
            $multiply: [
              { $subtract: ['$hargaJual', '$hargaBeli'] },
              '$jumlahLot',
              100
            ]
          }
        }
      },
      { $group: { _id: null, value: { $sum: '$profit' } } }
    ])

    monthlyProfit = monthly[0]?.value || 0
  }

  return {
    totalProfit: total[0]?.value || 0,
    dailyProfit,
    monthlyProfit
  }
}

// ================= PROFIT CURVE =================
exports.profitCurve = async (userId, period = 'daily', type = 'equity') => {
  let groupFormat = '%Y-%m-%d'
  if (period === 'monthly') groupFormat = '%Y-%m'
  if (period === 'yearly') groupFormat = '%Y'

  const data = await Trade.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        status: 'SELL'
      }
    },
    {
      $project: {
        label: {
          $dateToString: { format: groupFormat, date: '$sellDate' }
        },
        profit: {
          $multiply: [
            { $subtract: ['$hargaJual', '$hargaBeli'] },
            '$jumlahLot',
            100
          ]
        }
      }
    },
    {
      $group: {
        _id: '$label',
        dailyProfit: { $sum: '$profit' }
      }
    },
    { $sort: { _id: 1 } }
  ])

  if (type === 'daily') {
    return data.map(d => ({
      label: d._id,
      value: d.dailyProfit
    }))
  }

  let equity = 0
  return data.map(d => {
    equity += d.dailyProfit
    return { label: d._id, value: equity }
  })
}
