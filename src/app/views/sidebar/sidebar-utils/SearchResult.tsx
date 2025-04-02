import { Label } from '@fluentui/react';
import { translateMessage } from '../../../utils/translate-messages';

export const NoResultsFound = (searchMessage: string, additionalStyles?: { [key: string]: string }) => {
  return (
    <Label
      styles={{
        root: {
          paddingLeft: '5px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          ...additionalStyles
        }
      }}
    >
      {translateMessage(searchMessage)}
    </Label>
  );
}