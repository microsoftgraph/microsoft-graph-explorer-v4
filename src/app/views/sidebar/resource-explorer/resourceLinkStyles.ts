import { makeStyles } from '@fluentui/react-components';
import { tokens } from '@fluentui/react-theme';

export const useStyles = makeStyles({
  link: {
    display: 'flex',
    lineHeight: tokens.lineHeightBase300,
    overflow: 'hidden',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: tokens.spacingHorizontalS,
    position: 'relative',
    ':hover .actions, :focus-within .actions': {
      display: 'flex',
      alignItems: 'center'
    }
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
  actions: {
    display: 'none',
    '& a:focus, a:focus-within, & button:focus': {
      outline: `2px solid ${tokens.colorBrandStroke1}`,
      outlineOffset: '2px',
      display: 'flex',
      alignItems: 'center'
    }
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
