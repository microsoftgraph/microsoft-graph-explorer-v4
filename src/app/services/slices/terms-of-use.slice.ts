import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const termsOfUseSlice = createSlice({
  name: 'termsOfUse',
  initialState: true,
  reducers: {
    clearTermsOfUse: (_, action: PayloadAction<boolean>) => action.payload
  }
})

export const { clearTermsOfUse } = termsOfUseSlice.actions
export default termsOfUseSlice.reducer;