import { makeStyles, tokens } from '@fluentui/react-components';

export const useSuggestionStyles = makeStyles({
  suggestions: {
    maxHeight: '25vh',
    overflow: 'auto',
    position: 'absolute',
    minWidth: '40%',
    maxWidth: '50%',
    zIndex: 1,
    cursor: 'pointer',
    color: tokens.colorNeutralForeground1,
    '@media (max-width: 480px)': {
      minWidth: '100%',
      maxWidth: '100%'
    }
  },
  suggestionOption: {
    backgroundColor: tokens.colorNeutralBackground1,
    position: 'relative',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    overflow: 'hidden',
    '&:hover': {
      background: tokens.colorNeutralBackground1Hover
    }
  },
  suggestionActive: {
    cursor: 'pointer',
    position: 'relative',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    border: '1px solid',
    overflow: 'hidden',
    wordWrap: 'normal',
    backgroundColor: tokens.colorNeutralBackground1Selected
  }
});