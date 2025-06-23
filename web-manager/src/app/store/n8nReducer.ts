import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface N8NState {
  isStartedWorkflows: boolean
  linkedInStarted: boolean
  googleAlertsStarted: boolean
  franceTravailStarted: boolean
  companiesDetailsStarted: boolean
}

const initialState: N8NState = {
  isStartedWorkflows: false,
  linkedInStarted: false,
  googleAlertsStarted: false,
  franceTravailStarted: false,
  companiesDetailsStarted: false,
}

const n8nSlice = createSlice({
  name: 'n8n',
  initialState,
  reducers: {
    setIsStartedWorkflows(state, action: PayloadAction<boolean>) {
      state.isStartedWorkflows = action.payload
    },
    setLinkedInStarted(state, action: PayloadAction<boolean>) {
      state.linkedInStarted = action.payload
    },
    setGoogleAlertsStarted(state, action: PayloadAction<boolean>) {
      state.googleAlertsStarted = action.payload
    },
    setFranceTravailStarted(state, action: PayloadAction<boolean>) {
      state.franceTravailStarted = action.payload
    },
    setCompaniesDetailsStarted(state, action: PayloadAction<boolean>) {
      state.companiesDetailsStarted = action.payload
    },
  },
})

export const {
  setIsStartedWorkflows,
  setLinkedInStarted,
  setGoogleAlertsStarted,
  setFranceTravailStarted,
  setCompaniesDetailsStarted,
} = n8nSlice.actions

export const n8nReducer = n8nSlice.reducer
