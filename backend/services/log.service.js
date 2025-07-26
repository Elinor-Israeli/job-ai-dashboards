const Log = require('../models/Log')

async function query(filterBy = {}, limit = 25, page = 0) {
  try {
    const criteria = _buildCriteria(filterBy)
    const sort = _buildSort(filterBy)  
    const logs = await Log.find(criteria)
      .skip(page * limit)
      .limit(limit)
      .sort(sort)

    const total = await Log.countDocuments(criteria)
    return { logs, total }

  } catch (err) {
    console.error('Failed to fetch logs:', err)
    throw err
  }
}

async function getFailedLogsPercentage(fromDate, toDate) {
  try {
    const failedLogsIndex = await Log.aggregate([
      {
        $match: {
          timestamp: { $gte: fromDate, $lte: toDate }
        }
      },
      {
        $group: {
          _id: "$country_code",
          totalFailedIndexJobs: { $sum: "$progress.TOTAL_JOBS_FAIL_INDEXED" },
          totalJobsInFeed: { $sum: "$progress.TOTAL_JOBS_IN_FEED" }
        }
      },
      {
        $project: {
          _id: 0,
          country: "$_id",
          failedIndexJobsPercentage: {
            $cond: [
              { $eq: ["$totalJobsInFeed", 0] },
              0,
              {
                $multiply: [
                  { $divide: ["$totalFailedIndexJobs", "$totalJobsInFeed"] },
                  100
                ]
              }
            ]
          }
        }
      }
    ])
    return failedLogsIndex
  } catch (err) {
    console.error(err)
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
        $match: {
          timestamp: { $gte: fromDate },
          status: 'completed'
        }
      },
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

// TODO: This only support hourly resolution. Add resolution parameter and group accordingly
async function getLogsTotalOverTime(fromDate) {
  try {
    const results = await Log.aggregate([
      {
        $match: {
          timestamp: { $gte: fromDate },
          status: 'completed'
        }
      },
      {
        $project: {
          progress: 1,
          hourDate: {
            $dateTrunc: {
              date: "$timestamp",
              unit: "hour",
            }
          }
        }
      },
      {
        $group: {
          _id: "$hourDate",
          totalJobsSentToIndex: { $sum: "$progress.TOTAL_JOBS_SENT_TO_INDEX" },
          totalJobsDontHaveMetadata: { $sum: "$progress.TOTAL_JOBS_DONT_HAVE_METADATA_V2" },
          totalJobsSentToEnrich: { $sum: "$progress.TOTAL_JOBS_SENT_TO_ENRICH" },
          totalJobsFailedIndex: { $sum: "$progress.TOTAL_JOBS_FAIL_INDEXED" },
          totalRecordsInFeed: { $sum: "$progress.TOTAL_RECORDS_IN_FEED" },
          totalJobsInFeed: { $sum: "$progress.TOTAL_JOBS_IN_FEED" },
        }
      }
    ])
    return results
  } catch (err) {
    console.error('Aggregation over time error:', err)
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

  if (filterBy.currency){
    criteria.currency_code = filterBy.currency
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

function _buildSort(filterBy) {
  if (!filterBy.sortField) return { timestamp: -1 }

  const nestedFields = [
    'TOTAL_JOBS_FAIL_INDEXED',
    'TOTAL_JOBS_SENT_TO_INDEX',
    'TOTAL_JOBS_SENT_TO_ENRICH',
    'TOTAL_JOBS_DONT_HAVE_METADATA_V2',
    'TOTAL_RECORDS_IN_FEED',
    'TOTAL_JOBS_IN_FEED'
  ]

  const sortKey = nestedFields.includes(filterBy.sortField)
    ? `progress.${filterBy.sortField}`
    : filterBy.sortField

  return { [sortKey]: filterBy.sortDir === 'asc' ? 1 : -1 }
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
  getLogsTotalOverTime,
  getFailedLogsPercentage
}
