import { TooltipHost, getId, Spinner, Icon, ITooltipHostStyles } from '@fluentui/react';
import React from 'react'
import { useSelector } from 'react-redux'
import { IRootState } from '../../../../../types/root';
import { translateMessage } from '../../../../utils/translate-messages';

const SuffixRenderer = () => {
  const { autoComplete } = useSelector(
    (state: IRootState) => state
  );
  const fetchingSuggestions = autoComplete.pending;
  const autoCompleteError = autoComplete.error;
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

  return null;
}

export default SuffixRenderer;
