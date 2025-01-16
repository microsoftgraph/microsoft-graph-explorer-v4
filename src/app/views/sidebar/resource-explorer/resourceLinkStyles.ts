import { makeStyles } from '@fluentui/react-components';

export const useStyles = makeStyles({
  link: {
    display: 'flex',
    lineHeight: 'normal',
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'space-between',
    marginRight: '8px',
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
    marginTop: '4px',
    paddingLeft: '4px'
  },
  resourceLinkText: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    marginTop: '6px'
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
    marginRight: '1px'
  }
});
