import { makeStyles } from '@fluentui/react-components';
import { tokens } from '@fluentui/react-theme';

export const useStyles = makeStyles({
  link: {
    display: 'flex',
    lineHeight: tokens.lineHeightBase300,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: tokens.spacingHorizontalS,
    position: 'relative'
  },
  resourceLinkNameContainer: {
    textAlign: 'left',
    flex: '1',
    overflow: 'hidden',
    display: 'flex',
    paddingLeft: tokens.spacingHorizontalXXS
  },
  resourceLinkText: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },
  badge: {
    maxWidth: '50px'
  },
  linkIcon: {
    display: 'flex',
    '&:hover': {
      color: tokens.colorBrandForegroundLinkHover
    }
  }
});

export const useIconButtonStyles = makeStyles({
  root: {
    marginRight: tokens.spacingHorizontalXXS
  }
});
