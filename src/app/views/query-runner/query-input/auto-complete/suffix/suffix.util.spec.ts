import { IResource } from '../../../../../../types/resources';
import content from '../../../../../utils/resources/resources.json';
import { getResourceDocumentationUrl, getSampleDocumentationUrl } from './suffix-util';

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
    const documentationUrl = getResourceDocumentationUrl({
      sampleQuery: query,
      source: resource.children
    });
    expect(documentationUrl).toBeDefined();
  });

  it('Gets documentation link from queries', () => {
    const query = { ...sampleQuery };
    query.sampleUrl = 'https://graph.microsoft.com/v1.0/me/messages';

    const documentationUrl = getSampleDocumentationUrl({
      sampleQuery: query,
      source: resource.children
    });
    expect(documentationUrl).toBeDefined();
  });

});