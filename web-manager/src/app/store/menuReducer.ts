import { createSlice } from "@reduxjs/toolkit"

export enum MenuTargetEnum {
  cvs = 'cvs',
  jobs = 'jobs',
  steps = 'steps',
}

interface MenuState {
  target: MenuTargetEnum | null
  autoMode: boolean
}

const initialState: MenuState = {
  target: MenuTargetEnum.steps, // Default target can be set to any of the MenuTargetEnum values
  autoMode: true
}

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    selectMenuTarget(state, action: { payload: MenuTargetEnum }) {
      state.target = action.payload
    },

    clearMenuTarget(state) {
      state.target = null
    },
    setAutoMode(state, action: { payload: boolean }) {
      state.autoMode = action.payload
    }
  },
})

export const { selectMenuTarget, clearMenuTarget, setAutoMode } = menuSlice.actions

export const menuReducer = menuSlice.reducer