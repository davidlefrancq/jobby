import { createSlice } from "@reduxjs/toolkit"

interface HealthState {
  isAliveApi: boolean
}

const initialState: HealthState = {
  isAliveApi: false,
}

const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {
    setIsAliveApi(state, action: { payload: boolean }) {
      state.isAliveApi = action.payload
    },
  },
})

export const { setIsAliveApi } = healthSlice.actions

export const healthReducer = healthSlice.reducer