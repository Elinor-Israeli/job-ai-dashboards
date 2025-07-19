import { httpService } from './http.service'

export const logService = {
  queryLogs,
  queryLogTotals,
}

async function queryLogs(filter= {}, limit = 50) {
  return httpService.get(`logs`, { ...filter, limit })
}

async function queryLogTotals(from) {
  return httpService.get(`logs/totals`, { ...from })
}