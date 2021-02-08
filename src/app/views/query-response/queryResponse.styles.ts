import { ITheme } from '@uifabric/styling';

export const queryResponseStyles = (theme: ITheme) => {
  return {
    dot: {
      height: '8px',
      width: '8px',
      marginLeft: 8,
      backgroundColor: theme.palette.blue,
      borderRadius: '50%',
      display: 'inline-block',
    },
    emptyStateLabel: {
      display: 'flex',
      width: '100%',
      minHeight: '470px',
      justifyContent: 'center',
      alignItems: 'center',
    },
    link: {
      color: theme.palette.blue,
    },
    card: {
      minHeight: '500px',
      maxHeight: '800px',
      overflowY: 'auto',
    },
    copyIcon: {
      float: 'right',
      zIndex: 1
    }
  };
};
