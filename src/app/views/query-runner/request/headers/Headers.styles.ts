import { FontSizes, IStyle } from '@fluentui/react';

export const headerStyles = () => {
  const rowContainer: IStyle = {
    fontSize: FontSizes.medium,
    position: 'relative'
  };

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
    rowContainer,
    detailsRow: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    headersList: { marginBottom: '120px' }
  };
};
