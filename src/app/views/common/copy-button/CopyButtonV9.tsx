import { Button, Tooltip } from '@fluentui/react-components';
import { CheckmarkRegular, CopyRegular } from '@fluentui/react-icons';
import { useState } from 'react';
import { translateMessage } from '../../../utils/translate-messages';

interface ICopyButtonProps {
  handleOnClick: () => void;
  isIconButton: boolean;
}

export default function CopyButton(props: ICopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const CopyIcon = !copied ? CopyRegular : CheckmarkRegular;
  const copyLabel: string = !copied
    ? translateMessage('Copy')
    : translateMessage('Copied');

  const handleCopyClick = async () => {
    props.handleOnClick();
    setCopied(true);
    handleTimeout();
  };

  const handleTimeout = () => {
    const timer = setTimeout(() => {
      setCopied(false);
    }, 3000); // 3 seconds
    return () => clearTimeout(timer);
  };

  return (
    <>
      {props.isIconButton ? (
        <Tooltip content={copyLabel} relationship='label'>
          <Button
            appearance='transparent'
            onClick={handleCopyClick}
            icon={<CopyIcon />}
          />
        </Tooltip>
      ) : (
        <Button appearance='transparent' onClick={handleCopyClick}>
          {copyLabel}
        </Button>
      )}
    </>
  );
}
