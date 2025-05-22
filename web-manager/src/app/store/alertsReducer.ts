import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IAlert } from '../components/AlertMessage'

interface alertsState {
  alerts: IAlert[]
}

const initialState: alertsState = {
  alerts: [],
}

const ascendingSort = (a: IAlert, b: IAlert) => {
  if (a.date < b.date) return -1
  if (a.date > b.date) return 1
  return 0
}

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    addAlert(state, action: PayloadAction<IAlert>) {
      state.alerts.push(action.payload)
      state.alerts = state.alerts.sort(ascendingSort)
    },
    removeAlert(state, action: PayloadAction<string>) {
      state.alerts = state.alerts.filter(j => j.date !== action.payload)
    },
    setAlerts(state, action: PayloadAction<IAlert[]>) {
      state.alerts = action.payload.sort(ascendingSort)
    },
  },
})

export const {
  addAlert,
  removeAlert,
  setAlerts,
} = alertsSlice.actions

export const alertsReducer = alertsSlice.reducer
