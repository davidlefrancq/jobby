import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { IJobEntity } from '@/types/IJobEntity'
import { JobQueueEnum } from '@/constants/JobQueueEnum'

const REQUEST_RESULT_LIMIT = process.env.NEXT_PUBLIC_REQUEST_RESULT_LIMIT ? parseInt(process.env.NEXT_PUBLIC_REQUEST_RESULT_LIMIT) : 25

interface JobsState {
  unratedJobs: IJobEntity[]
  unratedCounter: number
  unratedLimit: number
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
  unratedLimit: REQUEST_RESULT_LIMIT,
  unratedSkip: 0,
  likedJobs: [],
  likedCounter: 0,
  likedLimit: REQUEST_RESULT_LIMIT,
  likedSkip: 0,
  dislikedJobs: [],
  dislikedCounter: 0,
  dislikedLimit: REQUEST_RESULT_LIMIT,
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
      state.unratedLimit = Math.round(action.payload)
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
      state.unratedJobs = state.unratedJobs.filter(j => j._id?.toString() !== action.payload)
      state.unratedCounter = Math.max(0, state.unratedCounter - 1) // Ensure counter does not go negative
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
    addLikedJob(state, action: PayloadAction<IJobEntity>) {
      const existingJob = state.likedJobs.find(j => j._id === action.payload._id)
      if (!existingJob) {
        let newLikedJobs = state.likedJobs.filter(j => j._id !== action.payload._id)
        newLikedJobs = [...newLikedJobs, action.payload]
        state.likedJobs = newLikedJobs
        state.likedCounter = Math.max(0, state.likedCounter + 1) // Ensure counter does not go negative
      }
    },
    updateLikedJob(state, action: PayloadAction<IJobEntity>) {
      const jobId = state.likedJobs.findIndex(j => j._id === action.payload._id)
      if (jobId !== -1) state.likedJobs[jobId] = action.payload
    },
    removeLikedJob(state, action: PayloadAction<string>) {
      state.likedJobs = state.likedJobs.filter(j => j._id?.toString() !== action.payload)
      state.likedCounter = Math.max(0, state.likedCounter - 1) // Ensure counter does not go negative
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
    addDislikedJob(state, action: PayloadAction<IJobEntity>) {
      const existingJob = state.dislikedJobs.find(j => j._id === action.payload._id)
      if (!existingJob) {
        let newDislikedJobs = state.dislikedJobs.filter(j => j._id !== action.payload._id)
        newDislikedJobs = [...newDislikedJobs, action.payload]
        state.dislikedJobs = newDislikedJobs
        state.dislikedCounter = Math.max(0, state.dislikedCounter + 1) // Ensure counter does not go negative
      }
    },
    updateDislikedJob(state, action: PayloadAction<IJobEntity>) {
      const jobId = state.dislikedJobs.findIndex(j => j._id === action.payload._id)
      if (jobId !== -1) state.dislikedJobs[jobId] = action.payload
    },
    removeDislikedJob(state, action: PayloadAction<string>) {
      state.dislikedJobs = state.dislikedJobs.filter(j => j._id?.toString() !== action.payload)
      state.dislikedCounter = Math.max(0, state.dislikedCounter - 1) // Ensure counter does not go negative
    },

    // Job Queue Selector Method
    setJobQueueSelected(state, action: PayloadAction<JobQueueEnum>) {
      state.jobQueueSelected = action.payload
    },
  },
})

export const {
  // Urated Jobs Actions
  setUnratedCounter,
  setUnratedLimit,
  setUnratedSkip,
  setUnratedJobs,
  updateUnratedJob,
  removeUnratedJob,

  // Liked Jobs Actions
  setLikedCounter,
  setLikedLimit,
  setLikedSkip,
  setLikedJobs,
  addLikedJob,
  updateLikedJob,
  removeLikedJob,

  // Disliked Jobs Actions
  setDislikedCounter,
  setDislikedLimit,
  setDislikedSkip,
  setDislikedJobs,
  addDislikedJob,
  updateDislikedJob,
  removeDislikedJob,

  // Job Queue Selector Action
  setJobQueueSelected,
} = jobsSlice.actions

export const jobsReducer = jobsSlice.reducer
