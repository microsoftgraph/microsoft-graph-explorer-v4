import {
  FontSizes, FontWeights,
  ITheme,
} from '@uifabric/styling';

export const sidebarStyles = (theme: ITheme) => {
  return {
    searchBox: {
      marginTop: theme.spacing.s1,
    },
    queryList: {
      marginBottom: theme.spacing.s1,
      cursor: 'pointer',
      maxHeight: '850px',
      minHeight: '850px',
      overflowY: 'auto' as 'auto',
      overflowX: 'hidden' as 'hidden',
      fontSize: FontSizes.medium,
    },
    rowDisabled: {
      cursor: 'not-allowed',
    },
    queryRow: {
      textAlign: 'center',
      position: 'relative' as 'relative',
      lineHeight: '10px',
      fontSize: FontSizes.medium,
    },
    queryContent: {
      float: 'left',
    },
    badge: {
      display: 'inline-block' as 'inline-block',
      float: 'left',
      fontWeight: FontWeights.bold,
      fontSize: FontSizes.small,
    },
    docLink: {
      display: 'inline-block' as 'inline-block',
      marginTop: '-12%'
    },
    pullRight: {
      float: 'right'
    },
    pullLeft: {
      float: 'left'
    }
  };
};
