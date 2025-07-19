const logService = require('../services/log.service')

async function getLogs(req, res) {
  try {
    const filterBy = {}

    if (req.query["params[client]"]) filterBy.client = req.query["params[client]"]
    if (req.query["params[country]"]) filterBy.country = req.query["params[country]"]

    if (req.query["params[from]"] || req.query["params[to]"]) {
      filterBy.timestamp = {}

      if (req.query["params[from]"]) {
        const fromDate = new Date(req.query["params[from]"])
        fromDate.setUTCHours(23, 59, 59, 999)
        filterBy.from = fromDate
      }

      if (req.query["params[to]"]) {
        const toDate = new Date(req.query["params[to]"])
        toDate.setUTCHours(23, 59, 59, 999)
        filterBy.to = toDate
      }
    }

    const page = parseInt(req.query["params[page]"]) || 0
    const pageSize = parseInt(req.query["params[pageSize]"]) || 25
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
