import { RESPONSE_HEADERS_COPY_BUTTON } from '../../../../telemetry/component-names';

import { useAppSelector } from '../../../../store';
import { Monaco } from '../../common';
import { trackedGenericCopy } from '../../common/copy';
import { CopyButton } from '../../common/lazy-loader/component-registry';

const ResponseHeaders = () => {
  const graphResponse = useAppSelector((state) => state.graphResponse);

  const sampleQuery = useAppSelector((state) => state.sampleQuery);
  const { headers } = graphResponse.response;
  const handleCopy = async () =>
    trackedGenericCopy(
      JSON.stringify(headers),
      RESPONSE_HEADERS_COPY_BUTTON,
      sampleQuery
    );

  if (headers) {
    return (
      <>
        <CopyButton handleOnClick={handleCopy} isIconButton={true} />
        <Monaco body={headers} height='25rem' />
      </>
    );
  }

  return <div />;
};

export default ResponseHeaders;
