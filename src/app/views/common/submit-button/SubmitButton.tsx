import { PlayRegular } from '@fluentui/react-icons';
import { ISubmitButtonControl } from '../../../../types/submit-button';
import { Button, Spinner } from '@fluentui/react-components';
import { makeStyles, tokens } from '@fluentui/react-components';

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
  }
});

const SubmitButtonControl = ({
  handleOnClick,
  submitting,
  className,
  text,
  ariaLabel,
  disabled
}: ISubmitButtonControl) => {
  const classes = useStyles();

  return (
    <div className={className}>
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
            size="small"
            className={`${classes.spinner} ${submitting ? classes.spinnerVisible : ''}`}
          />
        </span>
      </Button>
    </div>
  );
};

export default SubmitButtonControl;
