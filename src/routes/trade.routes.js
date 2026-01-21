const router = require('express').Router()
const auth = require('../middleware/auth.middleware')
const tradeController = require('../controllers/trade.controller')

router.get('/', auth, tradeController.getAll)
router.post('/', auth, tradeController.create)
router.put('/:id/sell', auth, tradeController.sell)
router.put('/:id', auth, tradeController.update)
router.get('/summary', auth, tradeController.summary)
router.delete('/:id', auth, tradeController.remove)
router.get('/profit-curve', auth, tradeController.profitCurve)

module.exports = router
