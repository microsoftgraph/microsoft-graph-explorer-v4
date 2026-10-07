import { getSample } from './open-api-sample';

describe('getSample', () => {
  it('returns a string', () => {
    const result = getSample();
    expect(typeof result).toBe('string');
  });

  it('returns valid JSON', () => {
    const result = getSample();
    expect(() => JSON.parse(result)).not.toThrow();
  });

  it('contains openapi version field', () => {
    const parsed = JSON.parse(getSample());
    expect(parsed.openapi).toBe('3.0.1');
  });

  it('contains info with title and version', () => {
    const parsed = JSON.parse(getSample());
    expect(parsed.info).toBeDefined();
    expect(parsed.info.title).toBe('Partial Graph API');
    expect(parsed.info.version).toBe('v1.0');
  });

  it('contains servers with graph.microsoft.com URL', () => {
    const parsed = JSON.parse(getSample());
    expect(parsed.servers).toBeDefined();
    expect(parsed.servers.length).toBeGreaterThan(0);
    expect(parsed.servers[0].url).toContain('graph.microsoft.com');
  });

  it('contains paths with /me endpoint', () => {
    const parsed = JSON.parse(getSample());
    expect(parsed.paths).toBeDefined();
    expect(parsed.paths['/me']).toBeDefined();
  });

  it('/me endpoint has get operation', () => {
    const parsed = JSON.parse(getSample());
    const meEndpoint = parsed.paths['/me'];
    expect(meEndpoint.get).toBeDefined();
    expect(meEndpoint.get.operationId).toBe('me.user.GetUser');
  });

  it('/me get has $select and $expand parameters', () => {
    const parsed = JSON.parse(getSample());
    const params = parsed.paths['/me'].get.parameters;
    expect(params).toBeDefined();
    const paramNames = params.map((p: any) => p.name);
    expect(paramNames).toContain('$select');
    expect(paramNames).toContain('$expand');
  });
});
