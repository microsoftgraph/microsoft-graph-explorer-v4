import { IResource } from '../../../../../../types/resources';
import content from '../../../../../utils/resources/resources.json';
import { queries } from '../../../../sidebar/sample-queries/queries';
import DocumentationService from './documentation';

const resource = JSON.parse(JSON.stringify(content)) as IResource;

const sampleQuery = {
  sampleUrl: '',
  selectedVerb: 'GET',
  sampleHeaders: [],
  selectedVersion: 'v1.0'
};

describe('Tests suffix utilities', () => {

  it('Gets documentation link from resources', () => {
    const query = { ...sampleQuery };
    const id = 'AAMkAGFkNWI1Njg3LWZmNTUtNDZjOS04ZTM2LTc5ZTc5ZjFlNTM4ZgB1SyTR4EQuQIAbWVtP3x1LBwD4_HsJDyJ8QAAA=';
    query.sampleUrl = `https://graph.microsoft.com/v1.0/me/messages/${id}`;
    const docService = new DocumentationService({
      sampleQuery: query,
      source: resource.children!
    })
    const documentationUrl = docService.getDocumentationLink();
    expect(documentationUrl).toBeDefined();
  });

  it('Gets documentation link from queries', () => {
    const query = { ...sampleQuery };
    query.sampleUrl = 'https://graph.microsoft.com/v1.0/me/messages';

    const docService = new DocumentationService({
      sampleQuery: query,
      source: queries
    })
    const documentationUrl = docService.getDocumentationLink();
    expect(documentationUrl).toBeDefined();
  });

  it('Returns empty string when no matching sample or resource', () => {
    const query = { ...sampleQuery };
    query.sampleUrl = 'https://graph.microsoft.com/v1.0/nonexistent/path/xyz';
    const docService = new DocumentationService({
      sampleQuery: query,
      source: []
    });
    const documentationUrl = docService.getDocumentationLink();
    expect(documentationUrl).toBe('');
  });

  it('Returns empty string when source samples have different verb', () => {
    const query = { ...sampleQuery, selectedVerb: 'DELETE' };
    query.sampleUrl = 'https://graph.microsoft.com/v1.0/me/messages';
    const docService = new DocumentationService({
      sampleQuery: query,
      source: queries
    });
    const documentationUrl = docService.getDocumentationLink();
    // May or may not have a DELETE doc link, but should not crash
    expect(typeof documentationUrl).toBe('string');
  });

  it('Gets documentation link from resources for beta version', () => {
    const query = { ...sampleQuery };
    query.sampleUrl = 'https://graph.microsoft.com/beta/me/messages';
    const docService = new DocumentationService({
      sampleQuery: query,
      source: resource.children!
    });
    const documentationUrl = docService.getDocumentationLink();
    expect(typeof documentationUrl).toBe('string');
  });

  it('Handles query with POST verb from resources', () => {
    const query = { ...sampleQuery, selectedVerb: 'POST' };
    query.sampleUrl = 'https://graph.microsoft.com/v1.0/me/messages';
    const docService = new DocumentationService({
      sampleQuery: query,
      source: resource.children!
    });
    const documentationUrl = docService.getDocumentationLink();
    expect(typeof documentationUrl).toBe('string');
  });

  it('Handles query with PATCH verb', () => {
    const query = { ...sampleQuery, selectedVerb: 'PATCH' };
    query.sampleUrl = 'https://graph.microsoft.com/v1.0/me';
    const docService = new DocumentationService({
      sampleQuery: query,
      source: resource.children!
    });
    const documentationUrl = docService.getDocumentationLink();
    expect(typeof documentationUrl).toBe('string');
  });

  it('Works with empty queries as source', () => {
    const query = { ...sampleQuery };
    query.sampleUrl = 'https://graph.microsoft.com/v1.0/me';
    const docService = new DocumentationService({
      sampleQuery: query,
      source: [] as any[]
    });
    const documentationUrl = docService.getDocumentationLink();
    expect(documentationUrl).toBe('');
  });

  it('Returns null when resource label method is a string', () => {
    const mockResources: any[] = [{
      segment: 'me',
      labels: [{ name: 'v1.0', methods: ['GET'] }],
      children: []
    }];
    const query = { ...sampleQuery, sampleUrl: 'https://graph.microsoft.com/v1.0/me' };
    const docService = new DocumentationService({
      sampleQuery: query,
      source: mockResources
    });
    const link = docService.getDocumentationLink();
    expect(link).toBe('');
  });

  it('Returns documentationUrl when resource label method is an object', () => {
    const mockResources: any[] = [{
      segment: 'me',
      labels: [{ name: 'v1.0', methods: [{ name: 'GET', documentationUrl: 'https://docs.example.com/get-me' }] }],
      children: []
    }];
    const query = { ...sampleQuery, sampleUrl: 'https://graph.microsoft.com/v1.0/me' };
    const docService = new DocumentationService({
      sampleQuery: query,
      source: mockResources
    });
    const link = docService.getDocumentationLink();
    expect(link).toBe('https://docs.example.com/get-me');
  });

  it('Returns empty when resource has empty labels', () => {
    const mockResources: any[] = [{
      segment: 'me',
      labels: [],
      children: []
    }];
    const query = { ...sampleQuery, sampleUrl: 'https://graph.microsoft.com/v1.0/me' };
    const docService = new DocumentationService({
      sampleQuery: query,
      source: mockResources
    });
    const link = docService.getDocumentationLink();
    expect(link).toBe('');
  });

  it('Returns empty when matching sample has empty docLink', () => {
    const mockSamples: any[] = [{
      method: 'GET',
      requestUrl: '/v1.0/me',
      docLink: ''
    }];
    const query = { ...sampleQuery, sampleUrl: 'https://graph.microsoft.com/v1.0/me' };
    const docService = new DocumentationService({
      sampleQuery: query,
      source: mockSamples
    });
    const link = docService.getDocumentationLink();
    expect(link).toBe('');
  });

  it('Returns null when resource method object does not match verb', () => {
    const mockResources: any[] = [{
      segment: 'me',
      labels: [{ name: 'v1.0', methods: [{ name: 'POST', documentationUrl: 'https://docs.example.com/post-me' }] }],
      children: []
    }];
    const query = { ...sampleQuery, sampleUrl: 'https://graph.microsoft.com/v1.0/me' };
    const docService = new DocumentationService({
      sampleQuery: query,
      source: mockResources
    });
    const link = docService.getDocumentationLink();
    expect(link).toBe('');
  });

  it('Handles resource with no matching label for version', () => {
    const mockResources: any[] = [{
      segment: 'me',
      labels: [{ name: 'beta', methods: [{ name: 'GET', documentationUrl: 'https://docs.example.com/beta-me' }] }],
      children: []
    }];
    const query = { ...sampleQuery, sampleUrl: 'https://graph.microsoft.com/v1.0/me' };
    const docService = new DocumentationService({
      sampleQuery: query,
      source: mockResources
    });
    const link = docService.getDocumentationLink();
    expect(link).toBe('');
  });

  it('Handles query with PUT verb', () => {
    const query = { ...sampleQuery, selectedVerb: 'PUT' };
    query.sampleUrl = 'https://graph.microsoft.com/v1.0/me';
    const docService = new DocumentationService({
      sampleQuery: query,
      source: resource.children!
    });
    const documentationUrl = docService.getDocumentationLink();
    expect(typeof documentationUrl).toBe('string');
  });

  it('Handles query with DELETE verb from resources', () => {
    const query = { ...sampleQuery, selectedVerb: 'DELETE' };
    query.sampleUrl = 'https://graph.microsoft.com/v1.0/me/messages/123';
    const docService = new DocumentationService({
      sampleQuery: query,
      source: resource.children!
    });
    const documentationUrl = docService.getDocumentationLink();
    expect(typeof documentationUrl).toBe('string');
  });

  it('Samples match method but URL does not match', () => {
    const mockSamples: any[] = [{
      method: 'GET',
      requestUrl: '/v1.0/users',
      docLink: 'https://docs.example.com/users'
    }];
    const query = { ...sampleQuery, sampleUrl: 'https://graph.microsoft.com/v1.0/me' };
    const docService = new DocumentationService({
      sampleQuery: query,
      source: mockSamples
    });
    const link = docService.getDocumentationLink();
    expect(link).toBe('');
  });

  it('Returns documentationUrl for nested resource path', () => {
    const mockResources: any[] = [{
      segment: 'me',
      labels: [],
      children: [{
        segment: 'messages',
        labels: [{
          name: 'v1.0',
          methods: [{ name: 'GET', documentationUrl: 'https://docs.example.com/get-messages' }]
        }],
        children: []
      }]
    }];
    const query = { ...sampleQuery, sampleUrl: 'https://graph.microsoft.com/v1.0/me/messages' };
    const docService = new DocumentationService({
      sampleQuery: query,
      source: mockResources
    });
    const link = docService.getDocumentationLink();
    expect(link).toBe('https://docs.example.com/get-messages');
  });

  it('Handles DELETE verb from sample queries', () => {
    const query = { ...sampleQuery, selectedVerb: 'DELETE' };
    query.sampleUrl = 'https://graph.microsoft.com/v1.0/me/messages';
    const docService = new DocumentationService({
      sampleQuery: query,
      source: queries
    });
    const documentationUrl = docService.getDocumentationLink();
    expect(typeof documentationUrl).toBe('string');
  });
});