import { makeStyles } from '@fluentui/react-components';

export const useResourceExplorerStyles = makeStyles({
  apiCollectionButton: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'var(--color-neutral-white)',
    textAlign: 'left',
    height: '40px',
    marginTop: '10px',
    '& .label': {
      marginLeft: '8px',
      fontWeight: 'bold',
      color: 'var(--color-neutral-primary)',
      fontSize: '14px'
    }
  },
  apiCollectionCount: {
    fontSize: '14px',
    color: 'var(--color-black)'
  }
});

export const useNavStyles = makeStyles({
  chevronIcon: {
    transform: 'rotate(0deg)',
    position: 'relative',
    '&.collapsed': {
      transform: 'rotate(-90deg)'
    }
  },
  chevronButton: {
    '&::after': {
      border: 'none !important',
      borderLeft: '0px !important'
    }
  },
  link: {
    '&::after': {
      border: 'none !important',
      borderLeft: '0px !important'
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
