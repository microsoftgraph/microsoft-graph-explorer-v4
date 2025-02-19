import { makeStyles, tokens } from '@fluentui/react-components';
import { useAppSelector } from '../../../../store';
import { CustomBody, ResponseBody } from '../../../../types/query-response';
import { getContentType } from '../../../services/actions/query-action-creator-util';
import ResponseDisplay from './ResponseDisplay';
import { ResponseMessages } from './ResponseMessages';

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

const Response = () => {
  const styles = useStyles();
  const body = useAppSelector(
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
        <ResponseMessages />
      </div>
      {!contentDownloadUrl && !throwsCorsError && headers && (
        <ResponseDisplay contentType={contentType} body={body} />
      )}
    </div>
  );
};

export default Response;
