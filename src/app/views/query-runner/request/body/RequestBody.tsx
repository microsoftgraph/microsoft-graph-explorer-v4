import { FocusZone, IconButton, Spinner, SpinnerSize } from '@fluentui/react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { AppDispatch, useAppSelector } from '../../../../../store';
import { fetchAutoCompleteOptions } from '../../../../services/actions/autocomplete-action-creators';
import { parseSampleUrl } from '../../../../utils/sample-url-generation';
import { translateMessage } from '../../../../utils/translate-messages';
import { Monaco } from '../../../common';
import { convertVhToPx } from '../../../common/dimensions/dimensions-adjustment';

const RequestBody = ({ handleOnEditorChange }: any) => {
  const { dimensions: { request: { height } }, sampleQuery,
    autoComplete: { data, pending } } = useAppSelector((state) => state);
  const dispatch: AppDispatch = useDispatch();
  const [sampleBody, setSampleBody] = useState(sampleQuery.sampleBody);

  const canGenerateSamplePayload = ['POST', 'PATCH'].includes(sampleQuery.selectedVerb);
  const { requestUrl, queryVersion } = parseSampleUrl(sampleQuery.sampleUrl);

  function showMessage(): string {
    return translateMessage('Get sample payload');
  }

  const generateSamplePayload = () => {
    dispatch(fetchAutoCompleteOptions(requestUrl, queryVersion, 'parameters'));
  }

  useEffect(() => {
    if (!data) {
      return;
    }
    if (data.url !== requestUrl) {
      return;
    }
    const requestBody = data?.requestBody;
    const verb = sampleQuery.selectedVerb.toLocaleLowerCase();
    if (requestBody && requestBody[verb]) {
      setSampleBody(requestBody[verb]);
    } else {
      setSampleBody('');
    }
  }, [data]);

  const showGenerateButton = () => {
    if (pending) {
      return <Spinner size={SpinnerSize.small} />
    }
    return <IconButton iconProps={{ iconName: 'TriggerAuto' }}
      title={translateMessage(showMessage())}
      ariaLabel={translateMessage(showMessage())}
      onClick={generateSamplePayload}
    />;
  }

  return (
    <FocusZone>
      <div>
        {canGenerateSamplePayload && showGenerateButton()}
        <Monaco
          body={sampleBody}
          height={convertVhToPx(height, 60)}
          onChange={(value) => handleOnEditorChange(value)} />
      </div>
    </FocusZone>

  );
};

export default RequestBody;
