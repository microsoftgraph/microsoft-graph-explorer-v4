import { Label, Link, makeStyles, MessageBar, MessageBarBody, MessageBarTitle } from '@fluentui/react-components';
import { useAppSelector } from '../../../../store';
import { componentNames, telemetry } from '../../../../telemetry';
import { lookupToolkitUrl } from '../../../utils/graph-toolkit-lookup';
import { translateMessage } from '../../../utils/translate-messages';
import {
  convertVhToPx, getResponseEditorHeight,
  getResponseHeight
} from '../../common/dimensions/dimensions-adjustment';

const useMGTStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column'
  }
})
const GraphToolkitV9 = () => {
  const styles = useMGTStyles()
  const { sampleQuery, dimensions: { response }, responseAreaExpanded } = useAppSelector((state) => state);
  const { toolkitUrl, exampleUrl } = lookupToolkitUrl(sampleQuery);

  const defaultHeight = convertVhToPx(getResponseHeight(response.height, responseAreaExpanded), 220);
  const monacoHeight = getResponseEditorHeight(115);

  if (toolkitUrl && exampleUrl) {
    return <div className={styles.container}>
      <MessageBar intent='info'>
        <MessageBarBody>
          <MessageBarTitle>Microsoft Graph Toolkit</MessageBarTitle>
          {translateMessage('Open this example in')}{' '}
          <Link tabIndex={0} href={exampleUrl} target='_blank' rel='noopener noreferrer'
            onClick={(e) =>
              telemetry.trackLinkClickEvent((e.currentTarget as HTMLAnchorElement).href,
                componentNames.GRAPH_TOOLKIT_PLAYGROUND_LINK)}>
            {translateMessage('graph toolkit playground')}</Link>
        </MessageBarBody>
      </MessageBar>
      <iframe width='100%' height={responseAreaExpanded ? defaultHeight : monacoHeight}
        src={toolkitUrl} title={translateMessage('Graph toolkit')} />
    </div>
  }

  return (
    <Label weight="semibold">
      {translateMessage('We did not find a Graph toolkit for this query')} &nbsp;
      <Link tabIndex={0} href='https://aka.ms/mgt' rel='noopener norefferer' target='_blank' inline>
        {translateMessage('Learn more about the Microsoft Graph Toolkit')}
      </Link>
    </Label>
  );
}

// const styledGraphToolkit = styled(GraphToolkitV9, queryResponseStyles as any);
export default GraphToolkitV9;