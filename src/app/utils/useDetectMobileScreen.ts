import { useEffect } from 'react';
import { useAppDispatch } from '../../store';
import { toggleSidebar } from '../services/slices/sidebar-properties.slice';


const MOBILE_BREAKPOINT = 480;

export const useDetectMobileScreen = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
      dispatch(toggleSidebar({ showSidebar: !isMobile, mobileScreen: isMobile }));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);
};