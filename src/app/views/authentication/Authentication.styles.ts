import {
  FontSizes,
  FontWeights, ITheme
} from '@uifabric/styling';
import { LocalizedFontFamilies } from '@uifabric/styling/lib/styles/fonts';

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
    userDetails: {
      marginTop: theme.spacing.s1,
      marginLeft: theme.spacing.s1,
      fontFamily: LocalizedFontFamilies.WestEuropean
    },
    userEmail: { fontSize: FontSizes.small },
    userName: { fontWeight: FontWeights.semibold },
    userImageArea: {
      position: 'absolute' as 'absolute',
      overflow: 'hidden' as 'hidden',
      maxWidth: 48,
      height: 48,
      borderRadius: '50%',
      zIndex: 0,
      width: '100%',
      left: '-14%',
      verticalAlign: 'middle' as 'middle',
      textAlign: 'center' as 'center'
    },
    userImage: {
      position: 'relative' as 'relative',
      zIndex: 10,
      width: '100%',
    }

  };
};
