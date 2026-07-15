import explorerModeReducer, { setGraphExplorerMode } from './explorer-mode.slice';
import { Mode } from '../../../types/enums';

describe('explorer-mode slice', () => {
  it('should return initial state as Mode.Complete', () => {
    const state = explorerModeReducer(undefined, { type: 'unknown' });
    expect(state).toBe(Mode.Complete);
  });

  it('should set explorer mode to TryIt', () => {
    const state = explorerModeReducer(Mode.Complete, setGraphExplorerMode(Mode.TryIt));
    expect(state).toBe(Mode.TryIt);
  });

  it('should set explorer mode to Complete', () => {
    const state = explorerModeReducer(Mode.TryIt, setGraphExplorerMode(Mode.Complete));
    expect(state).toBe(Mode.Complete);
  });
});
