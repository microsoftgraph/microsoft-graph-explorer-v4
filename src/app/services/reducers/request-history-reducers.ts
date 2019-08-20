import { writeData } from '../../../store/cache';
import { IAction } from '../../../types/action';
import { ADD_HISTORY_ITEM_SUCCESS } from '../redux-constants';
export function requestHistory(state: any[] = [], action: IAction): any {
  switch (action.type) {
    case ADD_HISTORY_ITEM_SUCCESS:
      let history = [...state, action.response];
      history = history.reduce((current, compare) => {
        return current.findIndex((historyItem: any) => {
          return historyItem.runTime === compare.runTime;
        }) < 0 ? [...current, compare] : current;
      }, []);

      writeData(history);
      return history;
    default:
      return state;
  }
}
