import { PopupState, PopupAction, POPUPS, initialState } from '.';

export function reducedPopups(state: PopupState = initialState, action: PopupAction): PopupState {
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
      };
    }

    case POPUPS.DELETE_POPUPS: {
      const popups = [...state.popups];
      const index = state.popups.findIndex((e) => e.id === payload.id);
      payload.open = false;
      popups[index] = payload;
      return {
        ...state,
        popups
      };
    }
  }
  return state;
}
