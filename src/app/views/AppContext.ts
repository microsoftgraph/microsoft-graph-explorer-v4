import { Theme } from '@fluentui/react-components';
import React from 'react';
import { Dispatch, SetStateAction } from 'react';

interface AppContextState {
  selectedVerb: string;
  mobileScreen: boolean;
  hideDialog: boolean;
  sidebarTabSelection: string;
  theme: { key: string; fluentTheme: Theme };
}

interface AppContextValue {
  state: AppContextState;
  setState: Dispatch<SetStateAction<AppContextState>>;
}

export const AppContext = React.createContext<AppContextValue | undefined>(undefined);

export function useAppContext() {
  const value = React.useContext(AppContext);
  if (value === undefined) {
    throw new Error('App Provider not found');}
  return value;
}
