import {
  Callout, FontWeights, getId, Icon, ITooltipHostStyles, Link,
  mergeStyleSets, Separator, Spinner, Text, TooltipHost
} from '@fluentui/react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { IQuery, ISampleQuery } from '../../../../../types/query-runner';
import { IRootState } from '../../../../../types/root';
import { parseSampleUrl } from '../../../../utils/sample-url-generation';
import { translateMessage } from '../../../../utils/translate-messages';

interface IHint {
  link: {
    url: string;
    name: string;
  };
  title: string;
  description: string;
}

const SuffixRenderer = () => {
  const { autoComplete, sampleQuery, samples } = useSelector(
    (state: IRootState) => state
  );
  const fetchingSuggestions = autoComplete.pending;
  const autoCompleteError = autoComplete.error;
  const { requestUrl, queryVersion } = parseSampleUrl(sampleQuery.sampleUrl);

  const getHints = () => {
    const availableHints: any[] = [];
    const documentationLink = getDocumentationLink(samples, sampleQuery, queryVersion, requestUrl);
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
              {translateMessage('Discover')}: <em>/{requestUrl}</em>
            </Text>
            <HintList hints={hints} />
          </Callout>
        )}
      </>);
  }
  return null;
}

const styles = mergeStyleSets({
  iconButton: {
    cursor: 'pointer'
  },
  callout: {
    width: 320,
    padding: '20px 24px',
  },
  title: {
    marginBottom: 12,
    fontWeight: FontWeights.semilight,
  },
  link: {
    display: 'block',
    marginTop: 20,
  },
});

export default SuffixRenderer;

const HintList = ({ hints }: any) => {
  const listItems = hints.map((hint: IHint, index: any) =>
    <div key={index}>
      {hint.description && <Text block variant="small" id={'description' + index}>
        {hint.description}
      </Text>}
      {hint.link && <Link href={hint.link.url} target="_blank" className={styles.link}>
        {hint.link.name}
      </Link>}
      <Separator />
    </div>
  );
  return listItems;
}

const getDocumentationLink = (samples: any, sampleQuery: IQuery, queryVersion: string, requestUrl: string) => {
  const { queries } = samples;
  const sampleUrl = `/${queryVersion}/${requestUrl}`;
  if (queries) {
    const querySamples = queries
      .filter((sample: ISampleQuery) =>
        sample.method === sampleQuery.selectedVerb &&
        sample.requestUrl === sampleUrl
      );
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

