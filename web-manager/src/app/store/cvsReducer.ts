import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { ICvEntity } from '@/types/ICvEntity'

interface CvsState {
  cvs: ICvEntity[]
  cvsCounter: number
  cvsLimit: number
  cvsSkip: number
  selectedCvId?: string
}

const initialState: CvsState = {
  cvs: [],
  cvsCounter: 0,
  cvsLimit: 10,
  cvsSkip: 0,
  selectedCvId: undefined,
}

const cvsSlice = createSlice({
  name: 'cvs',
  initialState,
  reducers: {
    setCvsCounter(state, action: PayloadAction<number>) {
      state.cvsCounter = Math.round(action.payload)
    },
    setCvsLimit(state, action: PayloadAction<number>) {
      state.cvsLimit = Math.round(action.payload)
    },
    setCvsSkip(state, action: PayloadAction<number>) {
      state.cvsSkip = Math.round(action.payload)
    },
    setCvs(state, action: PayloadAction<ICvEntity[]>) {
      state.cvs = action.payload
    },
    updateCv(state, action: PayloadAction<ICvEntity>) {
      const idx = state.cvs.findIndex(cv => cv._id === action.payload._id)
      if (idx !== -1) state.cvs[idx] = action.payload
    },
    removeCv(state, action: PayloadAction<string>) {
      state.cvs = state.cvs.filter(cv => cv._id?.toString() !== action.payload)
      state.cvsCounter = Math.max(0, state.cvsCounter - 1) // Ensure counter does not go negative
    },
    setSelectedCvId(state, action: PayloadAction<string | undefined>) {
      state.selectedCvId = action.payload
    },
    clearCvs(state) {
      state.cvs = []
      state.cvsCounter = 0
      state.cvsLimit = 10
      state.cvsSkip = 0
      state.selectedCvId = undefined
    }
  },
})

export const {
  setCvsCounter,
  setCvsLimit,
  setCvsSkip,
  setCvs,
  updateCv,
  removeCv,
  setSelectedCvId,
  clearCvs
} = cvsSlice.actions

export const cvsReducer = cvsSlice.reducer
