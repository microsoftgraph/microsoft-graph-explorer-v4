import {
  FontSizes, FontWeights,
  ITheme,
} from '@uifabric/styling';

export const sidebarStyles = (theme: ITheme) => {
  const pageHeight = '660px';
  return {
    searchBox: {
      marginTop: theme.spacing.s1,
    },
    spinner: {
      display: 'flex',
      width: '100%',
      minHeight: pageHeight,
      justifyContent: 'center',
      alignItems: 'center'
    },
    queryList: {
      marginBottom: theme.spacing.s1,
      cursor: 'pointer',
      maxHeight: pageHeight,
      minHeight: pageHeight,
      overflowY: 'auto',
      overflowX: 'auto',
      fontSize: FontSizes.medium,
      background: 'inherit'
    },
    pullLeft: {
      float: 'left'
    },
    pullRight: {
      float: 'right'
    },

    /* Group Headers */

    groupHeader: {
      fontSize: FontSizes.medium,
      position: 'relative',
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
      background: 'inherit',
      lineHeight: '100%',
      fontSize: FontSizes.medium,
      borderBottom: '1px solid ' + theme.palette.neutralLight,
      color: theme.palette.black,
      selectors: {
        ':hover': {
          background: theme.palette.neutralLight,
        },
      },
    },
    queryContent: {
      textAlign: 'left',
      textOverflow: 'ellipsis',
      marginLeft: theme.spacing.s1,
    },
    rowDisabled: {
      cursor: 'not-allowed',
    },
    badge: {
      fontWeight: FontWeights.bold,
      fontSize: FontSizes.small,
      display: 'inline-block',
      paddingLeft: 3,
      paddingRight: 3,
      paddingTop: 3,
      paddingBottom: 3,
      color: '#fff',
      minWidth: '55px',
      marginRight: '-10%'
    },
    docLink: {
      float: 'right',
      fontSize: FontSizes.icon,
      textAlign: 'left',
      verticalAlign: 'center',
    },
    links: {
      color: `${theme.palette.blueMid} !important`,
    },
  };
};
