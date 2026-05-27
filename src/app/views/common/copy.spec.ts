jest.mock('../../../telemetry', () => ({
  telemetry: {
    trackCopyButtonClickEvent: jest.fn()
  }
}));

import { genericCopy, copy, trackedGenericCopy, copyAndTrackText } from './copy';
import { telemetry } from '../../../telemetry';

describe('Tests generic copy.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.execCommand = jest.fn();
  });

  it('should resolve to \'copied\' when genericCopy is called with a string', async () => {
    const response = await genericCopy('dummy text');
    expect(response).toBe('copied');
  });

  it('should call document.execCommand with copy', async () => {
    await genericCopy('test');
    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });

  it('should create and remove a textarea element', async () => {
    const appendSpy = jest.spyOn(document.body, 'appendChild');
    const removeSpy = jest.spyOn(document.body, 'removeChild');
    await genericCopy('text');
    expect(appendSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
    appendSpy.mockRestore();
    removeSpy.mockRestore();
  });

  describe('copy', () => {
    it('should focus, select, copy, unselect and blur element by id', async () => {
      const mockEl = { focus: jest.fn(), select: jest.fn(), blur: jest.fn() };
      jest.spyOn(document, 'getElementById').mockReturnValue(mockEl as any);

      const result = await copy('my-textarea');
      expect(result).toBe('copied');
      expect(mockEl.focus).toHaveBeenCalled();
      expect(mockEl.select).toHaveBeenCalled();
      expect(mockEl.blur).toHaveBeenCalled();
      expect(document.execCommand).toHaveBeenCalledWith('copy');
      expect(document.execCommand).toHaveBeenCalledWith('unselect');

      jest.restoreAllMocks();
    });
  });

  describe('trackedGenericCopy', () => {
    it('should copy text and track event', () => {
      trackedGenericCopy('text', 'Component');
      expect(document.execCommand).toHaveBeenCalledWith('copy');
      expect(telemetry.trackCopyButtonClickEvent).toHaveBeenCalledWith('Component', undefined, undefined);
    });

    it('should pass sampleQuery and properties', () => {
      const query = { sampleUrl: 'url', selectedVerb: 'GET' } as any;
      const props = { source: 'btn' };
      trackedGenericCopy('text', 'Comp', query, props);
      expect(telemetry.trackCopyButtonClickEvent).toHaveBeenCalledWith('Comp', query, props);
    });
  });

  describe('copyAndTrackText', () => {
    it('should copy and track without query', () => {
      copyAndTrackText('text', 'MyComp');
      expect(document.execCommand).toHaveBeenCalledWith('copy');
      expect(telemetry.trackCopyButtonClickEvent).toHaveBeenCalledWith('MyComp', undefined, undefined);
    });

    it('should pass properties', () => {
      copyAndTrackText('text', 'Comp', { tab: 'response' });
      expect(telemetry.trackCopyButtonClickEvent).toHaveBeenCalledWith('Comp', undefined, { tab: 'response' });
    });
  });
})
