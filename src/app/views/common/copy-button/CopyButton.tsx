import { IButton, IconButton, IIconProps, PrimaryButton } from '@fluentui/react';
import { createRef, useState } from 'react';
import { translateMessage } from '../../../utils/translate-messages';

interface ICopyButtonProps {
  style?: any;
  handleOnClick: Function;
  className?: any;
  isIconButton: boolean;
}

export default function CopyButton(props:ICopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyIcon: IIconProps = {
    iconName: !copied ? 'Copy' : 'CheckMark'
  };

  const copyLabel: string = !copied ? translateMessage('Copy') : translateMessage('Copied');

  const copyRef = createRef<IButton>();
  const onSetFocus = () => copyRef.current!.focus();

  const handleCopyClick = async () => {
    props.handleOnClick(props);
    setCopied(true);
    handleTimeout();
    onSetFocus();
  };

  const handleTimeout = () => {
    const timer = setTimeout(() => { setCopied(false) }, 3000); // 3 seconds
    return () => clearTimeout(timer);
  }

  return (
    <>
      {props.isIconButton ?
        <IconButton
          toggle
          onClick={handleCopyClick}
          iconProps={copyIcon}
          title={copyLabel}
          ariaLabel={copyLabel}
          style={props.style}
          className={props.className}
          componentRef={copyRef}
        />
        :
        <PrimaryButton onClick={handleCopyClick} text={copyLabel} componentRef={copyRef}/>
      }
    </>
  )
}