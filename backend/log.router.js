const express = require('express')
const router = express.Router()
const logController = require('./log.controller')

router.get('/', logController.getLogs)

module.exports = router
