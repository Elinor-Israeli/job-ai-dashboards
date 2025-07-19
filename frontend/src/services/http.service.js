import Axios from 'axios'

const BASE_URL =
  import.meta.env.PROD // for Vite instead of process.env.NODE_ENV
    ? '/api/'
    : 'http://localhost:5000/api/'

const axios = Axios.create({ withCredentials: true })

export const httpService = {
  get(endpoint, data) {
    return ajax(endpoint, 'GET', data)
  },
  post(endpoint, data) {
    return ajax(endpoint, 'POST', data)
  },
  put(endpoint, data) {
    return ajax(endpoint, 'PUT', data)
  },
  delete(endpoint, data) {
    return ajax(endpoint, 'DELETE', data)
  },
}

async function ajax(endpoint, method = 'GET', data = null) {
  const url = `${BASE_URL}${endpoint}`
  const params = method === 'GET' ? data : null

  const options = {
  url,
  method,
  ...(method === 'GET' ? { params } : { data })
}

  try {
    const res = await axios(options)
    return res.data
  } catch (err) {
    console.log(`Failed ${method} ${url}`, err)
    if (err.response?.status === 401) {
      sessionStorage.clear()
      window.location.assign('/')
    }
    throw err
  }
}
