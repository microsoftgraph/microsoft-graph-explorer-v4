import { Button, Tooltip, makeStyles } from '@fluentui/react-components';
import { CheckmarkRegular, CopyRegular } from '@fluentui/react-icons';
import { useRef, useState } from 'react';
import { translateMessage } from '../../../utils/translate-messages';

interface ICopyButtonProps {
  style?: React.CSSProperties;
  handleOnClick: (props: ICopyButtonProps) => void;
  className?: string;
  isIconButton: boolean;
}

const useStyles = makeStyles({
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default function CopyButton(props: ICopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const copyRef = useRef<HTMLButtonElement>(null);
  const styles = useStyles();

  const copyLabel: string = !copied
    ? translateMessage('Copy')
    : translateMessage('Copied');

  const handleCopyClick = async () => {
    props.handleOnClick(props);
    setCopied(true);
    handleTimeout();
    copyRef.current?.focus(); // Set focus back to the button
  };

  const handleTimeout = () => {
    const timer = setTimeout(() => setCopied(false), 3000); // Reset copied state after 3 seconds
    return () => clearTimeout(timer);
  };

  return (
    <>
      {props.isIconButton ? (
        <Tooltip withArrow content={copyLabel} relationship='label'>
          <Button
            appearance='subtle'
            icon={copied ? <CheckmarkRegular /> : <CopyRegular />}
            aria-label={copyLabel}
            onClick={handleCopyClick}
            style={props.style}
            className={`${props.className} ${styles.button}`}
            ref={copyRef}
          />
        </Tooltip>
      ) : (
        <Button appearance='primary' onClick={handleCopyClick} ref={copyRef}>
          {copyLabel}
        </Button>
      )}
    </>
  );
}
