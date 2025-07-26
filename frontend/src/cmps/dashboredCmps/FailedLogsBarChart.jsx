import { useEffect, useState } from "react"
import { Box, CircularProgress, Typography } from '@mui/material'
import { BarChart } from '@mui/x-charts'
import { logService } from "../../services/log.service"

export function FailedLogsBarChart() {
    const [totals, setTotals] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { totals } = await logService.queryFailedLogs(new Date("2025-07-13T00:00:00Z"), new Date("2025-07-13T23:59:59Z"))
                setTotals(totals)
                setIsLoading(false)
            } catch (err) {
                console.error('Error fetching totals:', err)
            }
        }
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

    return (
        <Box sx={{ width: '100%', maxWidth: '1000px', margin: 'auto', mt: 4 }}>
            <Typography variant="h6" align="center" gutterBottom>
                Failed To Index Logs Per Country
            </Typography>
            <BarChart
                xAxis={[
                    {
                        dataKey: 'country',
                        label: 'Country'
                    },

                ]}
                series={[
                    {
                        dataKey: 'failedIndexJobsPercentage',
                        label: 'Failed Jobs %',
                        color: '#FFB5C0'
                    }
                ]}
                dataset={totals}
                height={300}
            />
        </Box>
    )
}
