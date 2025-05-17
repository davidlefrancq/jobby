import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { INotification } from '../components/NotificationsPanel'

interface NotificationsState {
  notifications: INotification[]
}

const initialState: NotificationsState = {
  notifications: [],
}

const descendingSort = (a: INotification, b: INotification) => {
  if (a.id < b.id) return 1
  if (a.id > b.id) return -1
  return 0
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<INotification[]>) {
      state.notifications = action.payload.sort(descendingSort)
    },
    addNotification(state, action: PayloadAction<INotification>) {
      state.notifications.push(action.payload)
      state.notifications = state.notifications.sort(descendingSort)
    },
    updateNotification(state, action: PayloadAction<INotification>) {
      const idx = state.notifications.findIndex(j => j.id === action.payload.id)
      if (idx !== -1) state.notifications[idx] = action.payload
    },
    removeNotification(state, action: PayloadAction<number>) {
      state.notifications = state.notifications.filter(j => j.id !== action.payload)
    },
  },
})

export const {
  addNotification,
  removeNotification,
  setNotifications,
  updateNotification,
} = notificationsSlice.actions

export const notificationsReducer = notificationsSlice.reducer
