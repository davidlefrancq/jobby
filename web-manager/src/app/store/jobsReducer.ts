import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { IJobEntity } from '@/types/IJobEntity'
import { JobQueueEnum } from '@/constants/JobQueueEnum'

interface JobsState {
  unratedJobs: IJobEntity[]
  unratedCounter: number
  uratedLimit: number
  unratedSkip: number
  likedJobs: IJobEntity[]
  likedCounter: number
  likedLimit: number
  likedSkip: number
  dislikedJobs: IJobEntity[]
  dislikedCounter: number
  dislikedLimit: number
  dislikedSkip: number
  jobQueueSelected: JobQueueEnum
}

const initialState: JobsState = {
  unratedJobs: [],
  unratedCounter: 0,
  uratedLimit: 9,
  unratedSkip: 0,
  likedJobs: [],
  likedCounter: 0,
  likedLimit: 9,
  likedSkip: 0,
  dislikedJobs: [],
  dislikedCounter: 0,
  dislikedLimit: 9,
  dislikedSkip: 0,
  jobQueueSelected: JobQueueEnum.Unrated,
}

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    // Urated Jobs Methods
    setUnratedCounter(state, action: PayloadAction<number>) {
      state.unratedCounter = Math.round(action.payload)
    },
    setUnratedLimit(state, action: PayloadAction<number>) {
      state.uratedLimit = Math.round(action.payload)
    },
    setUnratedSkip(state, action: PayloadAction<number>) {
      state.unratedSkip = Math.round(action.payload)
    },
    setUnratedJobs(state, action: PayloadAction<IJobEntity[]>) {
      state.unratedJobs = action.payload
    },
    updateUnratedJob(state, action: PayloadAction<IJobEntity>) {
      const idx = state.unratedJobs.findIndex(j => j._id === action.payload._id)
      if (idx !== -1) state.unratedJobs[idx] = action.payload
    },
    removeUnratedJob(state, action: PayloadAction<string>) {
      state.unratedJobs = state.unratedJobs.filter(j => j._id.toString() !== action.payload)
    },

    // Liked Jobs Methods
    setLikedCounter(state, action: PayloadAction<number>) {
      state.likedCounter = Math.round(action.payload)
    },
    setLikedLimit(state, action: PayloadAction<number>) {
      state.likedLimit = Math.round(action.payload)
    },
    setLikedSkip(state, action: PayloadAction<number>) {
      state.likedSkip = Math.round(action.payload)
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

    // Disliked Jobs Methods
    setDislikedCounter(state, action: PayloadAction<number>) {
      state.dislikedCounter = Math.round(action.payload)
    },
    setDislikedLimit(state, action: PayloadAction<number>) {
      state.dislikedLimit = Math.round(action.payload)
    },
    setDislikedSkip(state, action: PayloadAction<number>) {
      state.dislikedSkip = Math.round(action.payload)
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

    // Job Queue Selector Method
    setJobQueueSelected(state, action: PayloadAction<JobQueueEnum>) {
      state.jobQueueSelected = action.payload
    },
  },
})

export const {
  setUnratedCounter,
  setUnratedLimit,
  setUnratedSkip,
  setUnratedJobs,
  updateUnratedJob,
  removeUnratedJob,
  setLikedCounter,
  setLikedLimit,
  setLikedSkip,
  setLikedJobs,
  updateLikedJob,
  removeLikedJob,
  setDislikedCounter,
  setDislikedLimit,
  setDislikedSkip,
  setDislikedJobs,
  updateDislikedJob,
  removeDislikedJob,
  setJobQueueSelected,
} = jobsSlice.actions

export const jobsReducer = jobsSlice.reducer
