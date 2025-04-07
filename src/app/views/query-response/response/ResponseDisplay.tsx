import { ContentType } from '../../../../types/enums';
import { isImageResponse } from '../../../services/actions/query-action-creator-util';
import { Image, Monaco } from '../../common';
import { formatXml } from '../../common/monaco/util/format-xml';

interface ResponseDisplayProps {
  contentType: string;
  body: any;
}

const ResponseDisplay = (props: ResponseDisplayProps) => {
  const { contentType, body } = props;

  switch (contentType) {
  case 'application/xml':
    return (
      <Monaco body={formatXml(body)} language='text/html' readOnly={true} />
    );

  case 'text/html':
    return <Monaco body={body} language='text/html' readOnly={true} />;

  case 'application/json':
    return (
      <div style={{ flex: 1, height: '100%', display: 'flex' }}>
        <Monaco body={body} readOnly language="application/json" />
      </div>
    );

  default:
    if (isImageResponse(contentType) && typeof body !== 'string') {
      return (
        <Image styles={{ padding: '10px', height: '240px', width: '240px' }} body={body} alt='profile image' />
      );
    }
    return (
      <div style={{ flex: 1, height: '100%', display: 'flex' }}>
        <Monaco body={body} readOnly language="text/plain" />
      </div>
    );
  }
};

export default ResponseDisplay;
