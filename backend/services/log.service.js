const Log = require('../models/Log')

async function query(filterBy = {}, limit = 25, page = 0) {
  try {
    const criteria = _buildCriteria(filterBy)
    const logs = await Log.find(criteria)
      .skip(page * limit)
      .limit(limit)
      .sort({ timestamp: -1 })

    const total = await Log.countDocuments(criteria)
    return { logs, total }

  } catch (err) {
    console.error('Failed to fetch logs:', err)
    throw err
  }
}

async function getLogsTotal(fromDate) {
  try {
    const resultsPerClient = await Log.aggregate([
      {
        $match: {
          timestamp: { $gte: fromDate },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: "$transactionSourceName",
          totalJobsSentToIndex: { $sum: "$progress.TOTAL_JOBS_SENT_TO_INDEX" },
          totalJobsDontHaveMetadata: { $sum: "$progress.TOTAL_JOBS_DONT_HAVE_METADATA_V2" },
          totalJobsSentToEnrich: { $sum: "$progress.TOTAL_JOBS_SENT_TO_ENRICH" },
          totalJobsFailedIndex: { $sum: "$progress.TOTAL_JOBS_FAIL_INDEXED" },
          totalRecordsInFeed: { $sum: "$progress.TOTAL_RECORDS_IN_FEED" },
          totalJobsInFeed: { $sum: "$progress.TOTAL_JOBS_IN_FEED" },
        }
      }
    ])
    const allResults = await Log.aggregate([
      {
        $group: {
          _id: null,
          totalJobsSentToIndex: { $sum: "$progress.TOTAL_JOBS_SENT_TO_INDEX" },
          totalJobsDontHaveMetadata: { $sum: "$progress.TOTAL_JOBS_DONT_HAVE_METADATA_V2" },
          totalJobsSentToEnrich: { $sum: "$progress.TOTAL_JOBS_SENT_TO_ENRICH" },
          totalJobsFailedIndex: { $sum: "$progress.TOTAL_JOBS_FAIL_INDEXED" },
          totalRecordsInFeed: { $sum: "$progress.TOTAL_RECORDS_IN_FEED" },
          totalJobsInFeed: { $sum: "$progress.TOTAL_JOBS_IN_FEED" },
        }
      }
    ])
    allResults[0]._id = "All"
    return allResults.concat(resultsPerClient)
  } catch (err) {
    console.error('Aggregation error:', err)
    return []
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


async function runAggregation(pipeline) {
  try {
    const results = await Log.aggregate(pipeline)
    return results
  } catch (err) {
    console.error('Aggregation error:', err)
    return []
  }
}

module.exports = {
  query,
  runAggregation,
  getLogsTotal,
}
