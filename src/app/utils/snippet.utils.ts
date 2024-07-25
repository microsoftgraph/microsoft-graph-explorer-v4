import { Header, IQuery } from '../../types/query-runner';

function constructHeaderString(sampleQuery: IQuery): string {
  const { sampleHeaders, selectedVerb } = sampleQuery;
  let headersString = '';

  const isContentTypeInHeaders: boolean = !!sampleHeaders.find(
    (header) => header.name.toLocaleLowerCase() === 'content-type'
  );

  if (sampleHeaders && sampleHeaders.length > 0) {
    headersString = getHeaderStringProperties(sampleHeaders);
  }

  headersString +=
    !isContentTypeInHeaders && selectedVerb !== 'GET'
      ? 'Content-Type: application/json\r\n'
      : '';
  return headersString;
}

function getHeaderStringProperties(sampleHeaders: Header[]): string {
  let constructedHeader = '';
  sampleHeaders.forEach((header: Header) => {
    constructedHeader += `${header.name}: ${header.value}\r\n`;
  });
  return constructedHeader;
}

export { constructHeaderString };