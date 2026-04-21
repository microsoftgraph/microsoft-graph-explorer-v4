import { getTokens } from './tokens';

describe('Tests getTokens function', () => {
  it('should return an array of IToken objects', () => {
    const tokens = getTokens();
    expect(tokens.length).toBe(34);
  });

  it('returns tokens with user mail', () => {
    const user = { mail: 'test@example.com' };
    const tokens = getTokens(user);
    const domainToken = tokens.find(t => t.placeholder === 'domain');
    expect(domainToken!.authenticatedUserValueFn!()).toBe('example.com');
  });

  it('uses userPrincipalName when mail is absent', () => {
    const user = { userPrincipalName: 'user@contoso.com' };
    const tokens = getTokens(user);
    const mailToken = tokens.find(t => t.placeholder === 'user-mail');
    expect(mailToken!.authenticatedUserValueFn!()).toBe('user@contoso.com');
  });

  it('domain returns empty string when no email', () => {
    const tokens = getTokens();
    const domainToken = tokens.find(t => t.placeholder === 'domain');
    expect(domainToken!.authenticatedUserValueFn!()).toBe('');
  });

  it('today token returns ISO string', () => {
    const tokens = getTokens();
    const todayToken = tokens.find(t => t.placeholder === 'today');
    const val = todayToken!.defaultValueFn!();
    expect(new Date(val).toISOString()).toBe(val);
  });

  it('todayMinusHour returns past time', () => {
    const tokens = getTokens();
    const token = tokens.find(t => t.placeholder === 'todayMinusHour');
    const val = new Date(token!.defaultValueFn!());
    expect(val.getTime()).toBeLessThan(Date.now());
  });

  it('next-week returns future date', () => {
    const tokens = getTokens();
    const token = tokens.find(t => t.placeholder === 'next-week');
    const val = new Date(token!.defaultValueFn!());
    expect(val.getTime()).toBeGreaterThan(Date.now());
  });

  it('coworker-mail uses authenticatedUserValueFn', () => {
    const user = { mail: 'me@org.com' };
    const tokens = getTokens(user);
    const token = tokens.find(t => t.placeholder === 'coworker-mail');
    expect(token!.authenticatedUserValueFn!()).toBe('me@org.com');
  });

  it('domain defaultValueFn returns contoso.com', () => {
    const tokens = getTokens();
    const token = tokens.find(t => t.placeholder === 'domain');
    expect(token!.defaultValueFn!()).toBe('contoso.com');
  });
})