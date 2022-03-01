import { lookupToolkitUrl } from './graph-toolkit-lookup';

describe('Tests lookToolkitUrl', () => {
  it('Returns valid toolkit url depending on sampleQuery passed', () => {
    // Arrange
    const sampleQuery = {
      selectedVerb: 'GET',
      sampleUrl: 'https://graph.microsoft.com/v1.0/me/',
      selectedVersion: 'v1.0',
      sampleBody: '',
      sampleHeaders: []
    }
    // Act
    const result = lookupToolkitUrl(sampleQuery);

    // Assert
    expect(result.toolkitUrl).
      toBe('https://mgt.dev/iframe.html?id=components-mgt-person-card--person-card&source=ge');
  });

  it('Returns null in toolkiturl property when toolkit url is unavailable', () => {
    // Arrange
    const sampleQuery = {
      selectedVerb: 'GET',
      sampleUrl: 'https://graph.microsoft.com/v1.0',
      selectedVersion: 'v1.0',
      sampleBody: '',
      sampleHeaders: []
    }
    // Act
    const result = lookupToolkitUrl(sampleQuery);

    // Assert
    expect(result.toolkitUrl).toBe(null);
  })
}
)
