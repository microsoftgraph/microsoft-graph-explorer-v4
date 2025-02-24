import { ContentType } from '../../../../types/enums';
import { isImageResponse } from '../../../services/actions/query-action-creator-util';
import { Image, MonacoV9 } from '../../common';
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
      <MonacoV9 body={formatXml(body)} language='text/html' readOnly={true} />
    );

  case 'text/html':
    return <MonacoV9 body={body} language='text/html' readOnly={true} />;

  default:
    if (isImageResponse(contentType) && typeof body !== 'string') {
      return (
        <Image styles={{ padding: '10px', height: '240px', width: '240px' }} body={body} alt='profile image' />
      );
    }
    return (
      <div style={{ flex: 1, height: '100%', display: 'flex' }}>
        <MonacoV9 body={body} readOnly language="application/json" />
      </div>
    );
  }
};

export default ResponseDisplay;
