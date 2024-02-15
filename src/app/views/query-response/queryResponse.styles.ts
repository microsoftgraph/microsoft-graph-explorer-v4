import { ITheme } from '@fluentui/react';
import { useAppSelector } from '../../../store';
import { convertVhToPx, getResponseHeight } from '../common/dimensions/dimensions-adjustment';

export const queryResponseStyles = (theme: ITheme) => {
  const { dimensions: { response }, responseAreaExpanded} =
    useAppSelector((state) => state);

  const height = convertVhToPx(getResponseHeight( response.height, responseAreaExpanded), 220);

  return {
    dot: {
      height: '8px',
      width: '8px',
      marginLeft: 8,
      backgroundColor: theme.palette.blue,
      borderRadius: '50%',
      display: 'inline-block'
    },
    emptyStateLabel: {
      display: 'flex',
      width: '100%',
      minHeight: '470px',
      justifyContent: 'center',
      alignItems: 'center'
    },
    link: {
      color: `${theme.palette.blueMid} !important`
    },
    card: {
      height,
      overflowY: 'auto'
    },
    copyIcon: {
      float: 'right',
      zIndex: 1
    },
    queryResponseText: {
      root: {
        display: 'inline-block',
        marginLeft: '2%'
      }
    },
    modalStyles: {
      scrollableContent: {
        overflow: 'hidden' as 'hidden'
      },
      main: {
        width: '80%',
        height: '90%',
        overflow: 'hidden' as 'hidden'
      }
    },
    modalPivotStyles: {
      root: {
        overflow: 'hidden' as 'hidden'
      }
    }
  };
};
