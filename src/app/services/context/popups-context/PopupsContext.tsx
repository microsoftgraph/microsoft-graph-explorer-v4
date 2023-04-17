import { createContext, useContext, useReducer } from 'react';

import { PopupsComponent, PopupsProps, PopupsStatus, PopupsType } from '.';

export interface Popup<Data = {}> {
  component: React.ElementType<PopupsComponent<Data>>,
  popupsProps: PopupsProps<Data>,
  type: PopupsType,
  id: string;
  result?: any;
  open?: boolean;
  status?: PopupsStatus;
  reference?: string;
}

interface PopupAction {
  type: string;
  payload: Popup;
}

interface PopupState {
  popups: Popup[];
}

const initialState: PopupState = {
  popups: []
};

export const POPUPS = {
  ADD_POPUPS: 'ADD_POPUPS',
  DELETE_POPUPS: 'DELETE_POPUPS'
}

const PopupStateContext = createContext<PopupState>(initialState);
const PopupDispatchContext = createContext<any>({});

function reducedPopups(state: PopupState = initialState, action: PopupAction): PopupState {
  const payload = { ...action.payload };
  switch (action.type) {
    case POPUPS.ADD_POPUPS: {
      let popups = [...state.popups];
      popups = popups.filter(k => k.open);
      payload.open = true;
      payload.status = 'open';
      return {
        ...state,
        popups: [...popups, payload]
      }
    }

    case POPUPS.DELETE_POPUPS: {
      const popups = [...state.popups]
      const index = state.popups.findIndex((e) => e.id === payload.id);
      payload.open = false;
      popups[index] = payload;
      return {
        ...state,
        popups
      }
    }
  }
  return state;
}

export function PopupsProvider({ children }: any) {
  const [state, dispatch] = useReducer(reducedPopups, initialState);

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
