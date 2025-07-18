import { httpService } from './http.service'

export const logService = {
  queryLogs,
  queryLogTotals,
}

function queryLogs(filter= {}, limit = 50) {
  return httpService.get(`logs`, { ...filter, limit })
}

function queryLogTotals(from) {
  return httpService.get(`logs/totals`, { ...from })
}