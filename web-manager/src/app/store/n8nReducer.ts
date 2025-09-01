import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IJobStatus } from '../interfaces/IJobStatus';

type WorkflowStatus = '' | 'processing' | 'success' | 'error';

interface N8NState {
  isStartedWorkflows: boolean
  isFinishedWorkflows: boolean
  linkedInStarted: boolean
  linkedInStatus: WorkflowStatus
  franceTravailStarted: boolean
  franceTravailStatus: WorkflowStatus
  companiesDetailsStarted: boolean
  companiesDetailsStatus: WorkflowStatus
  manualJobIds: string[]
  manualJobStatuses: Record<string, IJobStatus>
}

const initialState: N8NState = {
  isStartedWorkflows: false,
  isFinishedWorkflows: false,
  linkedInStarted: false,
  linkedInStatus: '',
  franceTravailStarted: false,
  franceTravailStatus: '',
  companiesDetailsStarted: false,
  companiesDetailsStatus: '',
  manualJobIds: [],
  manualJobStatuses: {},
}

const n8nSlice = createSlice({
  name: 'n8n',
  initialState,
  reducers: {
    resetMainWorkflows(state) {
      state.isStartedWorkflows = false;
      state.linkedInStarted = false;
      state.linkedInStatus = '';
      state.franceTravailStarted = false;
      state.franceTravailStatus = '';
    },
    resetCompaniesDetails(state) {
      state.companiesDetailsStarted = false;
      state.companiesDetailsStatus = '';
    },
    setIsStartedWorkflows(state, action: PayloadAction<boolean>) {
      state.isStartedWorkflows = action.payload
    },
    setIsFinishedWorkflows(state, action: PayloadAction<boolean>) {
      state.isFinishedWorkflows = action.payload
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
    setManualJobIds(state, action: PayloadAction<string[]>) {
      state.manualJobIds = action.payload
    },
    setManualJobStatuses(state, action: PayloadAction<Record<string, IJobStatus>>) {
      state.manualJobStatuses = action.payload
    },
  },
})

export const {
  resetMainWorkflows,
  resetCompaniesDetails,
  setIsStartedWorkflows,
  setIsFinishedWorkflows,
  setLinkedInStarted,
  setLinkedInStatus,
  setFranceTravailStarted,
  setFranceTravailStatus,
  setCompaniesDetailsStarted,
  setCompaniesDetailsStatus,
  setManualJobIds,
  setManualJobStatuses,
} = n8nSlice.actions

export const n8nReducer = n8nSlice.reducer
