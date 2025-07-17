import { configureStore } from '@reduxjs/toolkit'
import { logReducer } from './log.slice'

export const store = configureStore({
  reducer: {
    logs: logReducer
  }
})
