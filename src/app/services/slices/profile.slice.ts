import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { IProfileState, IUser } from '../../../types/profile';
import {
  getProfileInformation,
  getBetaProfile,
  getProfileImage,
  getTenantInfo} from '../actions/profile-actions';

const initialState: IProfileState = {
  status: 'unset',
  user: undefined,
  error: undefined
}

const getProfileInfo = createAsyncThunk(
  'profile/getProfileInfo',
  async (_, {rejectWithValue}) => {
    try {
      const user: IUser = await getProfileInformation();
      const { profileType, ageGroup } = await getBetaProfile();
      user.profileType = profileType;
      user.ageGroup = ageGroup;
      user.profileImageUrl = await getProfileImage();
      user.tenant = await getTenantInfo(profileType);
      return user
    } catch (error) {
      rejectWithValue({ error });
    }
  }
)

const profile = createSlice({
  name:'profile',
  initialState,
  reducers:{},
  extraReducers: (builder)=>{
    builder
      .addCase(getProfileInfo.pending, (state)=>{
        state.status = 'unset'
        state.error = undefined
        state.user = undefined
      })
      .addCase(getProfileInfo.fulfilled, (state, action) => {
        state.status = 'success'
        state.user = action.payload
      })
      .addCase(getProfileInfo.rejected, (state, action) =>{
        state.error = action.error as Error
        state.status = 'error'
        state.user = undefined

      })
  }
})

export {getProfileInfo};
export default profile.reducer;