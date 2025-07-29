import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { ICvEntity } from '@/types/ICvEntity'
import { CvSorter } from '@/backend/lib/CvSorter';

interface CvsState {
  cvs: ICvEntity[]
  cvsCounter: number // Total number of CVs in DB
  cvsHasMore: boolean;
  cvsInLoading: boolean;
  cvsLimit: number
  cvsSkip: number
  selectedCvId: string | null
}

const initialState: CvsState = {
  cvs: [],
  cvsCounter: 0,
  cvsHasMore: true,
  cvsInLoading: false,
  cvsLimit: 10,
  cvsSkip: 0,
  selectedCvId: null,
}

const cvsSlice = createSlice({
  name: 'cvs',
  initialState,
  reducers: {
    setCvs(state, action: PayloadAction<ICvEntity[]>) {
      state.cvs = action.payload
      state.cvsCounter = action.payload.length
    },
    setCvsHasMore(state, action: PayloadAction<boolean>) {
      state.cvsHasMore = action.payload
    },
    setCvsInLoading(state, action: PayloadAction<boolean>) {
      state.cvsInLoading = action.payload
    },
    setCvsLimit(state, action: PayloadAction<number>) {
      state.cvsLimit = Math.round(action.payload)
    },
    setCvsSkip(state, action: PayloadAction<number>) {
      state.cvsSkip = Math.round(action.payload)
    },
    setCvsCounter(state, action: PayloadAction<number>) {
      state.cvsCounter = Math.round(action.payload);
    },
    updateCv(state, action: PayloadAction<ICvEntity>) {
      const cvsWithUpdated = state.cvs.map(cv => cv._id === action.payload._id ? action.payload : cv);
      const newCvList = [...cvsWithUpdated, action.payload].sort(CvSorter.byUpdatedAt);
      state.cvs = newCvList;
    },
    removeCv(state, action: PayloadAction<string>) {
      const newCvList = state.cvs.filter(cv => cv._id?.toString() !== action.payload);
      state.cvs = newCvList;
    },
    setSelectedCvId(state, action: PayloadAction<string | null>) {
      state.selectedCvId = action.payload
    },
    clearCvs(state) {
      state.cvs = []
      state.cvsCounter = 0
      state.cvsHasMore = true
      state.cvsInLoading = false
      state.cvsLimit = 10
      state.cvsSkip = 0
      state.selectedCvId = null
    }
  },
})

export const {
  setCvs,
  setCvsCounter,
  setCvsHasMore,
  setCvsInLoading,
  setCvsLimit,
  setCvsSkip,
  updateCv,
  removeCv,
  setSelectedCvId,
  clearCvs
} = cvsSlice.actions

export const cvsReducer = cvsSlice.reducer
