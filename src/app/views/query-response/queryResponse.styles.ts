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
        display: 'inline-block',
        marginTop: '13%',
        marginLeft: '16%'
      }
    },
    modalStyles: {
      scrollableContent: {
        overflow: 'hidden' as 'hidden'
      },
      main: {
        width: '80%',
        height: '90%',
        overflow: 'hidden' as 'hidden'
      }
    }
  };
};
