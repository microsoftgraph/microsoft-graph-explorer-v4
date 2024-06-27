import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const theme = createSlice({
  name: 'theme',
  initialState: 'light',
  reducers: {
    changeTheme: (_, action: PayloadAction<string>)=> action.payload
  }
})

export const {changeTheme} = theme.actions
export default theme.reducer;