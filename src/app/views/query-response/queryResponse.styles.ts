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
      color: `${theme.palette.blueMid} !important`,
    },
    card: {
      height: '450px',
      overflowY: 'auto'
    },
    copyIcon: {
      float: 'right'
    },
    container: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      wdith: '100%'
    },
    column: {
      display: 'flex',
      flexDirection: 'column',
      flexBasis: '50%',
      flex: 1
    },
    columnicon: {
      display: 'flex',
      flexDirection: 'column',
      flexBasis: '50%',
      flex: 1,
      maxWidth: 'fit-content'
    },
    monacoColumn: {
      display: 'flex',
      flexDirection: 'column',
      flexBasis: '50%',
      flex: 1,
      maxWidth: '65vw',
      minWidth: '40vw'
    }
  };
};
