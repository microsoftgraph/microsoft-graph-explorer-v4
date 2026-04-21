jest.mock('../../../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));

import { uiStringMap } from './uiStrings';

describe('uiStrings', () => {
  it('should export a map of UI strings', () => {
    expect(uiStringMap).toBeDefined();
    expect(typeof uiStringMap).toBe('object');
    expect(uiStringMap).toHaveProperty('Prompt_Title');
    expect(uiStringMap).toHaveProperty('Graph_Explorer_Rating_Question');
  });
});
