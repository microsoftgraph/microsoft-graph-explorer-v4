import { POPUPS, initialState, Popup } from '.';
import { reducedPopups } from './reducedPopups';

function makePopup(overrides: Partial<Popup> = {}): Popup {
  return {
    component: (() => null) as any,
    popupsProps: { settings: { title: 'Test' } },
    type: 'dialog',
    id: '1',
    isOpen: true,
    ...overrides
  };
}

describe('reducedPopups', () => {
  it('returns initial state for unknown action', () => {
    const result = reducedPopups(undefined, { type: 'UNKNOWN', payload: makePopup() });
    expect(result).toEqual(initialState);
  });

  it('adds a popup with ADD_POPUPS', () => {
    const popup = makePopup({ id: '100' });
    const result = reducedPopups(initialState, { type: POPUPS.ADD_POPUPS, payload: popup });
    expect(result.popups).toHaveLength(1);
    expect(result.popups[0].isOpen).toBe(true);
    expect(result.popups[0].status).toBe('open');
  });

  it('filters out closed popups on ADD_POPUPS', () => {
    const closedPopup = makePopup({ id: '1', isOpen: false });
    const state = { popups: [closedPopup] };
    const newPopup = makePopup({ id: '2' });
    const result = reducedPopups(state, { type: POPUPS.ADD_POPUPS, payload: newPopup });
    expect(result.popups).toHaveLength(1);
    expect(result.popups[0].id).toBe('2');
  });

  it('closes a popup with DELETE_POPUPS', () => {
    const popup = makePopup({ id: '1', isOpen: true });
    const state = { popups: [popup] };
    const result = reducedPopups(state, { type: POPUPS.DELETE_POPUPS, payload: makePopup({ id: '1' }) });
    expect(result.popups[0].isOpen).toBe(false);
  });

  it('keeps other popups unchanged on DELETE_POPUPS', () => {
    const popup1 = makePopup({ id: '1', isOpen: true });
    const popup2 = makePopup({ id: '2', isOpen: true });
    const state = { popups: [popup1, popup2] };
    const result = reducedPopups(state, { type: POPUPS.DELETE_POPUPS, payload: makePopup({ id: '1' }) });
    expect(result.popups[1].isOpen).toBe(true);
  });
});
