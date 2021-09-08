import {
  Callout, getId, Icon, ITooltipHostStyles, Spinner, Text, TooltipHost
} from '@fluentui/react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { ISampleQuery } from '../../../../../../types/query-runner';
import { IRootState } from '../../../../../../types/root';
import { sanitizeQueryUrl } from '../../../../../utils/query-url-sanitization';
import { parseSampleUrl } from '../../../../../utils/sample-url-generation';
import { translateMessage } from '../../../../../utils/translate-messages';
import { HintList } from './HintList';
import { getMatchingSamples, styles } from './suffix-util';

const SuffixRenderer = () => {
  const { autoComplete, sampleQuery, samples, queryRunnerStatus } = useSelector(
    (state: IRootState) => state
  );
  const fetchingSuggestions = autoComplete.pending;
  const autoCompleteError = autoComplete.error;
  const { requestUrl, queryVersion } =
    parseSampleUrl(sanitizeQueryUrl(sampleQuery.sampleUrl));

  const getDocumentationLink = () => {
    const { queries } = samples;
    const sampleUrl = `/${queryVersion}/${requestUrl}`;
    if (queries) {
      const querySamples: ISampleQuery[] = getMatchingSamples({ queries, sampleQuery, sampleUrl, queryRunnerStatus });

      const hasDocumentationLink = (querySamples.length > 0);
      if (hasDocumentationLink) {
        return {
          link: {
            url: querySamples[0].docLink,
            name: translateMessage('View documentation')
          },
          description: '',
          title: ''
        };
      }
    }
    return null;
  }

  const getHints = () => {
    const availableHints: any[] = [];
    const documentationLink = getDocumentationLink();
    if (documentationLink) {
      availableHints.push(documentationLink);
    }
    return availableHints;
  }
  const hints = getHints();
  const hintsAvailable = hints.length > 0;

  const [isCalloutVisible, setCalloutVisibility] = useState(false);
  const buttonId = getId('callout-button');
  const labelId = getId('callout-label');
  const descriptionId = getId('callout-description');

  const toggleCallout = () => {
    let visible = isCalloutVisible;
    visible = !visible;
    setCalloutVisibility(visible);
  }

  const calloutProps = { gapSpace: 0 };
  const hostStyles: Partial<ITooltipHostStyles> = { root: { display: 'inline-block' } };

  if (fetchingSuggestions) {
    return (<TooltipHost
      content={translateMessage('Fetching suggestions')}
      id={getId()}
      calloutProps={calloutProps}
      styles={hostStyles}
    >
      <Spinner />
    </TooltipHost>
    );
  }

  if (autoCompleteError) {
    return (
      <TooltipHost
        content={translateMessage('No auto-complete suggestions available')}
        id={getId()}
        calloutProps={calloutProps}
        styles={hostStyles}
      >
        <Icon iconName='MuteChat' />
      </TooltipHost>);
  }

  if (hintsAvailable) {
    return (
      <>
        <Icon
          iconName='Info'
          className={styles.iconButton}
          onClick={toggleCallout}
          id={buttonId}
        />
        {isCalloutVisible && (
          <Callout
            className={styles.callout}
            ariaLabelledBy={labelId}
            ariaDescribedBy={descriptionId}
            role="alertdialog"
            gapSpace={0}
            target={`#${buttonId}`}
            onDismiss={toggleCallout}
            setInitialFocus
          >
            <Text block variant="xLarge" className={styles.title} id={labelId}>
              /{requestUrl}
            </Text>
            <HintList hints={hints} />
          </Callout>
        )}
      </>);
  }
  return null;
}

export default SuffixRenderer;
