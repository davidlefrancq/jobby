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
      localStorage.setItem("hs_theme", action.payload);
    },
    clearTheme(state) {
      state.theme = 'auto';
      localStorage.setItem("hs_theme", 'auto');
    }
  },
})

export const {
  setTheme,
  clearTheme,
} = themeSlice.actions

export const themeReducer = themeSlice.reducer
