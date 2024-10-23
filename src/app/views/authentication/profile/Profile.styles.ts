import { makeStyles, shorthands, tokens } from '@fluentui/react-components';

export const useProfileStyles = makeStyles({
  linkStyles: {
    root: {
      marginRight: '50px',
      height: '24px',
      color: `${tokens.colorNeutralForeground1} !important`,
      '&:hover': { textDecoration: 'none', color: `${tokens.colorBrandForeground2Hover} !important` }
    }
  },
  personaStyleToken: {
    primaryText: {
      paddingBottom: '5px'
    },
    secondaryText: {
      paddingBottom: '10px',
      textTransform: 'lowercase'
    },
    root: {
      height: '100%',
      paddingLeft: '3px'
    }
  },
  profileSpinnerStyles: {
    root: {
      position: 'relative',
      top: '2px'
    }
  },
  permissionsLabelStyles: {
    root: {
      position: 'relative',
      bottom: '25px',
      left: '92px',
      textDecoration: 'underline',
      color: `${tokens.colorBrandForeground1} !important`
    }
  },
  personaButtonStyles: {
    root: {
      ':hover': {
        background: `${tokens.colorNeutralBackground1Hover} !important`
      },
      height: '100%',
      flex: 1,
      display: 'flex',
      alignItems: 'stretch'
    }
  },
  profileContainerStyles: {
    display: 'flex',
    alignItems: 'stretch',
    flex: 1,
    height: '100%'
  },
  permissionPanelStyles: {
    footer: {
      backgroundColor: tokens.colorNeutralBackground1
    },
    commands: {
      backgroundColor: tokens.colorNeutralBackground1
    }
  },
  inactiveConsentStyles: {
    marginRight: '10px',
    backgroundColor: tokens.colorBrandBackground2
  },
  activeConsentStyles: {
    marginRight: '10px',
    backgroundColor: tokens.colorBrandBackground3Static
  }
});

export default useProfileStyles;
