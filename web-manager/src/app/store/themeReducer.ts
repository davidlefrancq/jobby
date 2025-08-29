import { GraphicThemeType } from '@/types/GraphicThemeType';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ThemeState {
  theme: GraphicThemeType;
}

const initialState: ThemeState = {
  theme: 'dark',
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<GraphicThemeType>) {
      state.theme = action.payload;
    },
  },
})

export const {
  setTheme,
} = themeSlice.actions

export const themeReducer = themeSlice.reducer
