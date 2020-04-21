import { ITheme } from '@uifabric/styling';

export const queryInputStyles = (theme: ITheme) => {
  const controlWidth = '300px';
    return {
      autoComplete: {
        input: {
          minWidth: controlWidth,
        },
        noSuggestions: {
          color: theme.palette.black,
          padding: 10
        },
        suggestions: {
          maxHeight: '143px',
          overflowY: 'auto',
          paddingLeft: 0,
          position: 'absolute',
          backgroundColor: theme.palette.neutralLighter,
          minWidth: controlWidth,
          zIndex: 1,
          cursor: 'pointer',
          color: theme.palette.black,
        },
        suggestionOption: {
          display: 'block',
            ':hover': {
              background: theme.palette.neutralLight,
            },
            padding: 10,
            cursor: 'pointer',
            backgroundColor: theme.palette.neutralLighter,
          },
          suggestionActive: {
            padding: 10,
            display: 'block',
            backgroundColor: theme.palette.neutralLight,
            cursor: 'pointer',
        },
      }
    };
  };