import { useEffect, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { LineChart } from '@mui/x-charts/LineChart'
import { logService } from '../services/log.service'

export function JobLogsLineChart() {
  const [dataset, setDataset] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: only get totals from last day. Make it configurable
        const { totals } = await logService.queryLogTotalsOverTime(new Date("2025-07-13T00:00:00Z"))
        setDataset(totals.map(item => ({
          ...item,
          _id: new Date(item._id)
        })))
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

  dataset.sort((a, b) => a._id - b._id);

  return (
    <LineChart
      xAxis={[
        {
          dataKey: '_id',
          valueFormatter: (value) => new Date(value).getHours().toString(),
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
      dataset={dataset}
      height={300}
    />
  )
}