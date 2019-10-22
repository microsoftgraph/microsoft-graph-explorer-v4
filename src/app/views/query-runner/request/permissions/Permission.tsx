import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Monaco } from '../../../common';
import { fetchScopes } from './util';

export function Permission() {
  const sample = useSelector((state: any) => state.sampleQuery, shallowEqual);
  const [permissions, setPermissions ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [sampleError, setError, ] = useState(false);
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
    <div>
      {sampleError && <Monaco body = {errorMessage} />}
      {loading && <Monaco body = {'Fetching permissions...'}/>}
      {permissions &&
        <ul>
          {permissions.map((permission: string) => {
            return <li key={permission}>{permission}</li>;
          })}
        </ul>
      }
    </div>
  );
}
