import { IStyle, ITheme } from '@fluentui/react';

export const autoCompleteStyles = (theme: ITheme) => {
  const controlWidth = '95.5%';

  const suggestions: IStyle = {
    maxHeight: '250px',
    overflow: 'auto',
    paddingLeft: 0,
    position: 'absolute',
    backgroundColor: theme.palette.neutralLighter,
    minWidth: '40%',
    maxWidth: '50%',
    zIndex: 1,
    cursor: 'pointer',
    color: theme.palette.black
  };
  const suggestionOption: IStyle = {
    display: 'block',
    selectors: {
      ':hover': {
        background: theme.palette.neutralLight
      }
    },
    cursor: 'pointer',
    backgroundColor: theme.palette.white,
    boxShadow: 'none',
    margin: '0px 0px 0px 0px',
    padding: '10px 32px 12px 10px',
    boxSizing: 'border-box',
    height: '32px',
    lineHeight: '30px',
    position: 'relative',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: theme.palette.neutralLight,
    overflow: 'hidden'
  };
  const suggestionActive: IStyle = {
    display: 'block',
    cursor: 'pointer',
    boxShadow: 'none',
    margin: '0px 0px 0px 0px',
    padding: '10px 32px 12px 10px',
    boxSizing: 'border-box',
    height: '32px',
    lineHeight: '30px',
    position: 'relative',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    borderWidth: '1px',
    borderStyle: 'solid',
    overflow: 'hidden',
    wordWrap: 'normal',
    backgroundColor: theme.palette.neutralLight
  };
  const suggestionTitle: IStyle = {
    display: 'flex',
    height: '100%',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    fontWeight: 400
  };

  return {
    input: {
      minWidth: controlWidth,
      overflowY: 'visible'
    },
    noSuggestions: {
      color: theme.palette.black,
      padding: 10
    },
    suggestions,
    suggestionOption,
    suggestionActive,
    suggestionTitle
  };
};