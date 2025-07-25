const logService = require('../services/log.service')

async function getLogs(req, res) {
  try {
    const filterBy = {}
    if (req.query.client) filterBy.client = req.query.client
    if (req.query.country) filterBy.country = req.query.country

    if (req.query.from || req.query.to) {
      filterBy.timestamp = {}

      if (req.query.from) {
        const fromDate = new Date(req.query.from)
        fromDate.setUTCHours(23, 59, 59, 999)
        filterBy.from = fromDate
      }

      if (req.query.to) {
        const toDate = new Date(req.query.to)
        toDate.setUTCHours(23, 59, 59, 999)
        filterBy.to = toDate
      }
    }
    
    if (req.query.sortField) filterBy.sortField = req.query.sortField
    if (req.query.sortDir) filterBy.sortDir = req.query.sortDir

    const page = parseInt(req.query.page) || 0
    const pageSize = parseInt(req.query.pageSize) || 25

    const { logs, total } = await logService.query(filterBy, pageSize, page)
    res.json({ logs, total })
  } catch (err) {
    console.error('Failed to get logs', err)
    res.status(500).send({ error: 'Failed to get logs', detail: err.message })
  }
}

async function getAggregatedLogCounts(req, res) {
  try {
    const fromDate = new Date(req.query.from)
    fromDate.setUTCHours(0, 0, 0, 0)
    const totals = await logService.getLogsTotal(fromDate)
    res.json({ totals })
  } catch (err) {
    console.error('Failed to get aggregated log counts', err)
    res.status(500).send({ error: 'Failed to get aggregated log counts', detail: err.message })
  }
}

async function getLogCountsOverTime(req, res) {
  try {
    const fromDate = new Date(req.query.from)
    fromDate.setUTCHours(0, 0, 0, 0)
    const totals = await logService.getLogsTotalOverTime(fromDate)
    res.json({ totals })
  } catch (err) {
    console.error('Failed to get log counts over time', err)
    res.status(500).send({ error: 'Failed to get log counts over time', detail: err.message })
  }
}

module.exports = {
  getLogs,
  getAggregatedLogCounts,
  getLogCountsOverTime
}
