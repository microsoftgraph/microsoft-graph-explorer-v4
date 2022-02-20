import { sidebarProperties } from '../../../app/services/reducers/toggle-sidebar-reducer';
import {
  SET_SAMPLE_QUERY_SUCCESS, TOGGLE_SIDEBAR_SUCCESS,
  VIEW_HISTORY_ITEM_SUCCESS
} from '../../../app/services/redux-constants';


describe('Toggle sidebar', () => {
  it('should handle TOGGLE_SIDEBAR_SUCCESS', () => {
    const initialState = {
      showSidebar: false,
      mobileScreen: false
    }

    const action = {
      type: TOGGLE_SIDEBAR_SUCCESS,
      response: {
        showSidebar: true,
        mobileScreen: false
      }
    }

    const expectedState = {
      showSidebar: true,
      mobileScreen: false
    }
    const newState = sidebarProperties(initialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle SET_SAMPLE_QUERY_SUCCESS', () => {
    const initialState = {
      showSidebar: true,
      mobileScreen: true
    }

    const action = {
      type: SET_SAMPLE_QUERY_SUCCESS,
      response: {}
    }

    const expectedState = {
      showSidebar: false,
      mobileScreen: true
    }
    const newState = sidebarProperties(initialState, action);
    expect(newState.showSidebar).toEqual(expectedState.showSidebar);
  });

  it('should handle VIEW_HISTORY_ITEM_SUCCESS', () => {
    const initialState = {
      showSidebar: true,
      mobileScreen: true
    }

    const action = {
      type: VIEW_HISTORY_ITEM_SUCCESS,
      response: {
        showSidebar: false,
        mobileScreen: true
      }
    }

    const expectedState = {
      showSidebar: false,
      mobileScreen: true
    }
    const newState = sidebarProperties(initialState, action);
    expect(newState.showSidebar).toEqual(expectedState.showSidebar);
  });

  it('should return default state', () => {
    const initialState = {
      showSidebar: false,
      mobileScreen: false
    }

    const action = {
      type: 'NOT_A_VALID_ACTION',
      response: ''
    }

    const expectedState = {
      showSidebar: false,
      mobileScreen: false
    }
    const newState = sidebarProperties(initialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle QUERY_GRAPH_RUNNING', () => {
    const initialState = {
      showSidebar: true,
      mobileScreen: true
    }
    const action = {
      type: 'QUERY_GRAPH_RUNNING',
      response: ''
    }

    const expectedState = {
      showSidebar: false,
      mobileScreen: true
    }
    const newState = sidebarProperties(initialState, action);
    expect(newState).toEqual(expectedState);
  })

})