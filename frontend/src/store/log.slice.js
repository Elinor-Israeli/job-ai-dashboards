import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { logService } from '../services/log.service'


//fetch the logs from backend 
export const loadLogs = createAsyncThunk(
  'logs/loadLogs',
  async (args) => {
    const res = await logService.queryLogs(args)
    return res
  }
)


const logSlice = createSlice({
  name: 'logs',
  initialState: {
    data: {
      logs: [],
      total: 0,
    },
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadLogs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadLogs.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(loadLogs.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  }

})

export const logReducer = logSlice.reducer
