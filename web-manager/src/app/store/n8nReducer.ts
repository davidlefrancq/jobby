import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type WorkflowStatus = '' | 'processing' | 'success' | 'error';

interface N8NState {
  isStartedWorkflows: boolean
  linkedInStarted: boolean
  linkedInStatus: WorkflowStatus
  franceTravailStarted: boolean
  franceTravailStatus: WorkflowStatus
  companiesDetailsStarted: boolean
  companiesDetailsStatus: WorkflowStatus
}

const initialState: N8NState = {
  isStartedWorkflows: false,
  linkedInStarted: false,
  linkedInStatus: '',
  franceTravailStarted: false,
  franceTravailStatus: '',
  companiesDetailsStarted: false,
  companiesDetailsStatus: '',
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
    setLinkedInStatus(state, action: PayloadAction<WorkflowStatus>) {
      state.linkedInStatus = action.payload
    },
    setFranceTravailStarted(state, action: PayloadAction<boolean>) {
      state.franceTravailStarted = action.payload
    },
    setFranceTravailStatus(state, action: PayloadAction<WorkflowStatus>) {
      state.franceTravailStatus = action.payload
    },
    setCompaniesDetailsStarted(state, action: PayloadAction<boolean>) {
      state.companiesDetailsStarted = action.payload
    },
    setCompaniesDetailsStatus(state, action: PayloadAction<WorkflowStatus>) {
      state.companiesDetailsStatus = action.payload
    },
  },
})

export const {
  setIsStartedWorkflows,
  setLinkedInStarted,
  setLinkedInStatus,
  setFranceTravailStarted,
  setFranceTravailStatus,
  setCompaniesDetailsStarted,
  setCompaniesDetailsStatus,
} = n8nSlice.actions

export const n8nReducer = n8nSlice.reducer
