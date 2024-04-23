import { FocusZone, IconButton } from '@fluentui/react';
import { useDispatch } from 'react-redux';

import { AppDispatch, useAppSelector } from '../../../../../store';
import { fetchAutoCompleteOptions } from '../../../../services/actions/autocomplete-action-creators';
import { parseSampleUrl } from '../../../../utils/sample-url-generation';
import { translateMessage } from '../../../../utils/translate-messages';
import { Monaco } from '../../../common';
import { convertVhToPx } from '../../../common/dimensions/dimensions-adjustment';

const RequestBody = ({ handleOnEditorChange }: any) => {
  const { dimensions: { request: { height } }, sampleQuery } = useAppSelector((state) => state);
  const dispatch: AppDispatch = useDispatch();
  const canGenerateSamplePayload = ['POST', 'PATCH'].includes(sampleQuery.selectedVerb);

  function showMessage(): string {
    return 'Get sample payload';
  }

  const generateSamplePayload = () => {
    const { requestUrl, queryVersion } = parseSampleUrl(sampleQuery.sampleUrl);
    dispatch(fetchAutoCompleteOptions(requestUrl, queryVersion, 'parameters'));
  }

  return (
    <FocusZone>
      <div>
        {canGenerateSamplePayload &&
          <IconButton iconProps={{ iconName: 'TriggerAuto' }}
            title={translateMessage(showMessage())}
            ariaLabel={translateMessage(showMessage())}
            onClick={generateSamplePayload}
          />
        }
        <Monaco
          body={sampleQuery.sampleBody}
          height={convertVhToPx(height, 60)}
          onChange={(value) => handleOnEditorChange(value)} />
      </div>
    </FocusZone>

  );
};

export default RequestBody;
