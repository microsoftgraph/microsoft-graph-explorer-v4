import { FontSizes } from '@uifabric/styling';
import { Label } from 'office-ui-fabric-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

export function Auth() {
  const authToken = useSelector((state: any) => state.authToken);

  return (<div style={{ padding: 10 }}>
    {authToken ?
      <div style={{ marginBottom: 10 }}>
        <Label style={{ fontWeight: 'bold', marginBottom: 5 }}><FormattedMessage id='Access Token' /></Label>
        <p style={{
          wordWrap: 'break-word', fontFamily: 'monospace', fontSize: FontSizes.xSmall,
          height: 50, overflowY: 'scroll'
        }}>{authToken}</p>
      </div>
      :
      <p style={{ font: 'inherit', fontWeight: 'bold' }}>Sign In to see your access token.</p>
    }
    </div>);
}
