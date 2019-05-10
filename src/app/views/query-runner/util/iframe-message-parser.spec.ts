import { parse } from './iframe-message-parser';

describe('Iframe Message Parser', () => {
  it('parses url and verb correctly', () => {
    const message = `
    POST https://graph.microsoft.com/v1.0/me/calendars
    `;

    const parsedMessage = parse(message);
    expect(parsedMessage).toEqual({
      verb: 'POST',
      url: 'https://graph.microsoft.com/v1.0/me/calendars',
    });
  });

  it('ignores urls with parameters', () => {
    const message = `
    POST https://graph.microsoft.com/v1.0/me/calendars
    POST https://graph.microsoft.com/v1.0/users/{id | userPrincipalName}/calendars
    `;

    const parsedMessage = parse(message);
    expect(parsedMessage).toEqual({
      verb: 'POST',
      url: 'https://graph.microsoft.com/v1.0/me/calendars',
    });
  });

  it('parses headers correctly', () => {
    const message = `
    POST https://graph.microsoft.com/v1.0/me/calendars
    Content-type: application/json
    `;

    const parsedMessage = parse(message);
    expect(parsedMessage).toEqual({
      verb: 'POST',
      url: 'https://graph.microsoft.com/v1.0/me/calendars',
      headerKey: 'Content-type',
      headerValue: 'application/json',
    });
  });

  it('parses body correctly', () => {
    const message = `
{ "name": "Volunteer" }
`;

    const parsedMessage = parse(message);
    expect(parsedMessage).toEqual({
      body: '{ "name": "Volunteer" }',
    });
  });

  it('parses the whole message correctly', () => {
    const message = `
    POST https://graph.microsoft.com/v1.0/me/calendars
    Content-type: application/json
    
{ "name": "Volunteer" }
`;

    const parsedMessage = parse(message);
    expect(parsedMessage).toEqual({
      verb: 'POST',
      url: 'https://graph.microsoft.com/v1.0/me/calendars',
      headerKey: 'Content-type',
      headerValue: 'application/json',
      body: '{ "name": "Volunteer" }'
    });
  });
});
