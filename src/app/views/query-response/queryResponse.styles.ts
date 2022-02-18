import { ITheme } from '@fluentui/react';

export const queryResponseStyles = (theme: ITheme) => {
  return {
    dot: {
      height: '8px',
      width: '8px',
      marginLeft: 8,
      backgroundColor: theme.palette.blue,
      borderRadius: '50%',
      display: 'inline-block'
    },
    emptyStateLabel: {
      display: 'flex',
      width: '100%',
      minHeight: '470px',
      justifyContent: 'center',
      alignItems: 'center'
    },
    link: {
      color: `${theme.palette.blueMid} !important`
    },
    card: {
      height: '450px',
      overflowY: 'auto'
    },
    copyIcon: {
      float: 'right',
      zIndex: 1
    },
    toolkitText: {
      root: {
        padding: '20px',
        width: '100%',
        margin: 'auto',
        display: 'inline-block',
        position: 'relative',
        top: '160px',
        lineHeight: '1.5',
        textAlign: 'justify'
      }
    }
  };
};
