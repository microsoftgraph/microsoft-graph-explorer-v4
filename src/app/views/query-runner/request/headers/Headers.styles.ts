import { FontSizes } from '@fluentui/react';

export const headerStyles = () => {
  return {
    container: {
      textAlign: 'center',
      padding: 10,
      overflowY: 'auto',
      overflowX: 'hidden'
    },
    itemContent: {
      marginTop: '2.5%'
    },
    rowContainer: {
      fontSize: FontSizes.medium,
      position: 'relative'
    },
    detailsRow: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    headersList: { marginBottom: '120px' }
  };
};
