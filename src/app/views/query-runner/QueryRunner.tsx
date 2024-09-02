import { IDropdownOption, MessageBarType } from '@fluentui/react';
import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../store';
import { componentNames, eventTypes, telemetry } from '../../../telemetry';
import { ContentType } from '../../../types/enums';
import { IQuery } from '../../../types/query-runner';
import { runQuery } from '../../services/slices/graph-response.slice';
import { setQueryResponseStatus } from '../../services/slices/query-status.slice';
import { setSampleQuery } from '../../services/slices/sample-query.slice';
import { sanitizeQueryUrl } from '../../utils/query-url-sanitization';
import { parseSampleUrl } from '../../utils/sample-url-generation';
import { translateMessage } from '../../utils/translate-messages';
import { QueryInput } from './query-input';
import './query-runner.scss';
import Request from './request/Request';

const QueryRunner = (props: any) => {
  const dispatch = useAppDispatch();
  const { sampleQuery } = useAppSelector((state) => state);

  const [sampleBody, setSampleBody] = useState('');

  useEffect(() => {
    if (sampleQuery.selectedVerb !== 'GET') {
      const query = { ...sampleQuery };
      query.sampleBody = sampleBody;
      dispatch(setSampleQuery(query));
    }
  }, [sampleBody])

  const handleOnMethodChange = (method?: IDropdownOption) => {
    const query = { ...sampleQuery };
    if (method !== undefined) {
      query.selectedVerb = method.text;
      dispatch(setSampleQuery(query));

      // Sets selected verb in App Component
      props.onSelectVerb(method.text);
    }
  };

  const handleOnEditorChange = (value?: string) => {
    setSampleBody(value!);
  };

  const handleOnRunQuery = (query?: IQuery) => {
    let sample = { ...sampleQuery };
    if (sampleBody && sample.selectedVerb !== 'GET') {
      const headers = sample.sampleHeaders;
      const contentType = headers.find((k: { name: string; }) => k.name.toLowerCase() === 'content-type');
      if (!contentType || (contentType.value === ContentType.Json)) {
        try {
          sample.sampleBody = JSON.parse(sampleBody);
        } catch (error) {
          dispatch(setQueryResponseStatus({
            ok: false,
            statusText: translateMessage('Malformed JSON body'),
            status: `${translateMessage('Review the request body')} ${error}`,
            messageType: MessageBarType.error
          }));
          return;
        }
      } else {
        sample.sampleBody = sampleBody;
      }
    }

    if (query) {
      sample = {
        ...sample,
        sampleUrl: query.sampleUrl,
        selectedVersion: query.selectedVersion,
        selectedVerb: query.selectedVerb
      }
    }

    dispatch(runQuery(sample));
    const sanitizedUrl = sanitizeQueryUrl(sample.sampleUrl);
    const deviceCharacteristics = telemetry.getDeviceCharacteristicsData();
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT,
      {
        ComponentName: componentNames.RUN_QUERY_BUTTON,
        SelectedVersion: sample.selectedVersion,
        QuerySignature: `${sample.selectedVerb} ${sanitizedUrl}`,
        ...deviceCharacteristics
      });
  };

  const handleOnVersionChange = (urlVersion?: IDropdownOption) => {
    if (urlVersion) {
      const { queryVersion: oldQueryVersion } = parseSampleUrl(
        sampleQuery.sampleUrl
      );
      const { sampleUrl, queryVersion: newQueryVersion } = parseSampleUrl(
        sampleQuery.sampleUrl,
        urlVersion.text
      );
      dispatch(setSampleQuery({
        ...sampleQuery,
        sampleUrl,
        selectedVersion: newQueryVersion
      }));
      if (oldQueryVersion !== newQueryVersion) {
        telemetry.trackEvent(eventTypes.DROPDOWN_CHANGE_EVENT, {
          ComponentName: componentNames.VERSION_CHANGE_DROPDOWN,
          NewVersion: newQueryVersion,
          OldVersion: oldQueryVersion
        });
      }
    }
  };

  return (
    <>
      <div className='ms-Grid-row'>
        <div className='ms-Grid-col ms-sm-12 ms-lg-12'>
          <QueryInput
            handleOnRunQuery={handleOnRunQuery}
            handleOnMethodChange={handleOnMethodChange}
            handleOnVersionChange={handleOnVersionChange}
          />
        </div>
      </div>
      <div className='ms-Grid-row' style={{ marginTop: 10 }}>
        <div className='ms-Grid-col ms-sm-12 ms-lg-12'>
          {
            <Request
              handleOnEditorChange={handleOnEditorChange}
              sampleQuery={sampleQuery}
            />
          }
        </div>
      </div>
    </>
  );
}

export default QueryRunner;
