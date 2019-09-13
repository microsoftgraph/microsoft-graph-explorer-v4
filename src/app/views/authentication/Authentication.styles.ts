import { ITheme } from '@uifabric/styling';

export const authenticationStyles = (theme: ITheme) => {
  return {
    authenticationContainer: {
      justifyContent: 'space-between',
    },
    signInButton: {
      textTransform: 'capitalize',
    },
    profile: {
      marginBottom: theme.spacing.s1,
      width: '100%',
    },
  };
};
