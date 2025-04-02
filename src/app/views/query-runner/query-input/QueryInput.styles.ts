import { ITheme } from '@fluentui/react';

export const queryInputStyles = (theme: ITheme) => {
  const controlWidth = '90%';
  return {
    autoComplete: {
      input: {
        minWidth: controlWidth,
        overflowY: 'visible'
      },
      noSuggestions: {
        color: theme.palette.black,
        padding: 10
      }
    }
  };
};