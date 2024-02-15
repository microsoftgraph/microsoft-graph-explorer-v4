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

});