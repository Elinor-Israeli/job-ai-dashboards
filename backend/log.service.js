const Log = require('./models/Log')

async function query(filterBy = {}, limit = 100) {
  try {
    const criteria = _buildCriteria(filterBy)
    const logs = await Log.find(criteria)
      .limit(limit)
      .sort({ timestamp: -1 })
    return logs
  } catch (err) {
    console.error('Failed to fetch logs:', err)
    throw err
  }
}

function _buildCriteria(filterBy) {
  const criteria = {}

  if (filterBy.client) {
    criteria.transactionSourceName = filterBy.client
  }

  if (filterBy.country) {
    criteria.country_code = filterBy.country
  }

  if (filterBy.from || filterBy.to) {
    criteria.timestamp = {}
    if (filterBy.from) {
      criteria.timestamp.$gte = new Date(filterBy.from)
    }
    if (filterBy.to) {
      criteria.timestamp.$lte = new Date(filterBy.to)
    }
  }

  return criteria
}

module.exports = {
  query
}
