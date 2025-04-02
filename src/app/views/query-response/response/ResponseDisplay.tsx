import { ContentType } from '../../../../types/enums';
import { isImageResponse } from '../../../services/actions/query-action-creator-util';
import { Image, Monaco } from '../../common';
import { formatXml } from '../../common/monaco/util/format-xml';

const ResponseDisplay = (properties: any) => {
  const { contentType, body, height } = properties;

  switch (contentType) {
  case ContentType.XML:
    return <Monaco body={formatXml(body)} language={ContentType.HTML} readOnly={true} height={height} />;

  case ContentType.HTML:
    return <Monaco body={body} language={ContentType.HTML} readOnly={true} height={height} />;

  default:
    if (isImageResponse(contentType)) {
      return <Image
        styles={{ padding: '10px' }}
        body={body}
        alt='profile image' />;
    }
    return <Monaco body={body} readOnly={true} language={ContentType.Json} height={height} />;
  }
}

export default ResponseDisplay;
