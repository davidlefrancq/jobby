// store/store.ts
import { configureStore, isPlain } from '@reduxjs/toolkit'
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import { notificationsReducer } from './notificationsReducer'
import { alertsReducer } from './alertsReducer'
import { jobsReducer } from './jobsReducer'
import { n8nReducer } from './n8nReducer'
import { menuReducer } from './menuReducer'
import { cvsReducer } from './cvsReducer'
import { healthReducer } from './healthReducer'
import { themeReducer } from './themeReducer'
import { JobStatus } from '../bo/JobStatus'

export const store = configureStore({
  reducer: {
    alertsReducer,
    cvsReducer,
    healthReducer,
    jobsReducer,
    menuReducer,
    n8nReducer,
    notificationsReducer,
    themeReducer,
  },
  middleware: (getDefault) => getDefault({
    // Serializability check configuration
    serializableCheck: {
      isSerializable: (value: unknown): boolean => {
        if (value instanceof JobStatus) return true;   // allow your BO
        if (value instanceof Date) return true;        // allow Date
        // keep RTK defaults for everything elses
        return (
          value === null ||
          typeof value !== 'object' ||
          Array.isArray(value) ||
          isPlain(value as object)
        );
      },
    },
  }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
