
import { RESPONSE_HEADERS_COPY_BUTTON } from '../../../../telemetry/component-names';

import { trackedGenericCopy } from '../../common/copy';
import { CopyButton } from '../../common/lazy-loader/component-registry';
import { convertVhToPx, getResponseEditorHeight,
  getResponseHeight } from '../../common/dimensions/dimensions-adjustment';
import { useAppSelector } from '../../../../store';
import { MonacoV9 } from '../../common';

const ResponseHeaders = () => {
  const { dimensions: { response }, graphResponse, responseAreaExpanded, sampleQuery } =
    useAppSelector((state) => state);
  const { headers } = graphResponse.response;

  const defaultHeight = convertVhToPx(getResponseHeight(response.height, responseAreaExpanded), 220);
  const monacoHeight = getResponseEditorHeight(120);


  const handleCopy = async () => trackedGenericCopy(JSON.stringify(headers), RESPONSE_HEADERS_COPY_BUTTON, sampleQuery)

  if (headers) {
    return (
      <div id='response-headers-tab'>
        <CopyButton
          handleOnClick={handleCopy}
          isIconButton={true}
          style={{ float: 'right', zIndex: 1 }}
        />
        <MonacoV9 body={headers} height={responseAreaExpanded ? defaultHeight : monacoHeight} />
      </div>
    );
  }

  return (
    <div />
  );
};

export default ResponseHeaders;
