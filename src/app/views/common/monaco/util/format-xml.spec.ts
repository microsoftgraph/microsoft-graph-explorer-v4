import { formatXml } from './format-xml';

describe('formatXml', () => {
  it('should format simple XML', () => {
    const xml = '<root><child>text</child></root>';
    const formatted = formatXml(xml);
    expect(formatted).toContain('<root>');
    expect(formatted).toContain('<child>text</child>');
    expect(formatted).toContain('</root>');
  });

  it('should indent nested elements', () => {
    const xml = '<root><parent><child>text</child></parent></root>';
    const formatted = formatXml(xml);
    const lines = formatted.split('\r\n');
    expect(lines.length).toBeGreaterThan(1);
  });

  it('should handle self-closing tags', () => {
    const xml = '<root><item/></root>';
    const formatted = formatXml(xml);
    expect(formatted).toContain('<item/>');
  });

  it('should handle empty elements', () => {
    const xml = '<root></root>';
    const formatted = formatXml(xml);
    expect(formatted).toContain('<root>');
    expect(formatted).toContain('</root>');
  });

  it('should handle XML with attributes', () => {
    const xml = '<root attr="value"><child name="test">text</child></root>';
    const formatted = formatXml(xml);
    expect(formatted).toContain('attr="value"');
    expect(formatted).toContain('name="test"');
  });
});
