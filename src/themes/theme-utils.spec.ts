import { CURRENT_THEME } from '../app/services/graph-constants';
import { readFromLocalStorage, saveToLocalStorage } from '../app/utils/local-storage';

describe('Tests theme utils should', () => {
  it('save theme to local storage then retrieve the saved theme', () => {
    const theme = 'dark';
    saveToLocalStorage(CURRENT_THEME,theme);
    expect(readFromLocalStorage(CURRENT_THEME)).toEqual(theme);
  })
})