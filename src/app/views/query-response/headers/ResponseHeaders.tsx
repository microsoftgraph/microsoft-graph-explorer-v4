
import { RESPONSE_HEADERS_COPY_BUTTON } from '../../../../telemetry/component-names';

import { Monaco } from '../../common';
import { trackedGenericCopy } from '../../common/copy';
import { convertVhToPx, getResponseHeight } from '../../common/dimensions/dimensions-adjustment';
import { CopyButton } from '../../common/copy/CopyButton';
import { useAppSelector } from '../../../../store';

const ResponseHeaders = () => {
  const { dimensions: { response }, graphResponse, responseAreaExpanded, sampleQuery } =
    useAppSelector((state) => state);
  const { headers } = graphResponse;

  const defaultHeight = convertVhToPx(getResponseHeight(response.height, responseAreaExpanded), 220);
  let responseHeight = defaultHeight;

  const queryResponseElement = document.getElementsByClassName('query-response')[0];
  if(queryResponseElement){
    const queryResponseElementHeight = queryResponseElement?.clientHeight;
    responseHeight = `${queryResponseElementHeight-140}px`
  }


  const handleCopy = async () => trackedGenericCopy(JSON.stringify(headers), RESPONSE_HEADERS_COPY_BUTTON, sampleQuery)

  if (headers) {
    return (
      <div id='response-headers-tab'>
        <CopyButton
          handleOnClick={handleCopy}
          isIconButton={true}
          style={{ float: 'right', zIndex: 1 }}
        />
        <Monaco body={headers} height={responseHeight} />
      </div>
    );
  }

  return (
    <div />
  );
};

export default ResponseHeaders;
