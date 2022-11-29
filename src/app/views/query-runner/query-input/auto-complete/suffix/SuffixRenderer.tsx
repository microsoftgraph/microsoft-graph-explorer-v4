import {
  Callout, getId, IconButton, IIconProps, ITooltipHostStyles,
  Spinner, Text, TooltipHost
} from '@fluentui/react';
import { useState } from 'react';

import { useAppSelector } from '../../../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../../../telemetry';
import { ISampleQuery } from '../../../../../../types/query-runner';
import { sanitizeQueryUrl } from '../../../../../utils/query-url-sanitization';
import { parseSampleUrl } from '../../../../../utils/sample-url-generation';
import { translateMessage } from '../../../../../utils/translate-messages';
import { HintList } from './HintList';
import { getMatchingSamples, IHint } from './suffix-util';
import { styles } from './suffix.styles';

const SuffixRenderer = () => {
  const { autoComplete, sampleQuery, samples, queryRunnerStatus } = useAppSelector(
    (state) => state
  );
  const fetchingSuggestions = autoComplete.pending;
  const autoCompleteError = autoComplete.error;
  const { requestUrl, queryVersion } =
    parseSampleUrl(sanitizeQueryUrl(sampleQuery.sampleUrl));

  const getDocumentationLink = (): IHint | null => {
    const { queries } = samples;
    const sampleUrl = `/${queryVersion}/${requestUrl}`;
    if (queries) {
      const querySamples: ISampleQuery[] = getMatchingSamples({ queries, sampleQuery, sampleUrl, queryRunnerStatus });

      const hasDocumentationLink = (querySamples.length > 0);
      if (hasDocumentationLink) {
        return {
          link: {
            url: querySamples[0].docLink || '',
            name: translateMessage('Learn more')
          },
          description: translateMessage('A documentation link for this URL exists. Click learn more to access it')
        };
      }
    }
    return null;
  }

  const [isCalloutVisible, setCalloutVisibility] = useState(false);
  const buttonId = getId('callout-button');
  const labelId = getId('callout-label');
  const descriptionId = getId('callout-description');

  const toggleCallout = () => {
    let visible = isCalloutVisible;
    visible = !visible;
    setCalloutVisibility(visible);
    if (visible) {
      trackToggleEvent()
    }
  }

  const trackToggleEvent = () => {
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT,
      {
        ComponentName: componentNames.QUERY_MORE_INFO_BUTTON,
        QuerySignature: `/${queryVersion}/${requestUrl}`
      });
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

  const getHints = (): IHint[] => {
    const availableHints: IHint[] = [];
    if (autoCompleteError) {
      availableHints.push({
        description: translateMessage('No auto-complete suggestions available')
      })
    }
    const documentationLink = getDocumentationLink();
    if (documentationLink) {
      availableHints.push(documentationLink);
    }
    return availableHints;
  }
  const hints = getHints();
  const hintsAvailable = hints.length > 0;
  const infoIcon: IIconProps = { iconName: 'Info' };


  return (
    <>
      <TooltipHost
        content={translateMessage('More info')}
        id={getId()}
        calloutProps={calloutProps}
        styles={hostStyles}
      >
        <IconButton
          iconProps={infoIcon}
          className={styles.iconButton}
          onClick={toggleCallout}
          id={buttonId}
          ariaLabel={translateMessage('More Info')}
          disabled={!hintsAvailable}
        />
      </TooltipHost>
      {isCalloutVisible && (
        <Callout
          className={styles.callout}
          ariaLabelledBy={labelId}
          ariaDescribedBy={descriptionId}
          role='alertdialog'
          gapSpace={0}
          target={`#${buttonId}`}
          onDismiss={toggleCallout}
          setInitialFocus
        >
          <Text block variant='xLarge' className={styles.title} id={labelId}>
            /{requestUrl}
          </Text>
          <HintList hints={hints} requestUrl={requestUrl} />
        </Callout>
      )}
    </>
  );
}

export default SuffixRenderer;
