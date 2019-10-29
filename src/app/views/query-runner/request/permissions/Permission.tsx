import { DetailsList, DetailsListLayoutMode, FontSizes, getId, IColumn,
  Label, SelectionMode, TooltipHost } from 'office-ui-fabric-react';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
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
  const [loading, setLoading] = useState(false);
  const [sampleError, setError] = useState(false);

  const renderItemColumn = (item: any, index: number | undefined, column: IColumn | undefined) => {
    const hostId: string = getId('tooltipHost');

    if (column) {
      const content = item[column.fieldName as keyof any] as string;

      switch (column.key) {

        case 'isAdmin':
          if (item.isAdmin) {
            return 'True';
          } else {
            return  'False';
          }

        case 'consentDescription':
          return <>
            <TooltipHost
              content={item.consentDescription}
              id={hostId}
              calloutProps={{ gapSpace: 0 }}
              styles={{ root: { display: 'inline-block' } }}
            >
              <span aria-labelledby={hostId}>
                {item.consentDescription}
              </span>
            </TooltipHost>
          </>
            ;

        default:
          return content;
      }
    }
  };

  const columns = [
    { key: 'value', name: 'Name', fieldName: 'value', minWidth: 150, maxWidth: 200},
    { key: 'consentDisplayName', name: 'Function', fieldName: 'consentDisplayName', minWidth: 200, maxWidth: 300},
    { key: 'consentDescription', name: 'Description', fieldName: 'consentDescription', isResizable: true,
      minWidth: 500, maxWidth: 600},
    { key: 'isAdmin', name: 'Admin Consent', fieldName: 'isAdmin', minWidth: 100, maxWidth: 200}
  ];

  let errorMessage;

  useEffect(() => {
    setLoading(true);
    setPermissions([]);
    setError(false);

    fetchScopes(sample)
      .then(res => { setLoading(false); setPermissions(res); })
      .catch((error) => {
        setError(true);
        setLoading(false);
        setPermissions([]);
        errorMessage = error;
      });
  }, [sample.sampleUrl]);

  return (
    <div style={{ padding: 10, maxHeight: '350px', minHeight: '300px', overflowY: 'auto' }}>
      {sampleError && <Monaco body = {errorMessage} />}
      {loading && <Monaco body = {'Fetching permissions...'}/>}
      {permissions && !loading &&
        <div style={{marginBottom: 120}}>
          <Label style={{ fontWeight: 'bold', marginBottom: 5 }}>
            <FormattedMessage id='Permission' />&nbsp;({permissions.length})
          </Label>
          <DetailsList
            items={permissions}
            columns={columns}
            onRenderItemColumn={renderItemColumn}
            selectionMode={SelectionMode.none}
            layoutMode={DetailsListLayoutMode.justified}
          />
        </div>
      }
    </div>
  );
}
