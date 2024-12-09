// import { ContentType } from '../../../../types/enums';
// import { isImageResponse } from '../../../services/actions/query-action-creator-util';
// import { Image, ImageV9, MonacoV9 } from '../../common';
// import { formatXml } from '../../common/monaco/util/format-xml';

// interface ResponseDisplayProps {
//   contentType: string;
//   body: string | ReadableStream;
//   height: string;
// }

// const ResponseDisplay = (properties: ResponseDisplayProps) => {
//   const { contentType, body, height } = properties;
//   console.log(contentType)

//   switch (contentType) {
//   case 'application/xml':
//     return <MonacoV9 body={formatXml(body as string)} language={'application/xml'} readOnly={true} height={height} />;

//   case 'text/html':
//     return <MonacoV9 body={body} language={'text/html'} readOnly={true} height={height} />;


//   default:
//     console.log('Image response', body);
//     if (isImageResponse(contentType) && body instanceof ReadableStream) {
//       return <ImageV9
//         body={body}
//         altText='profile image' />;
//     }
//     return <MonacoV9 body={body} readOnly={true} language={'application/json'} height={height} />;
//   }
// }

// export default ResponseDisplay;
