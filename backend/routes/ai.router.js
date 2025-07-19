const express = require('express')
const router = express.Router()
const aiController = require('../controllers/ai.controller')

router.get('/', aiController.answerQuestion)

module.exports = router
