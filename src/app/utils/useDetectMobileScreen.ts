import { useEffect } from 'react';
import { useAppDispatch } from '../../store';
import { toggleSidebar } from '../services/slices/sidebar-properties.slice';


const MOBILE_BREAKPOINT = 768;

export const useDetectMobileScreen = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const updateMode = () => {
      dispatch(toggleSidebar({ showSidebar: !mediaQuery.matches, mobileScreen: mediaQuery.matches }));
    };

    updateMode();
    mediaQuery.addEventListener('change', updateMode);
    return () => mediaQuery.removeEventListener('change', updateMode);
  }, [dispatch]);
};