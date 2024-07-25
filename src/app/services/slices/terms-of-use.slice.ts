import { createSlice } from '@reduxjs/toolkit';

const termsOfUseSlice = createSlice({
  name: 'termsOfUse',
  initialState: true,
  reducers: {
    clearTermsOfUse: () => { return false }
  }
})

export const { clearTermsOfUse } = termsOfUseSlice.actions
export default termsOfUseSlice.reducer;