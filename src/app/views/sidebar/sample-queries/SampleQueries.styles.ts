import { makeStyles, tokens } from '@fluentui/react-components';

const forcedColorsActiveStyles = {
  '@media (forced-colors: active)': {
    backgroundColor: 'Highlight',
    color: 'HighlightText',
    forcedColorAdjust: 'none'
  }
};export const useStyles = makeStyles({
  container: {
    marginTop: '8px'
  },
  iconBefore: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: '50px',
    paddingRight: '0'
  },
  badge: {
    maxWidth: '50px'
  },
  disabled: {
    '&:hover': {
      cursor: 'not-allowed'
    }
  },
  itemLayout: {
    paddingLeft: tokens.spacingHorizontalXXL,
    '&:hover, &:focus, &:focus-visible, &:focus-within': {
      '@media (forced-colors: active)': {
        backgroundColor: 'Highlight',
        color: 'HighlightText',
        forcedColorAdjust: 'none'
      }
    }
  },
  branchItemLayout: {
    '&:hover, &:focus, &:focus-visible, &:focus-within': {
      '@media (forced-colors: active)': {
        backgroundColor: 'Highlight',
        color: 'HighlightText',
        forcedColorAdjust: 'none'
      }
    }
  },
  focusableLink: {
    '&:focus, &:focus-visible': {
      outline: '2px solid !important',
      outlineOffset: '2px !important'
    }
  },
  messageBar: {
    whiteSpace: 'wrap'
  }
});