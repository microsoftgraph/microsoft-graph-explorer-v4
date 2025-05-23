import { makeStyles } from '@fluentui/react-components';
import polygons from './bgPolygons.svg';

export const useNotificationStyles = makeStyles({
  container: {
    padding: '8px',
    marginBottom: '8px',
    backgroundImage: `url(${polygons})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'right',
    whiteSpace: 'wrap',
    '&light': {
      backgroundColor: '#E8EFFF',
      color: '#000000'
    },
    '&.dark': {
      backgroundColor: '#1D202A',
      color: '#ffffff'
    }
  },
  body: {
    width: '100%',
    '@media (min-width: 720px)': {
      width: '100%'
    }
  }
});
