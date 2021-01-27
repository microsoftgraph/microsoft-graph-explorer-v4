import { ITheme } from '@uifabric/styling';

export const queryInputStyles = (theme: ITheme) => {
  const controlWidth = '96.5%';
  return {
    autoComplete: {
      input: {
        minWidth: controlWidth,
        overflowY: 'visible'
      },
      noSuggestions: {
        color: theme.palette.black,
        padding: 10
      },
    }
  };
};