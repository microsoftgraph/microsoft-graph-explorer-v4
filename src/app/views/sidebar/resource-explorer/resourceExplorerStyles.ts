import { makeStyles } from '@fluentui/react-components';
import { tokens } from '@fluentui/react-theme';

export const useResourceExplorerStyles = makeStyles({
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
    alignItems: 'center'
  },
  tree: {
    overflow: 'auto',
    maxWidth: '100%'
  },
  treeItemLayout: {
    width: '100%',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground3Hover
    },
    '> div.fui-TreeItemLayout__main': {
      width: '100%'
    }
  }
});

export const useSearchBoxStyles = makeStyles({
  root: {
    width: '100%'
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
