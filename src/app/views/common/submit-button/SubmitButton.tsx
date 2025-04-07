import { PlayRegular } from '@fluentui/react-icons';
import { ISubmitButton } from '../../../../types/submit-button';
import { Button, Spinner } from '@fluentui/react-components';
import { makeStyles, tokens, mergeClasses } from '@fluentui/react-components';

const useStyles = makeStyles({
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS
  },
  spinner: {
    width: '16px',
    height: '16px',
    visibility: 'hidden'
  },
  spinnerVisible: {
    visibility: 'visible'
  },
  button: {
    width: '100%'
  }
});

const SubmitButton = ({
  handleOnClick,
  submitting,
  text,
  ariaLabel,
  disabled
}: ISubmitButton) => {
  const classes = useStyles();

  return (
    <div className={classes.button}>
      <Button
        disabled={submitting || disabled}
        appearance='primary'
        onClick={() => handleOnClick()}
        aria-label={ariaLabel}
        icon={<PlayRegular />}
      >
        <span className={classes.buttonContent}>
          {text}
          <Spinner
            size='small'
            className={mergeClasses(classes.spinner, submitting && classes.spinnerVisible)}
          />
        </span>
      </Button>
    </div>
  );
};

export default SubmitButton;
