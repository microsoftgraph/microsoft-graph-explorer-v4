import { formatJsonStringForAllBrowsers } from '../../../app/views/common/monaco/util/format-json';
import { formatXml } from '../../../app/views/common/monaco/util/format-xml';

describe('Tests json strings formatting in monaco editor ', () => {
  it('Tests json strings formatting in monaco editor', () => {
    const body = {
      name: 'Megan',
      surname: 'Bowen'
    }
    const formattedBody = formatJsonStringForAllBrowsers(body);
    expect(isJSON(formattedBody)).toBe(true);
  })

  it('Tests the xml formatter function', () => {
    // Arrange
    const xml = '<root><child>Hello</child></root>';
    // Act
    const formattedXml = formatXml(xml);
    // Assert
    expect(formattedXml).toBeDefined();
  })
})

const isJSON = (str: string) => {
  try {
    const json = JSON.parse(str);
    if (Object.prototype.toString.call(json).slice(8, -1) !== 'Object') {
      return false
    }
  } catch (e) {
    return false
  }
  return true
}