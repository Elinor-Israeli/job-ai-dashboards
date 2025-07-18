import { httpService } from './http.service'

export const logService = {
  queryLogs,
  getById,
  remove,
  save,
}

function queryLogs(filter= {}, limit = 50) {
  return httpService.get(`logs`, { ...filter, limit })
}

function getById(id) {
  return httpService.get(`logs/${id}`)
}

function remove(id) {
  return httpService.delete(`logs/${id}`)
}

function save(log) {
  if (log._id) {
    return httpService.put(`logs/${log._id}`, log)
  } else {
    return httpService.post(`logs`, log)
  }
}
