import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { IJobEntity } from '@/types/IJobEntity'
import { JobQueueEnum } from '@/constants/JobQueueEnum'
import { JobSorter } from '@/backend/lib/JobSorter'

const REQUEST_RESULT_LIMIT = process.env.NEXT_PUBLIC_REQUEST_RESULT_LIMIT ? parseInt(process.env.NEXT_PUBLIC_REQUEST_RESULT_LIMIT) : 25

interface JobsState {
  unratedJobs: IJobEntity[]
  unratedCounter: number
  unratedLimit: number
  unratedSkip: number
  unratedInLoading: boolean
  unratedHasMore: boolean
  likedJobs: IJobEntity[]
  likedCounter: number
  likedLimit: number
  likedSkip: number
  likedInLoading: boolean
  likedHasMore: boolean
  dislikedJobs: IJobEntity[]
  dislikedCounter: number
  dislikedLimit: number
  dislikedSkip: number
  dislikedInLoading: boolean
  dislikedHasMore: boolean
  jobQueueSelected: JobQueueEnum
  jobSelected: IJobEntity | null
}

const initialState: JobsState = {
  unratedJobs: [],
  unratedCounter: 0,
  unratedLimit: REQUEST_RESULT_LIMIT,
  unratedSkip: 0,
  unratedInLoading: false,
  unratedHasMore: true,
  likedJobs: [],
  likedCounter: 0,
  likedLimit: REQUEST_RESULT_LIMIT,
  likedSkip: 0,
  likedInLoading: false,
  likedHasMore: true,
  dislikedJobs: [],
  dislikedCounter: 0,
  dislikedLimit: REQUEST_RESULT_LIMIT,
  dislikedSkip: 0,
  dislikedInLoading: false,
  dislikedHasMore: true,
  jobQueueSelected: JobQueueEnum.unrated,
  jobSelected: null,
}

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    // Urated Jobs Methods
    setUnratedCounter(state, action: PayloadAction<number>) {
      state.unratedCounter = Math.round(action.payload);
    },
    setUnratedLimit(state, action: PayloadAction<number>) {
      state.unratedLimit = Math.round(action.payload);
    },
    setUnratedSkip(state, action: PayloadAction<number>) {
      state.unratedSkip = Math.round(action.payload);
    },
    setUnratedJobs(state, action: PayloadAction<IJobEntity[]>) {
      state.unratedJobs = action.payload;
    },
    setUnratedInLoading(state, action: PayloadAction<boolean>) {
      state.unratedInLoading = action.payload;
    },
    setUnratedHasMore(state, action: PayloadAction<boolean>) {
      state.unratedHasMore = action.payload;
    },
    updateUnratedJob(state, action: PayloadAction<IJobEntity>) {
      const jobListWithoutUpdated = state.unratedJobs.filter(j => j._id?.toString() !== action.payload._id?.toString());
      state.unratedJobs = [...jobListWithoutUpdated, action.payload].sort(JobSorter.byDate);
    },
    removeUnratedJob(state, action: PayloadAction<string>) {
      state.unratedJobs = state.unratedJobs.filter(j => j._id?.toString() !== action.payload);
    },

    // Liked Jobs Methods
    setLikedCounter(state, action: PayloadAction<number>) {
      state.likedCounter = Math.round(action.payload);
    },
    setLikedLimit(state, action: PayloadAction<number>) {
      state.likedLimit = Math.round(action.payload);
    },
    setLikedSkip(state, action: PayloadAction<number>) {
      state.likedSkip = Math.round(action.payload);
    },
    setLikedJobs(state, action: PayloadAction<IJobEntity[]>) {
      state.likedJobs = action.payload;
    },
    setLikedInLoading(state, action: PayloadAction<boolean>) {
      state.likedInLoading = action.payload;
    },
    setLikedHasMore(state, action: PayloadAction<boolean>) {
      state.likedHasMore = action.payload;
    },
    addLikedJob(state, action: PayloadAction<IJobEntity>) {
      const jobListWithoutNew = state.likedJobs.filter(j => j._id?.toString() !== action.payload._id?.toString());
      state.likedJobs = [...jobListWithoutNew, action.payload].sort(JobSorter.byDate);
    },
    updateLikedJob(state, action: PayloadAction<IJobEntity>) {
      const jobListWithoutUpdated = state.likedJobs.filter(j => j._id?.toString() !== action.payload._id?.toString());
      state.likedJobs = [...jobListWithoutUpdated, action.payload].sort(JobSorter.byDate);
    },
    removeLikedJob(state, action: PayloadAction<string>) {
      state.likedJobs = state.likedJobs.filter(j => j._id?.toString() !== action.payload);
    },

    // Disliked Jobs Methods
    setDislikedCounter(state, action: PayloadAction<number>) {
      state.dislikedCounter = Math.round(action.payload);
    },
    setDislikedLimit(state, action: PayloadAction<number>) {
      state.dislikedLimit = Math.round(action.payload);
    },
    setDislikedSkip(state, action: PayloadAction<number>) {
      state.dislikedSkip = Math.round(action.payload);
    },
    setDislikedJobs(state, action: PayloadAction<IJobEntity[]>) {
      state.dislikedJobs = action.payload;
    },
    setDislikedInLoading(state, action: PayloadAction<boolean>) {
      state.dislikedInLoading = action.payload;
    },
    setDislikedHasMore(state, action: PayloadAction<boolean>) {
      state.dislikedHasMore = action.payload;
    },
    addDislikedJob(state, action: PayloadAction<IJobEntity>) {
      const jobListWithoutNew = state.dislikedJobs.filter(j => j._id?.toString() !== action.payload._id?.toString());
      state.dislikedJobs = [...jobListWithoutNew, action.payload].sort(JobSorter.byDate);
    },
    updateDislikedJob(state, action: PayloadAction<IJobEntity>) {
      const jobListWithoutUpdated = state.dislikedJobs.filter(j => j._id?.toString() !== action.payload._id?.toString());
      state.dislikedJobs = [...jobListWithoutUpdated, action.payload].sort(JobSorter.byDate);
    },
    removeDislikedJob(state, action: PayloadAction<string>) {
      state.dislikedJobs = state.dislikedJobs.filter(j => j._id?.toString() !== action.payload)
    },

    // Job Queue Selector Method
    setJobQueueSelected(state, action: PayloadAction<JobQueueEnum>) {
      state.jobQueueSelected = action.payload
    },
    setJobSelected(state, action: PayloadAction<IJobEntity | null>) {
      state.jobSelected = action.payload;
    }
  },
})

export const {
  // Urated Jobs Actions
  setUnratedCounter,
  setUnratedLimit,
  setUnratedSkip,
  setUnratedJobs,
  setUnratedInLoading,
  setUnratedHasMore,
  updateUnratedJob,
  removeUnratedJob,

  // Liked Jobs Actions
  setLikedCounter,
  setLikedLimit,
  setLikedSkip,
  setLikedJobs,
  setLikedInLoading,
  setLikedHasMore,
  addLikedJob,
  updateLikedJob,
  removeLikedJob,

  // Disliked Jobs Actions
  setDislikedCounter,
  setDislikedLimit,
  setDislikedSkip,
  setDislikedJobs,
  setDislikedInLoading,
  setDislikedHasMore,
  addDislikedJob,
  updateDislikedJob,
  removeDislikedJob,

  // Job Queue Selector Action
  setJobQueueSelected,

  // Job Selected Action
  setJobSelected,
} = jobsSlice.actions

export const jobsReducer = jobsSlice.reducer
