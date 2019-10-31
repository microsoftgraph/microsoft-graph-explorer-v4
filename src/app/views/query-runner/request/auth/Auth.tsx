import { FontSizes } from '@uifabric/styling';
import { IconButton, IIconProps, Label, PrimaryButton } from 'office-ui-fabric-react';
import React, { useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

function handleCopy() {
  const tokenTextArea: any = document.getElementById('access-token');
  tokenTextArea.focus();
  tokenTextArea.select();

  document.execCommand('copy');
  document.execCommand('unselect');

  tokenTextArea.blur();
}

export function Auth() {
  const accessToken = useSelector((state: any) => state.authToken);
  const copyIcon: IIconProps = {
    iconName: 'copy'
  };

  return (<div style={{ padding: 10 }}>
    {accessToken ?
      <div style={{ marginBottom: 10 }}>
        <div style={{ width: 120, display: 'flex', flexDirection: 'row',
         justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10 }}>
          <Label style={{ fontWeight: 'bold', marginBottom: 5 }}><FormattedMessage id='Access Token' /></Label>
          <IconButton onClick={handleCopy} iconProps={copyIcon} title='Copy' ariaLabel='Copy' />
        </div>
        <textarea style={{
          wordWrap: 'break-word', fontFamily: 'monospace', fontSize: FontSizes.xSmall, width: '100%',
          height: 63, overflowY: 'scroll', border: 'none', resize: 'none'
        }} id='access-token' value={accessToken} readOnly={true}/>
      </div>
      :
        <Label
          style={{
            fontSize: FontSizes.large,
            fontWeight: 600,
          }}
        >
          <FormattedMessage id='Sign In to see your access token.' />
        </Label>
    }
    </div>);
}
