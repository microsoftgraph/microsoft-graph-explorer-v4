import {
  Label,
  Link,
  makeStyles,
  MessageBar,
  MessageBarBody,
  tokens
} from '@fluentui/react-components';
import { useAppSelector } from '../../../../store';
import { componentNames, telemetry } from '../../../../telemetry';
import { lookupToolkitUrl } from '../../../utils/graph-toolkit-lookup';
import { translateMessage } from '../../../utils/translate-messages';

const useMGTStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingHorizontalMNudge
  }
});
const GraphToolkitV9 = () => {
  const styles = useMGTStyles();
  const {
    sampleQuery
  } = useAppSelector((state) => state);
  const { toolkitUrl, exampleUrl } = lookupToolkitUrl(sampleQuery);


  if (toolkitUrl && exampleUrl) {
    return (
      <div className={styles.container}>
        <MessageBar intent='info'>
          <MessageBarBody>
            {translateMessage('Open this example in')}{' '}
            <Link
              tabIndex={0}
              href={exampleUrl}
              target='_blank'
              rel='noopener noreferrer'
              onClick={(e) =>
                telemetry.trackLinkClickEvent(
                  (e.currentTarget as HTMLAnchorElement).href,
                  componentNames.GRAPH_TOOLKIT_PLAYGROUND_LINK
                )
              }
            >
              {translateMessage('graph toolkit playground')}
            </Link>
          </MessageBarBody>
        </MessageBar>
        <iframe
          width='100%'
          height='300px'
          src={toolkitUrl}
          title={translateMessage('Graph toolkit')}
        />
      </div>
    );
  }

  return (
    <Label weight='semibold'>
      {translateMessage('We did not find a Graph toolkit for this query')}{' '}
      &nbsp;
      <Link
        tabIndex={0}
        href='https://aka.ms/mgt'
        rel='noopener noreferrer'
        target='_blank'
        inline
      >
        {translateMessage('Learn more about the Microsoft Graph Toolkit')}
      </Link>
    </Label>
  );
};

export default GraphToolkitV9;
