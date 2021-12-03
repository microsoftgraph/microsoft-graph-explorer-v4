import { IconButton, IIconProps } from '@fluentui/react';
import React, { useState } from 'react';
import { translateMessage } from '../../../utils/translate-messages';

interface ICopyButtonProps {
  style?: any;
  handleOnClick: Function;
  className?: any;
}

export function CopyButton(props:ICopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyIcon: IIconProps = {
    iconName: !copied ? 'Copy' : 'CheckMark'
  };

  const handleCopyClick = async () => {
    props.handleOnClick(props);
    setCopied(true);
    handleTimeout();
  };

  const handleTimeout = () => {
    const timer = setTimeout(() => { setCopied(false) }, 3000); // 3 seconds
    return () => clearTimeout(timer);
  }

  return (
    <IconButton
      toggle
      onClick={handleCopyClick}
      iconProps={copyIcon }
      title={ !copied ? translateMessage('Copy') : translateMessage('Copied')}
      ariaLabel={ !copied ? translateMessage('Copy') : translateMessage('Copied')}
      style={props.style}
      className={props.className}
    />
  )
}