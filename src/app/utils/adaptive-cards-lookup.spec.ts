jest.mock('../../adaptivecards-templates', () => ({
  Files: { type: 'Files' },
  Groups: { type: 'Groups' },
  Messages: { type: 'Messages' },
  Profile: { type: 'Profile' },
  Site: { type: 'Site' },
  Sites: { type: 'Sites' },
  Users: { type: 'Users' }
}));

import { lookupTemplate } from './adaptive-cards-lookup';

describe('lookupTemplate', () => {
  it('returns Profile template for /me', () => {
    const result = lookupTemplate({ sampleUrl: 'https://graph.microsoft.com/v1.0/me', selectedVerb: 'GET', sampleHeaders: [] } as any);
    expect(result).toEqual({ type: 'Profile' });
  });

  it('returns Messages template for /me/messages', () => {
    const result = lookupTemplate({ sampleUrl: 'https://graph.microsoft.com/v1.0/me/messages', selectedVerb: 'GET', sampleHeaders: [] } as any);
    expect(result).toEqual({ type: 'Messages' });
  });

  it('returns Groups template for /groups', () => {
    const result = lookupTemplate({ sampleUrl: 'https://graph.microsoft.com/v1.0/groups', selectedVerb: 'GET', sampleHeaders: [] } as any);
    expect(result).toEqual({ type: 'Groups' });
  });

  it('returns Users template for /users', () => {
    const result = lookupTemplate({ sampleUrl: 'https://graph.microsoft.com/v1.0/users', selectedVerb: 'GET', sampleHeaders: [] } as any);
    expect(result).toEqual({ type: 'Users' });
  });

  it('returns Files template for /me/drive/root/children', () => {
    const result = lookupTemplate({ sampleUrl: 'https://graph.microsoft.com/v1.0/me/drive/root/children', selectedVerb: 'GET', sampleHeaders: [] } as any);
    expect(result).toEqual({ type: 'Files' });
  });

  it('returns undefined for unmapped URL', () => {
    const result = lookupTemplate({ sampleUrl: 'https://graph.microsoft.com/v1.0/subscriptions', selectedVerb: 'GET', sampleHeaders: [] } as any);
    expect(result).toBeUndefined();
  });

  it('returns undefined for empty query', () => {
    const result = lookupTemplate(null as any);
    expect(result).toBeUndefined();
  });
});
