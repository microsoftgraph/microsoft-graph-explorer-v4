import sidebarReducer, { toggleSidebar } from './sidebar-properties.slice';
import { QUERY_GRAPH_RUNNING, SET_SAMPLE_QUERY_SUCCESS, QUERY_GRAPH_SUCCESS } from '../redux-constants';

describe('sidebar-properties slice', () => {
  const defaultState = { showSidebar: false, mobileScreen: false };

  it('should return initial state', () => {
    const state = sidebarReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(defaultState);
  });

  it('should toggle sidebar visibility', () => {
    const state = sidebarReducer(defaultState, toggleSidebar({ showSidebar: true }));
    expect(state.showSidebar).toBe(true);
  });

  it('should toggle sidebar off', () => {
    const state = sidebarReducer(
      { showSidebar: true, mobileScreen: false },
      toggleSidebar({ showSidebar: false })
    );
    expect(state.showSidebar).toBe(false);
  });

  it('should set mobileScreen', () => {
    const state = sidebarReducer(defaultState, toggleSidebar({ mobileScreen: true }));
    expect(state.mobileScreen).toBe(true);
  });

  it('should hide sidebar on QUERY_GRAPH_RUNNING when on mobile', () => {
    const mobileState = { showSidebar: true, mobileScreen: true };
    const state = sidebarReducer(mobileState, { type: QUERY_GRAPH_RUNNING });
    expect(state.showSidebar).toBe(false);
  });

  it('should not hide sidebar on QUERY_GRAPH_RUNNING when not mobile', () => {
    const desktopState = { showSidebar: true, mobileScreen: false };
    const state = sidebarReducer(desktopState, { type: QUERY_GRAPH_RUNNING });
    expect(state.showSidebar).toBe(true);
  });

  it('should hide sidebar on SET_SAMPLE_QUERY_SUCCESS when mobile', () => {
    const mobileState = { showSidebar: true, mobileScreen: true };
    const state = sidebarReducer(mobileState, { type: SET_SAMPLE_QUERY_SUCCESS });
    expect(state.showSidebar).toBe(false);
  });

  it('should hide sidebar on QUERY_GRAPH_SUCCESS when mobile', () => {
    const mobileState = { showSidebar: true, mobileScreen: true };
    const state = sidebarReducer(mobileState, { type: QUERY_GRAPH_SUCCESS });
    expect(state.showSidebar).toBe(false);
  });
});
