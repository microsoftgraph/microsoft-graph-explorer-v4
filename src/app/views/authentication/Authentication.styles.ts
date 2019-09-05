import { ITheme } from '@uifabric/styling';

export const authenticationStyles = (theme: ITheme) => {
  return {
    authenticationContainer: {
      justifyContent: 'space-between',
      display: 'flex'
    },
    signInButton: {
      marginBottom: theme.spacing.s1,
    },
    profile: {
      marginBottom: theme.spacing.s1,
      justifyContent: 'space-between',
      position: 'relative',
      height: 48
    },
  };
};
