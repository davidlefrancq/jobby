import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { IJobEntity } from '@/types/IJobEntity'

interface JobsState {
  jobs: IJobEntity[]
  limit: number
  skip: number
}

const initialState: JobsState = {
  jobs: [],
  limit: 9,
  skip: 0,
}

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setLimit(state, action: PayloadAction<number>) {
      state.limit = Math.round(action.payload)
    },
    setSkip(state, action: PayloadAction<number>) {
      state.skip = Math.round(action.payload)
    },
    setJobs(state, action: PayloadAction<IJobEntity[]>) {
      state.jobs = action.payload
    },
    addJob(state, action: PayloadAction<IJobEntity>) {
      state.jobs.push(action.payload)
    },
    updateJob(state, action: PayloadAction<IJobEntity>) {
      const idx = state.jobs.findIndex(j => j._id === action.payload._id)
      if (idx !== -1) state.jobs[idx] = action.payload
    },
    removeJob(state, action: PayloadAction<string>) {
      state.jobs = state.jobs.filter(j => j._id.toString() !== action.payload)
    },
  },
})

export const {
  setLimit,
  setSkip,
  setJobs,
  addJob,
  updateJob,
  removeJob,
} = jobsSlice.actions

export const jobsReducer = jobsSlice.reducer
