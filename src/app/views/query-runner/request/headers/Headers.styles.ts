import { FontSizes } from '@uifabric/styling';

export const headerStyles = () => {
  return {
    container: {
      width: '100%',
      textAlign: 'center',
      padding: 10,
      maxHeight: '350px',
      minHeight: '300px',
      overflowY: 'auto',
      overflowX: 'auto'
    },
    itemContent: {
      marginTop: '2.5%',
    },
    rowContainer: {
      fontSize: FontSizes.medium,
      position: 'relative',
    },
    detailsRow: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    headersList: { marginBottom: '120px' }
  };
};
