import { Dropdown, IDropdownOption, IStackTokens, Stack } from '@fluentui/react';
import { injectIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import { AppDispatch, useAppSelector } from '../../../../store';
import { httpMethods, IQuery, IQueryInputProps } from '../../../../types/query-runner';
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

  const dispatch: AppDispatch = useDispatch();

  const urlVersions: IDropdownOption[] = [];
  GRAPH_API_VERSIONS.forEach(version => {
    urlVersions.push({
      key: version,
      text: version
    })
  });

  const { sampleQuery, authToken,
    isLoadingData: submitting, sidebarProperties } = useAppSelector((state) => state);
  const authenticated = !!authToken.token;
  const { mobileScreen } = sidebarProperties;

  const showError = !authenticated && sampleQuery.selectedVerb !== 'GET';
  const { queryButtonStyles, verbSelector, shareQueryButtonStyles } = queryRunnerStyles();
  verbSelector.title = {
    ...verbSelector.title,
    background: getStyleFor(sampleQuery.selectedVerb)
  };

  const contentChanged = (value: string) => {
    const updatedQuery = getChangedQueryContent(value);
    dispatch(setSampleQuery(updatedQuery));
  };

  const getChangedQueryContent = (newUrl: string): IQuery => {

    const query = { ...sampleQuery };
    const { queryVersion: newQueryVersion } = parseSampleUrl(newUrl);

    if (GRAPH_API_VERSIONS.includes(newQueryVersion)) {
      query.selectedVersion = newQueryVersion;
    }
    query.sampleUrl = newUrl;
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

  const queryInputStackTokens: IStackTokens = {
    childrenGap: 7
  };

  return (
    <>
      <Stack horizontal={mobileScreen ? false : true} tokens={queryInputStackTokens}>
        <Stack.Item styles={!mobileScreen ? queryButtonStyles : {}}>
          <Dropdown
            ariaLabel={translateMessage('HTTP request method option')}
            selectedKey={sampleQuery.selectedVerb}
            options={httpMethods}
            styles={verbSelector}
            errorMessage={showError ? translateMessage('Sign in to use this method') : undefined}
            onChange={(event, method) => handleOnMethodChange(method)}
          />
        </Stack.Item>
        <Stack.Item >
          <Dropdown
            ariaLabel={translateMessage('Microsoft Graph API Version option')}
            selectedKey={sampleQuery.selectedVersion || GRAPH_API_VERSIONS[0]}
            options={urlVersions}
            onChange={(event, method) => handleOnVersionChange(method)}
          />
        </Stack.Item>
        <Stack.Item grow disableShrink>
          <AutoComplete
            contentChanged={contentChanged}
            runQuery={runQuery}
          />
        </Stack.Item>
        <Stack.Item shrink>
          <SubmitButton
            className='run-query-button'
            text={translateMessage('Run Query')}
            disabled={showError || !sampleQuery.sampleUrl}
            role='button'
            handleOnClick={() => runQuery()}
            submitting={submitting}
            allowDisabledFocus={true}
          />
        </Stack.Item>
        <Stack.Item shrink styles={!mobileScreen ? shareQueryButtonStyles : {}}>
          <ShareQuery />
        </Stack.Item>
      </Stack>
    </>
  )
}

// @ts-ignore
const IntlQueryInput = injectIntl(QueryInput);
// @ts-ignore
export default IntlQueryInput;
