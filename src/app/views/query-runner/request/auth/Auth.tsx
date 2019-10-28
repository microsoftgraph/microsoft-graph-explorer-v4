import { FontSizes } from '@uifabric/styling';
import { Label, PrimaryButton } from 'office-ui-fabric-react';
import React, { useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

function handleCopy() {
  const doc: any = document.getElementById('access-token');
  doc.focus();
  doc.select();

  document.execCommand('copy');
  document.execCommand('unselect');

  doc.blur();
}

export function Auth() {
  const accessToken = useSelector((state: any) => state.authToken);

  return (<div style={{ padding: 10 }}>
    {accessToken ?
      <div style={{ marginBottom: 10 }}>
        <div style={{ width: 200, display: 'flex', flexDirection: 'row',
         justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10 }}>
          <Label style={{ fontWeight: 'bold', marginBottom: 5 }}><FormattedMessage id='Access Token' /></Label>
          <PrimaryButton onClick={handleCopy}>Copy</PrimaryButton>
        </div>
        <textarea style={{
          wordWrap: 'break-word', fontFamily: 'monospace', fontSize: FontSizes.xSmall, width: '100%',
          height: 50, overflowY: 'scroll', border: 'none', resize: 'none'
        }} id='access-token' value={accessToken} readOnly={true}/>
      </div>
      :
      <p style={{ font: 'inherit', fontWeight: 'bold' }}><FormattedMessage id='Sign In to see your access token.'/></p>
    }
    </div>);
}
