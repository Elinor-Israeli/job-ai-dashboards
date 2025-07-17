import { DataGrid } from '@mui/x-data-grid'
import { Box } from '@mui/material'

export function JobLogsTable({ logs }) {
  console.log('table logs', logs)

  const columns = [
    { field: 'transactionSourceName', headerName: 'Client', flex: 1 },
    { field: 'country_code', headerName: 'Country', flex: 1 },
    {
      field: 'timestamp',
      headerName: 'Date',
      flex: 1,
      valueGetter: (value, row) =>
        row?.timestamp
          ? new Date(row.timestamp).toISOString().split('T')[0]
          : 'N/A',
    },
    {
      field: 'TOTAL_JOBS_SENT_TO_INDEX',
      headerName: 'Total Indexed',
      flex: 1,
      valueGetter: (value, row) => row?.progress?.TOTAL_JOBS_SENT_TO_INDEX ?? 'N/A',
    },
    {
      field: 'TOTAL_JOBS_FAIL_INDEXED',
      headerName: 'Failed',
      flex: 1,
      valueGetter: (value, row) => row?.progress?.TOTAL_JOBS_FAIL_INDEXED ?? 'N/A',
    }
    
  ]

  const rows = logs.map((log) => ({
    id: log._id,
    ...log,
  }))
  console.log('rows', rows)

  return (
    <Box sx={{ height: 600, width: '100%', marginTop: 2 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={20}
        rowsPerPageOptions={[10, 20, 50]}
        disableRowSelectionOnClick
        autoHeight
      />
    </Box>
  )
}
