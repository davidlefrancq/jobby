// store/store.ts
import { configureStore } from '@reduxjs/toolkit'
import { jobsReducer } from './jobsReducer'
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import { notificationsReducer } from './notificationsReducer'

export const store = configureStore({
  reducer: {
    jobsReducer,
    notificationsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
