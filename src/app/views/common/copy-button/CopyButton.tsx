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
      <div
        role="status"
        aria-live="assertive"
        style={{
          position: 'absolute',
          left: '-9999px',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }}
      >
        {copied && translateMessage('Copied')}
      </div>
      {props.isIconButton ? (
        <Tooltip content={copyLabel} relationship='label'>
          <Button
            appearance='transparent'
            onClick={handleCopyClick}
            icon={<CopyIcon />}
          />
        </Tooltip>
      ) : (
        <Button appearance='primary' onClick={handleCopyClick}>
          {copyLabel}
        </Button>
      )}
    </>
  );
}
