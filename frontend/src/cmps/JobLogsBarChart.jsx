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

  const allTotals = Object.entries(totals.find(total => total._id === "All")).filter(row => row[0] !== "_id")

  return (
    <BarChart
      xAxis={[{ data: allTotals.map(t => t[0]) }]}
      series={[{ data: allTotals.map(t => t[1]) }]}
      height={300}
    />
  )
}