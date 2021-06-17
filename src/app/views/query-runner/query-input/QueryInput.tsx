import { Dropdown } from 'office-ui-fabric-react';
import React from 'react';
import { injectIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { IQueryInputProps } from '../../../../types/query-runner';

import { IRootState } from '../../../../types/root';
import { setSampleQuery } from '../../../services/actions/query-input-action-creators';
import { getStyleFor } from '../../../utils/badge-color';
import { parseSampleUrl } from '../../../utils/sample-url-generation';
import { translateMessage } from '../../../utils/translate-messages';
import SubmitButton from '../../../views/common/submit-button/SubmitButton';
import { queryRunnerStyles } from '../QueryRunner.styles';
import { AutoComplete } from './auto-complete';

const QueryInput = (props: IQueryInputProps) => {
  const {
    handleOnRunQuery,
    handleOnMethodChange,
    handleOnVersionChange
  } = props;

  const dispatch = useDispatch();
  const httpMethods = [
    { key: 'GET', text: 'GET' },
    { key: 'POST', text: 'POST' },
    { key: 'PUT', text: 'PUT' },
    { key: 'PATCH', text: 'PATCH' },
    { key: 'DELETE', text: 'DELETE' },
  ];

  const urlVersions = [
    { key: 'v1.0', text: 'v1.0' },
    { key: 'beta', text: 'beta' },
  ];

  const { sampleQuery, authToken,
    isLoadingData: submitting } = useSelector((state: IRootState) => state);
  const authenticated = !!authToken.token;

  const showError = !authenticated && sampleQuery.selectedVerb !== 'GET';
  const verbSelector: any = queryRunnerStyles().verbSelector;
  verbSelector.title = {
    ...verbSelector.title,
    background: getStyleFor(sampleQuery.selectedVerb),
  };

  const contentChanged = (value: string) => {
    const query = { ...sampleQuery, ...{ sampleUrl: value } };
    changeUrlVersion(value);
    dispatch(setSampleQuery(query));
  };

  const changeUrlVersion = (newUrl: string) => {
    const query = { ...sampleQuery };
    const { queryVersion: newQueryVersion } = parseSampleUrl(newUrl);
    const { queryVersion: oldQueryVersion } = parseSampleUrl(query.sampleUrl);

    if (newQueryVersion !== oldQueryVersion) {
      if (newQueryVersion === 'v1.0' || newQueryVersion === 'beta') {
        const sampleQueryToSet = { ...query };
        sampleQueryToSet.selectedVersion = newQueryVersion;
        sampleQueryToSet.sampleUrl = newUrl;
        dispatch(setSampleQuery(sampleQueryToSet));
      }
    }
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
    <div className='row'>
      <div className='col-xs-12 col-lg-2'>
        <Dropdown
          ariaLabel={translateMessage('HTTP request method option')}
          role='listbox'
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
          role='listbox'
          selectedKey={sampleQuery.selectedVersion || 'v1.0'}
          options={urlVersions}
          onChange={(event, method) => handleOnVersionChange(method)}
        />
      </div>
      <div className='col-xs-12 col-lg-6'>
        <AutoComplete
          contentChanged={contentChanged}
          runQuery={runQuery}
        />
      </div>
      <div className='col-xs-12 col-lg-2'>
        <SubmitButton
          className='run-query-button'
          text={translateMessage('Run Query')}
          disabled={showError || !sampleQuery.sampleUrl}
          role='button'
          handleOnClick={() => runQuery()}
          submitting={submitting}
        />
      </div>
    </div>)
}

// @ts-ignore
const IntlQueryInput = injectIntl(QueryInput);
// @ts-ignore
export default IntlQueryInput;
