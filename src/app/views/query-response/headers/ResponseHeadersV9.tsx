
import { RESPONSE_HEADERS_COPY_BUTTON } from '../../../../telemetry/component-names';

import { useAppSelector } from '../../../../store';
import { MonacoV9 } from '../../common';
import { trackedGenericCopy } from '../../common/copy';
import {
  convertVhToPx, getResponseEditorHeight,
  getResponseHeight
} from '../../common/dimensions/dimensions-adjustment';
import { CopyButtonV9 } from '../../common/lazy-loader/component-registry';

const ResponseHeaders = () => {
  const response = useAppSelector(state => state.dimensions.response)
  const graphResponse = useAppSelector(state => state.graphResponse)
  const responseAreaExpanded = useAppSelector(state => state.responseAreaExpanded)
  const sampleQuery = useAppSelector(state => state.sampleQuery)
  const { headers } = graphResponse.response;

  const defaultHeight = convertVhToPx(getResponseHeight(response.height, responseAreaExpanded), 220);
  const monacoHeight = getResponseEditorHeight(120);


  const handleCopy = async () => trackedGenericCopy(JSON.stringify(headers), RESPONSE_HEADERS_COPY_BUTTON, sampleQuery)

  if (headers) {
    return (
      <>
        <CopyButtonV9 handleOnClick={handleCopy} isIconButton={true}/>
        <MonacoV9 body={headers} height={responseAreaExpanded ? defaultHeight : monacoHeight} />
      </>
    );
  }

  return (
    <div />
  );
};

export default ResponseHeaders;
