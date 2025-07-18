const express = require('express')
const router = express.Router()
const aiController = require('./ai.controller')

router.get('/question', aiController.answerQuestion)

module.exports = router
