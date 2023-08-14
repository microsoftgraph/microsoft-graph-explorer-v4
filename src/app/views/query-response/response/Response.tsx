
import { useDispatch } from 'react-redux';

import { AppDispatch, useAppSelector } from '../../../../store';
import { getContentType } from '../../../services/actions/query-action-creator-util';
import { convertVhToPx, getResponseHeight } from '../../common/dimensions/dimensions-adjustment';
import ResponseDisplay from './ResponseDisplay';
import { ResponseMessages } from './ResponseMessages';

const Response = () => {
  const { dimensions: { response }, graphResponse, responseAreaExpanded, sampleQuery, authToken, graphExplorerMode } =
    useAppSelector((state) => state);
  const { body, headers } = graphResponse;
  const dispatch: AppDispatch = useDispatch();

  const defaultHeight = convertVhToPx(getResponseHeight(response.height, responseAreaExpanded), 220);
  let responseHeight = defaultHeight;

  const queryResponseElement = document.getElementsByClassName('query-response')[0];
  if(queryResponseElement){
    const queryResponseElementHeight = queryResponseElement?.clientHeight;
    responseHeight = `${queryResponseElementHeight-140}px`
  }

  const contentDownloadUrl = body?.contentDownloadUrl;
  const throwsCorsError = body?.throwsCorsError;
  const contentType = getContentType(headers);
  return (
    <div style={{ display: 'block' }}>
      {ResponseMessages(graphResponse, sampleQuery, authToken, graphExplorerMode, dispatch)}
      {!contentDownloadUrl && !throwsCorsError && headers &&
        <ResponseDisplay
          contentType={contentType}
          body={body}
          height={responseAreaExpanded ? defaultHeight : responseHeight}
        />}
    </div>
  );

};

export default Response;