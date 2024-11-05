import {
  getId, IconButton, IIconProps, ITooltipHostStyles, TooltipHost
} from '@fluentui/react';

import { useAppSelector } from '../../../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../../../telemetry';
import { GRAPH_URL } from '../../../../../services/graph-constants';
import { validateExternalLink } from '../../../../../utils/external-link-validation';
import { sanitizeQueryUrl } from '../../../../../utils/query-url-sanitization';
import { parseSampleUrl } from '../../../../../utils/sample-url-generation';
import { translateMessage } from '../../../../../utils/translate-messages';
import DocumentationService from './documentation';
import { styles } from './suffix.styles';
import ShareButton from '../../share-query/ShareButton';

const SuffixRenderer = () => {
  const sampleQuery = useAppSelector((state)=> state.sampleQuery);
  const samples = useAppSelector((state)=> state.samples);
  const resources = useAppSelector((state)=> state.resources);

  const buttonId = getId('callout-button');
  const calloutProps = { gapSpace: 0 };
  const hostStyles: Partial<ITooltipHostStyles> = { root: { display: 'inline-block' } };

  const getDocumentationLink = (): string | null => {
    const { queries } = samples;
    const getChildren = ()=> {
      if (resources.data && Object.keys(resources.data).length > 0 && sampleQuery.selectedVersion in resources.data){
        return resources.data[sampleQuery.selectedVersion].children ?? [];
      }
      return [];
    }
    const resourceDocumentationUrl = new DocumentationService({
      sampleQuery,
      source: getChildren()
    }).getDocumentationLink();

    const sampleDocumentationUrl = new DocumentationService({
      sampleQuery,
      source: queries
    }).getDocumentationLink();

    const documentationUrl = sampleDocumentationUrl || resourceDocumentationUrl;
    if (documentationUrl) { return documentationUrl; }
    return null;
  }

  const documentationLink = getDocumentationLink();
  const documentationLinkAvailable = !!documentationLink;
  const infoIcon: IIconProps = { iconName: 'TextDocument' };

  const onDocumentationLinkClicked = () => {
    if (documentationLink) {
      window.open(documentationLink, '_blank');
      trackDocumentLinkClickedEvent();
    }
  };

  const trackDocumentLinkClickedEvent = async (): Promise<void> => {
    const { requestUrl } = parseSampleUrl(sanitizeQueryUrl(sampleQuery.sampleUrl));
    const parsed = parseSampleUrl(sanitizeQueryUrl(`${GRAPH_URL}/v1.0/${requestUrl}`));

    const properties: { [key: string]: string } = {
      ComponentName: componentNames.AUTOCOMPLETE_DOCUMENTATION_LINK,
      QueryUrl: parsed.requestUrl,
      Link: documentationLink ?? ''
    };
    telemetry.trackEvent(eventTypes.LINK_CLICK_EVENT, properties);

    // Check if link throws error
    validateExternalLink(documentationLink || '', componentNames.AUTOCOMPLETE_DOCUMENTATION_LINK, documentationLink);
  }

  const tipMessage = documentationLinkAvailable ?
    translateMessage('Read documentation') :
    translateMessage('Query documentation not found')

  return (
    <>
      <TooltipHost
        content={tipMessage}
        id={getId()}
        calloutProps={calloutProps}
        styles={hostStyles}
      >
        <IconButton
          iconProps={infoIcon}
          className={styles.iconButton}
          onClick={() => onDocumentationLinkClicked()}
          id={buttonId}
          ariaLabel={tipMessage}
          disabled={!documentationLinkAvailable}
        />
      </TooltipHost>
      <ShareButton />
    </>
  );
}

export default SuffixRenderer;