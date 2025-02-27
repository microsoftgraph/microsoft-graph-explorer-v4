import { makeStyles } from '@fluentui/react-components';

export const useHeaderStyles = makeStyles({
  container: {
    padding: '10px',
    textAlign: 'start',
    maxHeight: '15vh',
    minHeight: 0
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