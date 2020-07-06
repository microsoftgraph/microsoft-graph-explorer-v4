import { FontSizes, ITheme } from '@uifabric/styling';

export const queryResponseStyles = (theme: ITheme) => {
    return {
        dot: {
            height: '8px',
            width: '8px',
            marginLeft: 8,
            backgroundColor: theme.palette.blue,
            borderRadius: '50%',
            display: 'inline-block'
          }
    };
};