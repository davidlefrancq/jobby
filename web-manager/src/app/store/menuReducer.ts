import { createSlice } from "@reduxjs/toolkit"

export enum MenuTargetEnum {
  Jobs = 'jobs',
  CVs = 'cvs',
}

interface MenuState {
  target: MenuTargetEnum | null
}

const initialState: MenuState = {
  target: null,
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