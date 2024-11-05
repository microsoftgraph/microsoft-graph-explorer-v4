import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useAppSelector } from '../../../store';
import { useEffect } from 'react';
import { Banner } from '../../../types/banner';

const initialState: Banner = {
    isVisible: false
};

const bannerSlice = createSlice({
    name: 'banner',
    initialState,
    reducers: {
        showBanner(state) {
            state.isVisible = true;
        },
        hideBanner(state) {
            state.isVisible = false;
        }
    }
});

export const { showBanner, hideBanner } = bannerSlice.actions;

export default bannerSlice.reducer;
// Subscribe to store updates and save the banner state to localStorage
export const saveBannerState = () => {
    const banner = useAppSelector(state=>state.banner)
    useEffect(()=>{
        console.log('setting banner state', banner)
    }, [banner])
};