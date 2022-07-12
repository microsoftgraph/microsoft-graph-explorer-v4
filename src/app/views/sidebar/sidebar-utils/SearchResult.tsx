import React from 'react';
import { Label } from '@fluentui/react';
import { FormattedMessage } from 'react-intl';

export const NoResultsFound = (searchMessage : string, additionalStyles? : {[key: string]: string}) => {
  return (
    <Label
      styles={{root: {
        paddingLeft: '5px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        ...additionalStyles
      }}}
    >
      <FormattedMessage id={searchMessage} />
    </Label>
  );
}