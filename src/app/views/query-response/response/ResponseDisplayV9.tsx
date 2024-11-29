import { ContentType } from '../../../../types/enums';
import { isImageResponse } from '../../../services/actions/query-action-creator-util';
import { Image, MonacoV9 } from '../../common';
import { formatXml } from '../../common/monaco/util/format-xml';

interface ResponseDisplayProps {
  contentType: ContentType;
  body: string;
  height: number;
}

const ResponseDisplayV9 = (props: ResponseDisplayProps) => {
  const { contentType, body, height } = props;

  switch (contentType) {
  case ContentType.XML:
    return <MonacoV9 body={formatXml(body)} language={ContentType.HTML} readOnly={true} height={height.toString()} />;

  case ContentType.HTML:
    return <MonacoV9 body={body} language={ContentType.HTML} readOnly={true} height={height.toString()} />;

  default:
    if (isImageResponse(contentType)) {
      return <Image
        styles={{ padding: '10px' }}
        body={body}
        alt='profile image' />;
    }
    return <MonacoV9 body={body} readOnly={true} language={ContentType.Json} height={height.toString()} />;
  }
}

export default ResponseDisplayV9;
