import { useEffect, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { BarChart } from '@mui/x-charts/BarChart'
import { logService} from '../services/log.service'

export function JobLogsBarChart() {
  const [totals, setTotals] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
      const fetchData = async () => {
        try {
          // TODO: only get totals from last day. Make it configurable
          const {totals} = await logService.queryLogTotals(new Date("2025-07-13T00:00:00Z"))
          setTotals(totals)
          setIsLoading(false)
        } catch (err) {
          console.error('Error fetching totals:', err);
        }
      };
      fetchData()
    }, [])

  if (isLoading) {
    return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 300
          }}
        >
          <CircularProgress />
        </Box>
    )
  }

  const allTotals = totals.filter(total => total._id === "All")

  return (
    <BarChart
      xAxis={[
        {
          dataKey: '_id',
        },
      ]}
      series={[
        {
          dataKey: 'totalJobsSentToIndex',
          label: 'JobsSentToIndex',
        },
        {
          dataKey: 'totalJobsDontHaveMetadata',
          label: 'JobsDontHaveMetadata',
        },
        {
          dataKey: 'totalJobsSentToEnrich',
          label: 'JobsSentToEnrich',
        },
        {
          dataKey: 'totalJobsFailedIndex',
          label: 'JobsFailedIndex',
        },
        {
          dataKey: 'totalRecordsInFeed',
          label: 'RecordsInFeed',
        },
        {
          dataKey: 'totalJobsInFeed',
          label: 'JobsInFeed',
        },
      ]}
      dataset={allTotals}
      height={300}
    />
  )
}