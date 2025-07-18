import {AppBar} from '@mui/material'
import {Box} from '@mui/material'
import {Toolbar} from '@mui/material'
import {Typography} from '@mui/material'

export function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Job Logs
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
