import { DataGrid } from '@mui/x-data-grid'
import { Box } from '@mui/material'
import { loadLogs } from '../store/log.slice'
import { useDispatch } from 'react-redux'
import { useState } from 'react'


export function JobLogsTable({ logs , total }) {

  const dispatch = useDispatch()
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(25)

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

  const handlePaginationModelChange = (newPaginationModel) => {
    setPage(newPaginationModel.page)
    setPageSize(newPaginationModel.pageSize)

    dispatch(loadLogs({ page: newPaginationModel.page, pageSize: newPaginationModel.pageSize }))
  }

  const rows = logs.map((log) => ({
    id: log._id,
    ...log,
  }))

  return (
    <Box sx={{ height: '20%', width: '50%', marginTop: 2 , justifySelf:'center'}}>
      <DataGrid
        rows={rows}
        columns={columns}
        rowCount={total}
        paginationMode="server"
        page={page}
        pageSize={pageSize}
        onPaginationModelChange={handlePaginationModelChange}
        rowsPerPageOptions={[10, 25, 50]}
        disableColumnFilter
        disableRowSelectionOnClick
        autoHeight
      />
    </Box>
  )

}
