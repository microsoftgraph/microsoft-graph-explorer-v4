import { makeStyles } from '@fluentui/react-components';

export const useIconOptionStyles = makeStyles({
  root: {
    display: 'block',
    alignItems: 'center'
  },
  radio: {
    display: 'flex',
    alignItems: 'center',
    '&:checked ~ .fui-Radio__indicator::after': {
      borderRadius: '50%'
    }
  },
  icon : {
    display: 'flex',
    justifySelf: 'center',
    marginBlockEnd: '15px'
  }
});

export const useRadioGroupStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
    padding: '20px',
    justifyContent: 'center'
  }
});