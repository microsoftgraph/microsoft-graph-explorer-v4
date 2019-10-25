import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Monaco } from '../../../common';
import { fetchScopes } from './util';

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
          {permissions.map((permission: string) => {
            return <li key={permission}>{permission}</li>;
          })}
        </ul>
        </div>
      }
    </div>
  );
}
