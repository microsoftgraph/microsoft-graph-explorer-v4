

import { useAppSelector } from '../../../../store';
import { isIgraphExtra} from '../../../../types/query-response';
import { getContentType } from '../../../services/actions/query-action-creator-util';
import {
  convertVhToPx, getResponseEditorHeight,
  getResponseHeight
} from '../../common/dimensions/dimensions-adjustment';
import ResponseDisplayV9 from './ResponseDisplayV9';
import { ResponseMessagesV9 } from './ResponseMessagesV9';


const ResponseV9 = () => {
  const response = useAppSelector((state) => state.dimensions.response);
  const responseAreaExpanded = useAppSelector((state) => state.responseAreaExpanded);
  const graphResponse = useAppSelector((state) => state.graphResponse);
  const body = graphResponse.response.body
  const headers = graphResponse.response.headers

  const defaultHeight = convertVhToPx(getResponseHeight(response.height, responseAreaExpanded), 220);
  const monacoHeight = getResponseEditorHeight(150);
  const height = responseAreaExpanded ? defaultHeight : monacoHeight

  let contentDownloadUrl: string = '';
  let throwsCorsError: boolean = false;

  if (body && isIgraphExtra(body)) {
    contentDownloadUrl = body.contentDownloadUrl;
    throwsCorsError = body.throwsCorsError;
  }

  const contentType = getContentType(headers);

  return (
    <div style={{ display: 'block' }}>
      <ResponseMessagesV9 />
      {!contentDownloadUrl && !throwsCorsError && headers &&
        <ResponseDisplayV9
          contentType={contentType}
          body={body}
          height={parseInt(height, 10)}
        />}
    </div>
  );

};

export default ResponseV9;