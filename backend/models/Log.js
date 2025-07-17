const mongoose = require('mongoose')
const logSchema = new mongoose.Schema({}, { strict: false })
module.exports = mongoose.model('Log', logSchema, 'jobskill-logs')