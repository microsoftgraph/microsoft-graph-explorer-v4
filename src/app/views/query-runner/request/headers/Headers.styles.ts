import { makeStyles } from '@fluentui/react-components';

export const useHeaderStyles = makeStyles({
  container: {
    overflow: 'auto hidden',
    padding: '10px',
    textAlign: 'start',
    height: '100%'
  },
  itemContent: {
    marginTop: '2.5%'
  },
  rowContainer: {
    fontSize: '1rem',
    position: 'relative'
  },
  detailsRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  actionButtons: {
    display: 'flex'
  }
});