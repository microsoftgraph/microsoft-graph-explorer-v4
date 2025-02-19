import { makeStyles, tokens } from '@fluentui/react-components';
import { useAppSelector } from '../../../../store';
import { CustomBody, ResponseBody } from '../../../../types/query-response';
import { getContentType } from '../../../services/actions/query-action-creator-util';
import ResponseDisplayV9 from './ResponseDisplayV9';
import { ResponseMessagesV9 } from './ResponseMessagesV9';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    height: '100%',
    overflow: 'hidden'
  },
  messageBars: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingHorizontalMNudge,
    paddingTop: tokens.spacingHorizontalMNudge,
    paddingBottom: tokens.spacingHorizontalMNudge
  }
});

const ResponseV9 = () => {
  const styles = useStyles();
  const body = useAppSelector<ResponseBody>(
    (state) => state.graphResponse.response.body
  );
  const headers = useAppSelector(
    (state) => state.graphResponse.response.headers
  );

  const contentDownloadUrl = (body as CustomBody)?.contentDownloadUrl;
  const throwsCorsError = (body as CustomBody)?.throwsCorsError;
  const contentType = getContentType(headers);

  return (
    <div className={styles.container}>
      <div className={styles.messageBars}>
        <ResponseMessagesV9 />
      </div>
      {!contentDownloadUrl && !throwsCorsError && headers && (
        <ResponseDisplayV9 contentType={contentType} body={body as string} />
      )}
    </div>
  );
};

export default ResponseV9;
