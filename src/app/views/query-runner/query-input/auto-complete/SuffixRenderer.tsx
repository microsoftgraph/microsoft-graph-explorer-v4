import {
  Callout, FontWeights, getId, Icon, IconButton, IIconProps, ITooltipHostStyles, Link,
  mergeStyleSets, Spinner, Text, TooltipHost
} from '@fluentui/react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { IRootState } from '../../../../../types/root';
import { translateMessage } from '../../../../utils/translate-messages';

const SuffixRenderer = () => {
  const { autoComplete } = useSelector(
    (state: IRootState) => state
  );
  const fetchingSuggestions = autoComplete.pending;
  const autoCompleteError = autoComplete.error;
  const hintsAvailable = false;

  const [isCalloutVisible, toggleIsCalloutVisible] = useState(false);
  const buttonId = getId('callout-button');
  const labelId = getId('callout-label');
  const descriptionId = getId('callout-description');

  const toggle = () => {
    let visible = isCalloutVisible;
    visible = !visible;
    toggleIsCalloutVisible(visible);
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

  const infoIcon: IIconProps = { iconName: 'Info' };

  if (hintsAvailable) {
    return (
      <>
        <IconButton iconProps={infoIcon} onClick={toggle}
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
            onDismiss={toggle}
            setInitialFocus
          >
            <Text block variant="xLarge" className={styles.title} id={labelId}>
              Callout title here
            </Text>
            <Text block variant="small" id={descriptionId}>
              Message body is optional. If help documentation is available, consider adding a link to learn more at the
              bottom.
            </Text>
            <Link href="http://microsoft.com" target="_blank" className={styles.link}>
              Sample link
            </Link>
          </Callout>
        )}
      </>);
  }

  return null;
}

const styles = mergeStyleSets({
  button: {
    width: 130,
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
