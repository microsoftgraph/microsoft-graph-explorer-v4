import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Banner } from '../../../types/banner';

const initialState: Banner = {
    isVisible: true
};

const bannerSlice = createSlice({
    name: 'banner',
    initialState,
    reducers: {
        setBannerState: (state, action: PayloadAction<boolean>) => {
            state.isVisible = action.payload;
        }
    }
});

export const { setBannerState } = bannerSlice.actions;

export default bannerSlice.reducer;
