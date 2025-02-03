import { makeStyles } from '@fluentui/react-components';
import { tokens } from '@fluentui/react-theme';

export const useStyles = makeStyles({
  link: {
    display: 'flex',
    lineHeight: tokens.lineHeightBase300,
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: tokens.spacingHorizontalS,
    position: 'relative',
    ':hover .actions': {
      visibility: 'visible'
    }
  },
  resourceLinkNameContainer: {
    textAlign: 'left',
    flex: '1',
    overflow: 'hidden',
    display: 'flex',
    marginTop: tokens.spacingVerticalXXS,
    paddingLeft: tokens.spacingHorizontalXXS
  },
  resourceLinkText: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    marginTop: tokens.spacingVerticalXS
  },
  badge: {
    maxWidth: '50px'
  },
  actions: {
    visibility: 'hidden',
    display: 'flex',
    alignItems: 'center'
  }
});

export const useIconButtonStyles = makeStyles({
  root: {
    marginRight: tokens.spacingHorizontalXXS
  }
});
