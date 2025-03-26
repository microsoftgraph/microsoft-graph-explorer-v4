import { makeStyles } from '@fluentui/react-components';
import { tokens } from '@fluentui/react-theme';

export const useResourceExplorerStyles = makeStyles({
  container: {
    marginTop: '8px'
  },
  apiCollectionButton: {
    width: '100%',
    padding: '8px 12px',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: tokens.colorNeutralBackground1,
    textAlign: 'left',
    height: '40px',
    marginTop: '10px',
    '& .label': {
      marginLeft: '8px',
      fontWeight: tokens.fontWeightSemibold,
      color: tokens.colorNeutralForeground1,
      fontSize: tokens.fontSizeBase200
    }
  },
  apiCollectionCount: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground1
  },
  stackStyles: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between'
  },
  versioning: {
    display: 'flex',
    alignItems: 'center'
  },
  tree: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: '5px',
    maxHeight: 'calc(100vh - 100px)'
  },
  treeActions: {
    display: 'flex',
    alignItems: 'center'
  },
  treeItemLayout: {
    width: '100%',
    ':hover, :focus, :focus-visible, :focus-within': {
      backgroundColor: tokens.colorNeutralBackground3Hover,
      color: tokens.colorNeutralForeground2BrandHover
    },
    '> div.fui-TreeItemLayout__main': {
      width: '100%'
    }
  },
  focusVisible: {
    '& .actions': {
      display: 'none'
    },
    '&:hover .actions, &:focus-within .actions, &:focus-visible .actions, &:focus .actions': {
      display: 'flex',
      alignItems: 'center'
    }
  }
});

export const useSearchBoxStyles = makeStyles({
  root: {
    width: '100%',
    maxWidth: '100%'
  },
  field: {
    paddingLeft: '10px',
    '&:focus': {
      outline: 'none !important'
    }
  }
});

export const useSpinnerStyles = makeStyles({
  root: {
    display: 'flex',
    width: '100%',
    height: '100px',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
