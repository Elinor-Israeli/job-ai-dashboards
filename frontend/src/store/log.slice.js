import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { logService} from '../services/log.service'


//fetch the logs from backend 
export const loadLogs = createAsyncThunk(
  'logs/loadLogs',
  async ({ filter, page, pageSize }) => {
    const params = { ...filter, page, pageSize }
    const res = await logService.queryLogs(params)
    return res
  }
)

const logSlice = createSlice({
    name:'logs',
    initialState: {
    data: {
      logs: [],
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
