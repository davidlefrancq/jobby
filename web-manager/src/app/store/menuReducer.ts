import { createSlice } from "@reduxjs/toolkit"

export enum MenuTargetEnum {
  CVs = 'cvs',
  Jobs = 'jobs',
  Steps = 'steps',
}

interface MenuState {
  target: MenuTargetEnum | null
}

const initialState: MenuState = {
  target: MenuTargetEnum.Steps, // Default target can be set to any of the MenuTargetEnum values
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
    }
  },
})

export const { selectMenuTarget, clearMenuTarget } = menuSlice.actions

export const menuReducer = menuSlice.reducer