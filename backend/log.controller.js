const logService = require('./log.service')

async function getLogs(req, res) {
  try {
    const filterBy = {}

    if (req.query.client) filterBy.client = req.query.client
    if (req.query.country) filterBy.country = req.query.country

    if (req.query.from || req.query.to) {
      filterBy.timestamp = {}

      if (req.query.from) {
        const fromDate = new Date(req.query.from)
        fromDate.setUTCHours(0, 0, 0, 0)
        filterBy.timestamp.$gte = fromDate
      }

      if (req.query.to) {
        const toDate = new Date(req.query.to)
        toDate.setUTCHours(23, 59, 59, 999)
        filterBy.timestamp.$lte = toDate
      }
    }

    const limit = +req.query.limit || 100
    const logs = await logService.query(filterBy, limit)

    res.json(logs)
  } catch (err) {
    console.error('Failed to get logs', err)
    res.status(400).send({ err: 'Failed to get logs' })
  }
}

module.exports = {
  getLogs
}
