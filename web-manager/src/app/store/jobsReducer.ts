import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { IJobEntity } from '@/types/IJobEntity'
import { JobQueueEnum } from '@/constants/JobQueueEnum'

interface JobsState {
  jobs: IJobEntity[]
  likedJobs: IJobEntity[]
  dislikedJobs: IJobEntity[]
  jobQueueSelected: JobQueueEnum
  unpreferencedCounter: number
  limit: number
  skip: number
}

const initialState: JobsState = {
  jobs: [],
  likedJobs: [],
  dislikedJobs: [],
  jobQueueSelected: JobQueueEnum.Unrated,
  unpreferencedCounter: 0,
  limit: 9,
  skip: 0,
}

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setUnpreferencedCounter(state, action: PayloadAction<number>) {
      state.unpreferencedCounter = Math.round(action.payload)
    },
    setLimit(state, action: PayloadAction<number>) {
      state.limit = Math.round(action.payload)
    },
    setSkip(state, action: PayloadAction<number>) {
      state.skip = Math.round(action.payload)
    },
    setJobQueueSelected(state, action: PayloadAction<JobQueueEnum>) {
      state.jobQueueSelected = action.payload
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
    setLikedJobs(state, action: PayloadAction<IJobEntity[]>) {
      state.likedJobs = action.payload
    },
    updateLikedJob(state, action: PayloadAction<IJobEntity>) {
      const idx = state.likedJobs.findIndex(j => j._id === action.payload._id)
      if (idx !== -1) state.likedJobs[idx] = action.payload
    },
    removeLikedJob(state, action: PayloadAction<string>) {
      state.likedJobs = state.likedJobs.filter(j => j._id.toString() !== action.payload)
    },
    setDislikedJobs(state, action: PayloadAction<IJobEntity[]>) {
      state.dislikedJobs = action.payload
    },
    updateDislikedJob(state, action: PayloadAction<IJobEntity>) {
      const idx = state.dislikedJobs.findIndex(j => j._id === action.payload._id)
      if (idx !== -1) state.dislikedJobs[idx] = action.payload
    },
    removeDislikedJob(state, action: PayloadAction<string>) {
      state.dislikedJobs = state.dislikedJobs.filter(j => j._id.toString() !== action.payload)
    },
  },
})

export const {
  setUnpreferencedCounter,
  setLimit,
  setSkip,
  setJobQueueSelected,
  setJobs,
  addJob,
  updateJob,
  removeJob,
  setLikedJobs,
  updateLikedJob,
  removeLikedJob,
  setDislikedJobs,
  updateDislikedJob,
  removeDislikedJob,
} = jobsSlice.actions

export const jobsReducer = jobsSlice.reducer
