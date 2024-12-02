import { ContentType } from '../../../../types/enums';
import { isImageResponse } from '../../../services/actions/query-action-creator-util';
import { Image, MonacoV9 } from '../../common';
import { formatXml } from '../../common/monaco/util/format-xml';

interface ResponseDisplayProps {
  contentType: string;
  body: string;
  height: string;
}

const ResponseDisplay = (properties: ResponseDisplayProps) => {
  const { contentType, body, height } = properties;

  switch (contentType) {
  case 'application/xml':
    return <MonacoV9 body={formatXml(body)} language={'application/xml'} readOnly={true} height={height} />;

  case 'text/hmtl':
    return <MonacoV9 body={body} language={'text/hmtl'} readOnly={true} height={height} />;

  default:
    if (isImageResponse(contentType)) {
      return <Image
        styles={{ padding: '10px' }}
        body={body}
        alt='profile image' />;
    }
    return <MonacoV9 body={body} readOnly={true} language={ContentType.Json} height={height} />;
  }
}

export default ResponseDisplay;
