const express = require('express')
const router = express.Router()
const logController = require('./log.controller')

router.get('/', logController.getLogs)
router.get('/totals', logController.getAggregatedLogCounts)
router.get('/totals_over_time', logController.getLogCountsOverTime)

module.exports = router
