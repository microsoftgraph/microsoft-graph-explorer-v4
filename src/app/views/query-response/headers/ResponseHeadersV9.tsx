import { RESPONSE_HEADERS_COPY_BUTTON } from '../../../../telemetry/component-names';

import { useAppSelector } from '../../../../store';
import { MonacoV9 } from '../../common';
import { trackedGenericCopy } from '../../common/copy';
import { CopyButtonV9 } from '../../common/lazy-loader/component-registry';

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
        <CopyButtonV9 handleOnClick={handleCopy} isIconButton={true} />
        <MonacoV9 body={headers} />
      </>
    );
  }

  return <div />;
};

export default ResponseHeaders;
