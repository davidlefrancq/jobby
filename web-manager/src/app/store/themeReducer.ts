import { ThemeType } from '@/types/ThemeType';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ThemeState {
  theme: ThemeType;
}

const initialState: ThemeState = {
  theme: 'dark',
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeType>) {
      state.theme = action.payload;
    },
  },
})

export const {
  setTheme,
} = themeSlice.actions

export const themeReducer = themeSlice.reducer
