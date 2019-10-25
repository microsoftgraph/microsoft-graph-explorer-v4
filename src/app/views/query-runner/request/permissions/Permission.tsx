import { DetailsList } from 'office-ui-fabric-react';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Monaco } from '../../../common';
import { fetchScopes } from './util';

export interface IPermission {
value: string;
consentDisplayName: string;
consentDescription: string;
isAdmin: boolean;
}

export function Permission() {
  const sample = useSelector((state: any) => state.sampleQuery, shallowEqual);
  const [permissions, setPermissions ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [sampleError, setError, ] = useState(false);
  const authToken = useSelector((state: any) => state.authToken);

  let errorMessage;

  useEffect(() => {
    setLoading(true);
    setPermissions([]);
    setError(false);

    fetchScopes(sample)
      .then(res => { setLoading(false); setPermissions(res); })
      // .then(res => { if (res.error) {throw(res.error); }})
      .catch((error) => {
        setError(true);
        setLoading(false);
        setPermissions([]);
        errorMessage = error;
      });
  }, [sample.sampleUrl]);


  return (
    <div style={{ padding: 10, height: 'inherit', overflowY: 'scroll' } }>
      {sampleError && <Monaco body = {errorMessage} />}
      {loading && <Monaco body = {'Fetching permissions...'}/>}
      {authToken &&
        <div style={{ marginBottom: 10 }}>
          <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 5 }}>Access Token</h2>
          <p style={{ wordWrap: 'break-word', fontFamily: 'monospace' }}>{authToken}</p>
        </div>
      }
      {permissions &&
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 'bold' }}>Permissions</h2>
        <ul>
          {permissions.map((permission: IPermission) => {
              return <li key={permission.value}>
              Name: {permission.value},
              Display Name: {permission.consentDisplayName},
              Description: {permission.consentDescription},
              AdminConsent: {permission.isAdmin}
              </li>;
            })}
        </ul>
        </div>
      }
    </div>
  );
}
