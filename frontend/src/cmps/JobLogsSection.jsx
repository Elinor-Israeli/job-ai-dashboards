import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadLogs } from '../store/log.slice'
import { JobLogsTable } from './JobLogsTable'
import { Box } from '@mui/material'
import { CircularProgress } from '@mui/material'

export function JobLogsSection() {
  const dispatch = useDispatch()
  const logs = useSelector(state => state.logs.data.logs)
  const isLoading = useSelector(state => state.logs.loading)

  const [client, setClient] = useState('')
  const [country, setCountry] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  useEffect(() => {
    dispatch(loadLogs({ filterBy: {}, limit: 50 }))
  }, [dispatch])

  const handleFilter = () => {
    const filterBy = {
      client,
      country,
      from: fromDate,
      to: toDate
    }
    dispatch(loadLogs({ filterBy, limit: 50 }))
  }

  console.log('logs from section', logs)

  return (
    <section>
      <div style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Client"
          value={client}
          onChange={(e) => setClient(e.target.value)}
        />
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
        <button onClick={handleFilter}>Filter</button>
      </div>

      {isLoading ?
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 300
          }}
        >
          <CircularProgress />
        </Box> :
        <JobLogsTable logs={logs} />}
    </section>
  )
}

