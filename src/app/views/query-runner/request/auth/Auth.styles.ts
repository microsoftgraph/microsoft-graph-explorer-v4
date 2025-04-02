import { FontSizes } from '@fluentui/react';

export const authStyles = () => {
  return {
    auth: {
      padding: 5,
      overflowY: 'auto'
    },
    accessTokenContainer: {
      width: 160,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 10
    },
    accessToken: {
      wordWrap: 'break-word',
      fontFamily: 'monospace',
      fontSize: FontSizes.xSmall,
      width: '100%',
      height: '100%',
      border: 'none',
      resize: 'none'
    },
    accessTokenLabel: {
      fontWeight: 'bold',
      marginBottom: 5
    },
    emptyStateLabel: {
      display: 'flex',
      width: '100%',
      minHeight: '100%',
      justifyContent: 'center',
      alignItems: 'center'

    }
  };
};
