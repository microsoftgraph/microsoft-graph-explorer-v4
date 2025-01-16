import { createContext } from 'react';

interface ResizeContext {
  sidebarSize: number;
  responseAreaSize: number;
  dragValue: number;
  parentHeight: number;
  initiator: string;
}

export const ResizeContext = createContext<ResizeContext>({} as ResizeContext);
