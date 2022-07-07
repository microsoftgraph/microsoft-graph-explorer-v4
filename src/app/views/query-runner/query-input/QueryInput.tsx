import { Dropdown, IDropdownOption } from '@fluentui/react';
import React from 'react';
import { injectIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { httpMethods, IQueryInputProps } from '../../../../types/query-runner';

import { IRootState } from '../../../../types/root';
import { setSampleQuery } from '../../../services/actions/query-input-action-creators';
import { GRAPH_API_VERSIONS } from '../../../services/graph-constants';
import { getStyleFor } from '../../../utils/http-methods.utils';
import { parseSampleUrl } from '../../../utils/sample-url-generation';
import { translateMessage } from '../../../utils/translate-messages';
import SubmitButton from '../../../views/common/submit-button/SubmitButton';
import { queryRunnerStyles } from '../QueryRunner.styles';
import { AutoComplete } from './auto-complete';
import { ShareQuery } from './share-query';


const QueryInput = (props: IQueryInputProps) => {
  const {
    handleOnRunQuery,
    handleOnMethodChange,
    handleOnVersionChange
  } = props;

  const dispatch = useDispatch();

  const urlVersions: IDropdownOption[] = [];
  GRAPH_API_VERSIONS.forEach(version => {
    urlVersions.push({
      key: version,
      text: version
    })
  });

  const { sampleQuery, authToken,
    isLoadingData: submitting } = useSelector((state: IRootState) => state);
  const authenticated = !!authToken.token;

  const showError = !authenticated && sampleQuery.selectedVerb !== 'GET';
  const verbSelector: any = queryRunnerStyles().verbSelector;
  verbSelector.title = {
    ...verbSelector.title,
    background: getStyleFor(sampleQuery.selectedVerb)
  };

  const contentChanged = (value: string) => {
    const updatedQuery = getChangedQueryContent(value);
    dispatch(setSampleQuery(updatedQuery));
  };

  const getChangedQueryContent = (newUrl: string) => {

    const query = { ...sampleQuery };
    const { queryVersion: newQueryVersion } = parseSampleUrl(newUrl);

    if (GRAPH_API_VERSIONS.includes(newQueryVersion)) {
      query.selectedVersion = newQueryVersion;
      query.sampleUrl = newUrl;
    }

    return query;
  }

  const runQuery = () => {
    if (!sampleQuery.sampleUrl) {
      return;
    }
    // allows the state to be populated with the new url before running it
    setTimeout(() => {
      handleOnRunQuery();
    }, 500);
  };

  return (
    <>
      <div className='row' >
        <div className='col-xs-12 col-lg-2'>
          <Dropdown
            ariaLabel={translateMessage('HTTP request method option')}
            selectedKey={sampleQuery.selectedVerb}
            options={httpMethods}
            styles={verbSelector}
            errorMessage={showError ? translateMessage('Sign in to use this method') : undefined}
            onChange={(event, method) => handleOnMethodChange(method)}
          />
        </div>
        <div className='col-xs-12 col-lg-2'>
          <Dropdown
            ariaLabel={translateMessage('Microsoft Graph API Version option')}
            selectedKey={sampleQuery.selectedVersion || GRAPH_API_VERSIONS[0]}
            options={urlVersions}
            onChange={(event, method) => handleOnVersionChange(method)}
          />
        </div>
        <div className='col-xs-12 col-lg-5'>
          <AutoComplete
            contentChanged={contentChanged}
            runQuery={runQuery}
          />
        </div>
        <div className='col-lg-2 col-sm-10 col-xs-10'>
          <SubmitButton
            className='run-query-button'
            text={translateMessage('Run Query')}
            disabled={showError || !sampleQuery.sampleUrl}
            role='button'
            handleOnClick={() => runQuery()}
            submitting={submitting}
            allowDisabledFocus={true}
          />
        </div>
        <div className='col-lg-1 col-sm-2 col-xs-2'>
          <ShareQuery />
        </div>
      </div>
    </>
  )
}

// @ts-ignore
const IntlQueryInput = injectIntl(QueryInput);
// @ts-ignore
export default IntlQueryInput;
