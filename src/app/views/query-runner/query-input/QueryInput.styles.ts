import { ITheme } from '@uifabric/styling';

export const queryInputStyles = (theme: ITheme) => {
  const controlWidth = '350px';
  return {
    autoComplete: {
      input: {
        minWidth: controlWidth,
        overflowY: 'visible'
      },
      noSuggestions: {
        color: theme.palette.black,
        padding: 10
      },
      suggestions: {
        maxHeight: '250px',
        overflowY: 'auto',
        paddingLeft: 0,
        position: 'absolute',
        backgroundColor: theme.palette.neutralLighter,
        minWidth: controlWidth,
        zIndex: 1,
        cursor: 'pointer',
        color: theme.palette.black
      },
      suggestionOption: {
        display: 'block',
        ':hover': {
          background: theme.palette.neutralLight,
        },
        padding: 10,
        cursor: 'pointer',
        backgroundColor: theme.palette.white,
        boxShadow: 'none',
        marginTop: '0px',
        marginRight: '0px',
        marginBottom: '0px',
        marginLeft: '0px',
        paddingTop: '0px',
        paddingRight: '32px',
        paddingBottom: '0px',
        paddingLeft: '12px',
        boxSizing: 'border-box',
        height: '32px',
        lineHeight: '30px',
        position: 'relative',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: theme.palette.neutralLight,
        overflow: 'hidden',
      },
      suggestionActive: {
        display: 'block',
        ':hover': {
          background: theme.palette.neutralLight,
        },
        padding: 10,
        cursor: 'pointer',
        boxShadow: 'none',
        marginTop: '0px',
        marginRight: '0px',
        marginBottom: '0px',
        marginLeft: '0px',
        paddingTop: '0px',
        paddingRight: '32px',
        paddingBottom: '0px',
        paddingLeft: '12px',
        boxSizing: 'border-box',
        height: '32px',
        lineHeight: '30px',
        position: 'relative',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        borderWidth: '1px',
        borderStyle: 'solid',
        overflow: 'hidden',
        backgroundColor: theme.palette.neutralLight
      },
      suggestionTitle: {
        display: 'flex',
        height: '100%',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
        fontWeight: 400
      }
    }
  };
};