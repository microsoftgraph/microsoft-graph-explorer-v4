import { FontSizes, ITheme } from '@uifabric/styling';

export const authStyles = (theme: ITheme) => {
  return {
    accessToken: {
      wordWrap: 'break-word',
      fontFamily: 'monospace',
      fontSize: FontSizes.xSmall,
      width: '100%',
      height: 63,
      overflowY: 'scroll',
      border: 'none',
      resize: 'none'
    },
    accessTokenLabel: {
      fontWeight: 'bold',
      marginBottom: 5
    },
    emptyStateLabel: {
      fontSize: FontSizes.large,
      fontWeight: 600,
    }
  };
};
