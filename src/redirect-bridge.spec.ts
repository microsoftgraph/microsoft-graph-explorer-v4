const mockBroadcast = jest.fn();
jest.mock('@azure/msal-browser/redirect-bridge', () => ({
  broadcastResponseToMainFrame: () => mockBroadcast()
}), { virtual: true });

describe('redirect bridge entry', () => {
  beforeEach(() => {
    jest.resetModules();
    mockBroadcast.mockReset();
  });

  it('broadcasts the auth response to the opener on load', () => {
    mockBroadcast.mockResolvedValue(undefined);
    jest.isolateModules(() => require('./redirect-bridge'));
    expect(mockBroadcast).toHaveBeenCalledTimes(1);
  });

  it('logs instead of throwing when the response cannot be broadcast', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    mockBroadcast.mockRejectedValue(new Error('no_auth_payload'));
    jest.isolateModules(() => require('./redirect-bridge'));
    await new Promise(process.nextTick);
    expect(consoleError).toHaveBeenCalledWith(expect.any(String), expect.any(Error));
    consoleError.mockRestore();
  });
});
