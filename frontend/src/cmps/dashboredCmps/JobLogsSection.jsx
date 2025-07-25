import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadLogs } from '../../store/log.slice'
import { JobLogsTable } from './JobLogsTable'
import { Box, Stack, TextField, Button, CircularProgress } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { JobLogsBarChart } from './JobLogsBarChart'
import { JobLogsLineChart } from './JobLogsLineChart'
import dayjs from 'dayjs'

export function JobLogsSection() {
  const dispatch = useDispatch()
  const logs = useSelector(state => state.logs.data.logs)
  const total = useSelector(state => state.logs.data.total)
  const isLoading = useSelector(state => state.logs.loading)

  const [client, setClient] = useState('')
  const [country, setCountry] = useState('')
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  const [filterBy, setFilterBy] = useState({})

  useEffect(() => {
    dispatch(loadLogs({ filterBy: {}, limit: 50 }))
  }, [dispatch])

  const handleFilter = () => {
    const newFilterBy = {
      client,
      country,
      from: fromDate?.toISOString(),
      to: toDate?.toISOString()
    }
     setFilterBy(newFilterBy)
     dispatch(loadLogs({ filterBy: newFilterBy, limit: 50 }))
  }


  return (
    <section >
      <JobLogsBarChart />
      <JobLogsLineChart />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack direction="row" spacing={2} alignItems="center" mb={4} flexWrap="wrap"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '32px'
          }}
        >
          <TextField
            label="Client"
            size="small"
            value={client}
            onChange={(e) => setClient(e.target.value)}
          />
          <TextField
            label="Country"
            size="small"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <DatePicker
            label="From"
            value={fromDate}
            onChange={(newValue) => setFromDate(dayjs(newValue))}
            slotProps={{ textField: { size: 'small' } }}
          />
          <DatePicker
            label="To"
            value={toDate}
            onChange={(newValue) => setToDate(dayjs(newValue))}
            slotProps={{ textField: { size: 'small' } }}
          />
          <Button variant="contained" size="small" onClick={handleFilter}>
            Filter
          </Button>
        </Stack>
      </LocalizationProvider>

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
        <div>
          <JobLogsTable logs={logs} total={total} filterBy={filterBy} />
        </div>
      }
    </section>
  )
}
