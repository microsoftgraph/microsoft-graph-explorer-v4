// import { FontSizes, FontWeights, ITheme } from '@fluentui/react';

import { makeStyles, tokens } from '@fluentui/react-components';

const height = '85dvh'
export const sidebarStyles = makeStyles({
  searchBox: {
    marginTop: tokens.spacingVerticalS
  },
  spinner: {
    display: 'flex',
    width: '100%',
    height,
    justifyContent: 'center',
    alignItems: 'center'
  },
  queryList: {
    marginBottom: tokens.spacingVerticalS,
    cursor: 'pointer',
    height,
    overflow: 'hidden',
    fontSize: tokens.fontSizeBase300,
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
    fontSize: tokens.fontSizeBase300,
    position: 'relative',
    color: tokens.colorNeutralForeground1
  },
  groupHeaderRow: {
    lineHeight: '50px',
    fontSize: tokens.fontSizeBase300,
    textAlign: 'left',
    paddingTop: '0px',
    paddingRight: '4px',
    paddingBottom: '0px',
    paddingLeft: '4px'
  },
  groupHeaderRowIcon: {
    height: '24px',
    marginTop: '2%',
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightMedium
  },
  groupTitle: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
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
    fontSize: tokens.fontSizeBase300,
    borderBottom: '1px solid ' + tokens.colorNeutralForeground2,
    color: tokens.colorNeutralForeground1,
    selectors: {
      ':hover': {
        background: tokens.colorNeutralBackground1
      }
    }
  },
  queryContent: {
    textAlign: 'left',
    textOverflow: 'ellipsis',
    marginLeft: tokens.spacingVerticalS
  },
  rowDisabled: {
    cursor: 'not-allowed'
  },
  badge: {
    fontWeight: tokens.fontWeightBold,
    fontSize: tokens.fontSizeBase100,
    display: 'inline-block',
    padding: '3',
    color: '#fff',
    minWidth: '55px',
    marginRight: '-10%'
  },
  docLink: {
    float: 'right',
    fontSize: tokens.fontSizeBase100,
    textAlign: 'left',
    verticalAlign: 'center',
    cursor: 'pointer',
    color: tokens.colorNeutralForeground1
  },
  links: {
    color: `${tokens.colorNeutralForeground2Link} !important`
  },
  sidebarButtons: {
    root:{
      height: '40',
      width: '40',
      ':hover': {
        background: `${tokens.colorNeutralBackground2} !important`
      }
    }
  }
});
