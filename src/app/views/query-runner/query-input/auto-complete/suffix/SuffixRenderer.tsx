import React from 'react';
import { makeStyles, Button, Tooltip } from '@fluentui/react-components';
import { DocumentText20Regular } from '@fluentui/react-icons';

import { useAppSelector } from '../../../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../../../telemetry';
import { GRAPH_URL } from '../../../../../services/graph-constants';
import { validateExternalLink } from '../../../../../utils/external-link-validation';
import { sanitizeQueryUrl } from '../../../../../utils/query-url-sanitization';
import { parseSampleUrl } from '../../../../../utils/sample-url-generation';
import { translateMessage } from '../../../../../utils/translate-messages';
import DocumentationService from './documentation';
import ShareButton from '../../share-query/ShareButton';

const useStyles = makeStyles({
  iconButton: {
    padding: '4px',
    minWidth: '32px'
  }
});

const SuffixRenderer = () => {
  const classes = useStyles();

  const sampleQuery = useAppSelector((state) => state.sampleQuery);
  const samples = useAppSelector((state) => state.samples);
  const resources = useAppSelector((state) => state.resources);

  const getDocumentationLink = (): string | null => {
    const { queries } = samples;
    const getChildren = () => {
      if (resources.data && Object.keys(resources.data).length > 0 && (sampleQuery.selectedVersion in resources.data)) {
        return resources.data[sampleQuery.selectedVersion].children ?? [];
      }
      return [];
    };

    const resourceDocumentationUrl = new DocumentationService({
      sampleQuery,
      source: getChildren()
    }).getDocumentationLink();

    const sampleDocumentationUrl = new DocumentationService({
      sampleQuery,
      source: queries
    }).getDocumentationLink();

    const documentationUrl = sampleDocumentationUrl || resourceDocumentationUrl;
    if (documentationUrl) {
      const hasQuery = documentationUrl.includes('?');
      const param = 'WT.mc_id=msgraph_inproduct_graphexhelp';
      return `${documentationUrl}${hasQuery ? '&' : '?'}${param}`;
    }
    return null;
  }

  const documentationLink = getDocumentationLink();
  const documentationLinkAvailable = !!documentationLink;

  const onDocumentationLinkClicked = () => {
    if (documentationLink) {
      window.open(documentationLink, '_blank');
      trackDocumentLinkClickedEvent();
    }
  };

  const trackDocumentLinkClickedEvent = async () => {
    const { requestUrl } = parseSampleUrl(sanitizeQueryUrl(sampleQuery.sampleUrl));
    const parsed = parseSampleUrl(sanitizeQueryUrl(`${GRAPH_URL}/v1.0/${requestUrl}`));

    const properties: { [key: string]: string } = {
      ComponentName: componentNames.AUTOCOMPLETE_DOCUMENTATION_LINK,
      QueryUrl: parsed.requestUrl,
      Link: documentationLink ?? ''
    };
    telemetry.trackEvent(eventTypes.LINK_CLICK_EVENT, properties);

    // Check if link throws error
    validateExternalLink(
      documentationLink || '',
      componentNames.AUTOCOMPLETE_DOCUMENTATION_LINK,
      documentationLink
    );
  };

  const tipMessage = documentationLinkAvailable
    ? translateMessage('Read documentation')
    : translateMessage('Query documentation not found');

  return (
    <>
      <Tooltip
        content={tipMessage}
        positioning="above"
        relationship="label"
      >
        <Button
          aria-label={tipMessage}
          disabled={!documentationLinkAvailable}
          onClick={onDocumentationLinkClicked}
          icon={<DocumentText20Regular />}
          className={classes.iconButton}
          appearance="subtle"
        />
      </Tooltip>

      <ShareButton />
    </>
  );
};

export default SuffixRenderer;
