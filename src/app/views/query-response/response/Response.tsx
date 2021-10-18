
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IRootState } from '../../../../types/root';
import { getContentType } from '../../../services/actions/query-action-creator-util';
import { responseMessages } from '../../app-sections/ResponseMessages';
import { convertVhToPx, getResponseHeight } from '../../common/dimensions-adjustment';
import ResponseDisplay from './ResponseDisplay';

const Response = () => {
  const { dimensions: { response }, graphResponse, responseAreaExpanded, sampleQuery } =
    useSelector((state: IRootState) => state);
  const { body, headers } = graphResponse;
  const dispatch = useDispatch();

  const height = convertVhToPx(getResponseHeight(response.height, responseAreaExpanded), 100);

  const contentDownloadUrl = body?.contentDownloadUrl;
  const contentType = getContentType(headers);
  return (
    <div style={{ display: 'block' }} className='response-preview-body'>
      {responseMessages(graphResponse, sampleQuery, dispatch)}
      {headers &&
        <ResponseDisplay
          contentType={contentType}
          body={!contentDownloadUrl && body}
          height={height}
        />}
    </div>
  );

};

export default Response;
