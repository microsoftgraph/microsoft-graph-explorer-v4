import { ITheme } from '@uifabric/styling';

export const authenticationStyles = (theme: ITheme) => {
  return {
    authenticationContainer: {
      justifyContent: 'space-between' as 'space-between',
      display: 'flex' as 'flex'
    },
    signInButton: {
      marginBottom: theme.spacing.s1,
    },
    profile: {
      marginBottom: theme.spacing.s1,
      justifyContent: 'space-between' as 'space-between',
      position: 'relative' as 'relative',
      height: 48
    },
  };
};
