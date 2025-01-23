

import { makeStyles } from '@fluentui/react-components';
import { useAppSelector } from '../../../../store';
import { CustomBody, ResponseBody } from '../../../../types/query-response';
import { getContentType } from '../../../services/actions/query-action-creator-util';
import {
  convertVhToPx, getResponseEditorHeight,
  getResponseHeight
} from '../../common/dimensions/dimensions-adjustment';
import ResponseDisplayV9 from './ResponseDisplayV9';
import { ResponseMessagesV9 } from './ResponseMessagesV9';

const useStyles = makeStyles({
  container: {
  }
})

const ResponseV9 = () => {
  const styles = useStyles()
  const response = useAppSelector((state) => state.dimensions.response);
  const body = useAppSelector<ResponseBody>((state) => state.graphResponse.response.body);
  const headers = useAppSelector((state) => state.graphResponse.response.headers);
  const responseAreaExpanded = useAppSelector((state) => state.responseAreaExpanded);

  const defaultHeight = convertVhToPx(getResponseHeight(response.height, responseAreaExpanded), 220);
  const monacoHeight = getResponseEditorHeight(150);

  const contentDownloadUrl = (body as CustomBody)?.contentDownloadUrl;
  const throwsCorsError = (body as CustomBody)?.throwsCorsError;
  const contentType = getContentType(headers);

  return (
    <div className={styles.container}>
      <ResponseMessagesV9 />
      {!contentDownloadUrl && !throwsCorsError && headers &&
        <ResponseDisplayV9
          contentType={contentType}
          body={body as string}
          height={responseAreaExpanded ? defaultHeight : monacoHeight}
        />}
    </div>
  );

};

export default ResponseV9;