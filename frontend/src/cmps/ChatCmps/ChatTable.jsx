import { DataGrid } from '@mui/x-data-grid'
import { Box } from '@mui/material'

export function ChatTable({rows}) {
    const columns = Object.keys(rows[0]).map(key => ({field: key, headerName: key, flex: 1}))

    const rowsWithIds = rows.map((row, index) => ({
        ...row,
        id: index
    }))

    return (
        <Box sx={{ height: '100%', width: '100%', marginTop: 2 }}>
            <DataGrid
                rows={rowsWithIds}
                columns={columns}
                disableRowSelectionOnClick
                autoHeight
            />
        </Box>
    )
}
