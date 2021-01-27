
import React from 'react';
import { useSelector } from 'react-redux';

import { ContentType } from '../../../../types/enums';
import { isImageResponse } from '../../../services/actions/query-action-creator-util';
import { Image, Monaco } from '../../common';
import { convertVhToPx } from '../../common/dimensions-adjustment';
import { formatXml } from '../../common/monaco/util/format-xml';

const Response = () => {
  const language = 'json';

  const { dimensions, graphResponse } = useSelector((state: any) => state);
  const height = convertVhToPx(dimensions.response.height, 100);
  const { body, headers } = graphResponse;

  if (headers) {
    const contentType = getContentType(headers);
    return (<div style={{ display: 'block' }}>
      {displayComponent({
        contentType,
        body,
        height,
        language
      })}
    </div>);
  }
  return <div />;
};

function getContentType(headers: any) {
  let contentType = null;

  const contentTypes = headers['content-type'];
  if (contentTypes) {
    /* Example: application/json;odata.metadata=minimal;odata.streaming=true;IEEE754Compatible=false;charset=utf-8
    * Take the first option after splitting since it is the only value useful in the description of the content
    */
    const splitContentTypes = contentTypes.split(';');
    if (splitContentTypes.length > 0) {
      contentType = splitContentTypes[0].toLowerCase();
    }
  }
  return contentType;
}

function displayComponent(properties: any) {
  const { contentType, body, height, language } = properties;

  switch (contentType) {
    case ContentType.XML:
      return <Monaco body={formatXml(body)} language='xml' readOnly={true} height={height} />;

    case ContentType.HTML:
      return <Monaco body={body} language='html' readOnly={true} height={height} />;

    default:
      if (isImageResponse(contentType)) {
        return <Image
          styles={{ padding: '10px' }}
          body={body}
          alt='profile image'
        />;
      }
      return <Monaco body={body} readOnly={true} language={language} height={height} />;
  }
}

export default Response;
