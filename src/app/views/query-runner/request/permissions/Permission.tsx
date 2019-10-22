import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { fetchScopes } from './util';

export function Permission() {
  const sample = useSelector((state: any) => state.sampleQuery, shallowEqual);
  const [permissions, setPermissions ] = useState([]);
  const [ loading, setLoading ] = useState(false);

  useEffect(() => {
    setLoading(true);

    fetchScopes(sample)
      .then(res => { setLoading(false); setPermissions(res); });
  }, [sample.sampleUrl]);


  return (
    <div>
      {loading && <h1>Fetching permissions...</h1>}
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
