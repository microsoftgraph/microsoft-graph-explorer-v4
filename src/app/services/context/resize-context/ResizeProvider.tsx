import { ReactNode, useEffect, useMemo, useState } from 'react';
import { ResizeContext } from './ResizeContext';

interface ResizeProviderProps {
  children: ReactNode;
}
export const ResizeProvider = (props: ResizeProviderProps) => {
  const { children } = props;
  const [sidebarSize, setSidebarSize] = useState(0);
  const [responseSize, setResponseSize] = useState(0);
  const [parentHeight, setParentHeight] = useState(0);
  const [initiatorValue, setInitiatorValue] = useState('');
  const [dragValue, setDragValue] = useState(-1);

  useEffect(() => {
    const handleResize = (e: Event) => {
      const layout = document.getElementById('layout');
      if (layout) {
        const parentOffset = layout.parentElement?.offsetHeight ?? 0;
        setParentHeight(parentOffset);
        const customEvent = e as CustomEvent;
        const { initiator, value } = customEvent.detail as {
          initiator: string;
          value: number;
        };
        if (initiator === 'responseSize') {
          setResponseSize(value);
        } else if (initiator === 'sidebar') {
          setSidebarSize(value);
        }
        setInitiatorValue(initiator);
        setDragValue(value);
      }
    };
    window.addEventListener('onResizeDragEnd', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const contextValue = useMemo(() => {
    return {
      sidebarSize,
      responseAreaSize: responseSize,
      parentHeight,
      initiator: initiatorValue,
      dragValue
    };
  }, [sidebarSize, responseSize, parentHeight, initiatorValue, dragValue]);
  return (
    <ResizeContext.Provider value={contextValue}>
      {children}
    </ResizeContext.Provider>
  );
};
