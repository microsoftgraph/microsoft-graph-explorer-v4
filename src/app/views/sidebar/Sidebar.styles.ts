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
      background: 'inherit' as 'inherit'
    },
    pullLeft: {
      float: 'left'
    },

    /* Group Headers */

    groupHeader: {
      fontSize: FontSizes.medium,
      position: 'relative' as 'relative',
    },
    groupHeaderRow: {
      lineHeight: '50px',
      fontSize: FontSizes.medium,
      textAlign: 'left',
      paddingTop: '0px',
      paddingRight: '4px',
      paddingBottom: '0px',
      paddingLeft: '4px',
    },
    groupHeaderRowIcon: {
      marginTop: '2%',
      fontSize: FontSizes.small,
      fontWeight: FontWeights.light
    },
    groupTitle: {
      fontSize: FontSizes.medium,
      fontWeight: FontWeights.semibold,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      outline: '0px',
    },
    headerCount: {
      paddingTop: '0px',
      paddingRight: '4px',
      paddingBottom: '0px',
      paddingLeft: '4px',
    },

    /* Row */

    queryRow: {
      background: 'inherit' as 'inherit',
      textAlign: 'center',
      verticalAlign: 'middle',
      position: 'absolute' as 'absolute',
      lineHeight: '100%',
      width: '80%',
      fontSize: FontSizes.medium,
    },
    queryContent: {
      float: 'left',
    },
    rowDisabled: {
      cursor: 'not-allowed',
    },
    badge: {
      float: 'left',
      fontWeight: FontWeights.bold,
      fontSize: FontSizes.small,
    },
    docLink: {
      marginTop: '-8%',
    },


    /* Column */
    columnHeader: {
      background: 'green'
    }
  };
};
