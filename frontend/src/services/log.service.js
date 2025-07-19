import { httpService } from './http.service'

export const logService = {
  queryLogs,
  queryLogTotals,
  queryLogTotalsOverTime,
}

async function queryLogs({ filterBy = {}, page = 0, pageSize = 50 }) {
   console.log('Sending request with params:',{ filterBy, page , pageSize })
  return httpService.get('logs', {
    params: {
      ...filterBy,
      page,
      pageSize
    }
  })
}


async function queryLogTotals(from) {
  return httpService.get(`logs/totals`, { from })
}

async function queryLogTotalsOverTime(from) {
  return httpService.get(`logs/totals_over_time`, { from })
}