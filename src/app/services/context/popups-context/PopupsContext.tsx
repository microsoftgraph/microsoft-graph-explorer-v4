import { createContext, useContext, useReducer } from 'react';

import { PopupState } from '.';
import { reducedPopups } from './reducedPopups';

const PopupStateContext = createContext<PopupState>({
  popups: []
});
const PopupDispatchContext = createContext<any>({});

export function PopupsProvider({ children }: any) {
  const [state, dispatch] = useReducer(reducedPopups, {
    popups: []
  });

  return (
    <PopupStateContext.Provider value={state}>
      <PopupDispatchContext.Provider value={dispatch}>
        {children}
      </PopupDispatchContext.Provider>
    </PopupStateContext.Provider>
  );
}

export const usePopupsStateContext = () => useContext(PopupStateContext);
export const usePopupsDispatchContext = () => useContext(PopupDispatchContext);
