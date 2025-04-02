

import { useAppSelector } from '../../../../store';
import { getContentType } from '../../../services/actions/query-action-creator-util';
import {
  convertVhToPx, getResponseEditorHeight,
  getResponseHeight
} from '../../common/dimensions/dimensions-adjustment';
import ResponseDisplay from './ResponseDisplay';
import { ResponseMessages } from './ResponseMessages';

const Response = () => {
  const response = useAppSelector((state) => state.dimensions.response);
  const body = useAppSelector((state) => state.graphResponse.response.body);
  const headers = useAppSelector((state) => state.graphResponse.response.headers);
  const responseAreaExpanded = useAppSelector((state) => state.responseAreaExpanded);

  const defaultHeight = convertVhToPx(getResponseHeight(response.height, responseAreaExpanded), 220);
  const monacoHeight = getResponseEditorHeight(150);

  const contentDownloadUrl = body?.contentDownloadUrl;
  const throwsCorsError = body?.throwsCorsError;
  const contentType = getContentType(headers);

  return (
    <div style={{ display: 'block' }}>
      <ResponseMessages />
      {!contentDownloadUrl && !throwsCorsError && headers &&
        <ResponseDisplay
          contentType={contentType}
          body={body}
          height={responseAreaExpanded ? defaultHeight : monacoHeight}
        />}
    </div>
  );

};

export default Response;