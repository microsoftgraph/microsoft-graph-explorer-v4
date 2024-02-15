import { FontSizes, FontWeights, ITheme } from '@fluentui/react';

export const sidebarStyles = (theme: ITheme) => {
  const height = '85dvh'
  return {
    searchBox: {
      marginTop: theme.spacing.s1
    },
    spinner: {
      display: 'flex',
      width: '100%',
      height,
      justifyContent: 'center',
      alignItems: 'center'
    },
    queryList: {
      marginBottom: theme.spacing.s1,
      cursor: 'pointer',
      height,
      overflow: 'hidden',
      fontSize: FontSizes.medium,
      background: 'inherit',
      selectors: {
        ':hover': {
          overflow: 'scroll'
        }
      }
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
      position: 'relative'
    },
    groupHeaderRow: {
      lineHeight: '50px',
      fontSize: FontSizes.medium,
      textAlign: 'left',
      paddingTop: '0px',
      paddingRight: '4px',
      paddingBottom: '0px',
      paddingLeft: '4px'
    },
    groupHeaderRowIcon: {
      height: '24px',
      marginTop: '2%',
      fontSize: FontSizes.xSmall,
      fontWeight: FontWeights.light
    },
    groupTitle: {
      fontSize: FontSizes.medium,
      fontWeight: FontWeights.semibold,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      outline: '0px',
      display: 'inline-block'
    },
    headerCount: {
      paddingTop: '0px',
      paddingRight: '4px',
      paddingBottom: '0px',
      paddingLeft: '4px'
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
          background: theme.palette.neutralLight
        }
      }
    },
    queryContent: {
      textAlign: 'left',
      textOverflow: 'ellipsis',
      marginLeft: theme.spacing.s1
    },
    rowDisabled: {
      cursor: 'not-allowed'
    },
    badge: {
      fontWeight: FontWeights.bold,
      fontSize: FontSizes.small,
      display: 'inline-block',
      padding: 3,
      color: '#fff',
      minWidth: '55px',
      marginRight: '-10%'
    },
    docLink: {
      float: 'right',
      fontSize: FontSizes.icon,
      textAlign: 'left',
      verticalAlign: 'center',
      cursor: 'pointer',
      color: theme.palette.themePrimary
    },
    links: {
      color: `${theme.palette.blueMid} !important`
    },
    sidebarButtons: {
      root:{
        height: 40,
        width: 40,
        ':hover': {
          background: `${theme.palette.neutralLight} !important`
        }
      }
    }
  };
};
