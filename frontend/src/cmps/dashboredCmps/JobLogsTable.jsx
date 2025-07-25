import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loadLogs } from '../../store/log.slice'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, Stack } from '@mui/material'

export function JobLogsTable({ logs, total, filterBy }) {
  
  const dispatch = useDispatch()

  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(25)
  const [sortModel, setSortModel] = useState([])

  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    TOTAL_JOBS_SENT_TO_ENRICH: false,
    TOTAL_JOBS_DONT_HAVE_METADATA_V2: false,
    TOTAL_RECORDS_IN_FEED: false,
    TOTAL_JOBS_IN_FEED: false,
  })

  const handlePaginationModelChange = (newPaginationModel) => {
    setPage(newPaginationModel.page)
    setPageSize(newPaginationModel.pageSize)

    const sortField = sortModel[0]?.field || 'timestamp'
    const sortDir = sortModel[0]?.sort || 'desc'

    dispatch(loadLogs({
      page: newPaginationModel.page,
      pageSize: newPaginationModel.pageSize,
      sortField,
      sortDir,
      filterBy
    }))
  }

  const handleSortModelChange = (newSortModel) => {
    setSortModel(newSortModel)
    const sortField = newSortModel[0]?.field || 'timestamp'
    const sortDir = newSortModel[0]?.sort || 'desc'

    dispatch(loadLogs({
      filterBy: {
        ...filterBy,
        sortField,
        sortDir
      },
      page,
      pageSize
    }))

  }


  const handleToggleColumn = (field) => {
    setColumnVisibilityModel(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }


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
      headerName: 'Total Jobs Indexed',
      flex: 1,
      valueGetter: (value, row) => row?.progress?.TOTAL_JOBS_SENT_TO_INDEX ?? 'N/A',
    },
    {
      field: 'TOTAL_JOBS_FAIL_INDEXED',
      headerName: 'Failed Indexed Jobs',
      flex: 1,
      valueGetter: (value, row) => row?.progress?.TOTAL_JOBS_FAIL_INDEXED ?? 'N/A',
    },
    {
      field: 'TOTAL_JOBS_SENT_TO_ENRICH',
      headerName: 'Jobs Enriched',
      flex: 1,
      valueGetter: (value, row) => row?.progress?.TOTAL_JOBS_SENT_TO_ENRICH ?? 'N/A',
    },
    {
      field: 'TOTAL_JOBS_DONT_HAVE_METADATA_V2',
      headerName: 'Missing Metadata',
      flex: 1,
      valueGetter: (value, row) => row?.progress?.TOTAL_JOBS_DONT_HAVE_METADATA_V2 ?? 'N/A',
    },
    {
      field: 'TOTAL_RECORDS_IN_FEED',
      headerName: 'Total Records',
      flex: 1,
      valueGetter: (value, row) => row?.progress?.TOTAL_RECORDS_IN_FEED ?? 'N/A',
    },
    {
      field: 'TOTAL_JOBS_IN_FEED',
      headerName: 'Jobs In Feed',
      flex: 1,
      valueGetter: (value, row) => row?.progress?.TOTAL_JOBS_IN_FEED ?? 'N/A',
    },

  ]

  const rows = logs.map((log) => ({
    id: log._id,
    ...log,
  }))

  return (
    <Box sx={{ width: '80%', marginTop: 4, marginInline: 'auto' }}>
      <Stack direction="row" spacing={2} mb={2} flexWrap="wrap">
        <Button onClick={() => handleToggleColumn('TOTAL_JOBS_SENT_TO_ENRICH')}>
          Toggle Enriched
        </Button>
        <Button onClick={() => handleToggleColumn('TOTAL_JOBS_DONT_HAVE_METADATA_V2')}>
          Toggle Metadata
        </Button>
        <Button onClick={() => handleToggleColumn('TOTAL_RECORDS_IN_FEED')}>
          Toggle Total Records
        </Button>
        <Button onClick={() => handleToggleColumn('TOTAL_JOBS_IN_FEED')}>
          Toggle Jobs In Feed
        </Button>
      </Stack>

      <DataGrid
        rows={rows}
        columns={columns}
        rowCount={total}
        paginationMode="server"
        sortingMode="server"
        page={page}
        pageSize={pageSize}
        onSortModelChange={handleSortModelChange}
        onPaginationModelChange={handlePaginationModelChange}
        rowsPerPageOptions={[10, 25, 50]}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={(model) => setColumnVisibilityModel(model)}
        disableColumnFilter
        disableRowSelectionOnClick
        autoHeight
      />
    </Box>
  )

}
