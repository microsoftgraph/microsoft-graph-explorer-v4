import { DefaultButton, Dropdown, IDropdownOption, IStackTokens, Stack } from '@fluentui/react';
import { useContext } from 'react';

import { useAppDispatch, useAppSelector } from '../../../../store';
import { IQuery, IQueryInputProps, httpMethods } from '../../../../types/query-runner';
import { ValidationContext } from '../../../services/context/validation-context/ValidationContext';
import { GRAPH_API_VERSIONS } from '../../../services/graph-constants';
import { setSampleQuery } from '../../../services/slices/sample-query.slice';
import { getStyleFor } from '../../../utils/http-methods.utils';
import { parseSampleUrl } from '../../../utils/sample-url-generation';
import { translateMessage } from '../../../utils/translate-messages';
import SubmitButton from '../../../views/common/submit-button/SubmitButton';
import { shouldRunQuery } from '../../sidebar/sample-queries/sample-query-utils';
import { queryRunnerStyles } from '../QueryRunner.styles';
import { AutoComplete } from './auto-complete';

const QueryInput = (props: IQueryInputProps) => {
  const {
    handleOnRunQuery,
    handleOnMethodChange,
    handleOnVersionChange
  } = props;

  const dispatch = useAppDispatch();
  const validation = useContext(ValidationContext);


  const urlVersions: IDropdownOption[] = [];
  GRAPH_API_VERSIONS.forEach(version => {
    urlVersions.push({
      key: version,
      text: version
    })
  });

  const sampleQuery = useAppSelector((state) => state.sampleQuery);
  const authToken = useAppSelector((state) => state.auth.authToken);
  const authenticated = !!authToken.token;
  const isLoadingData = useAppSelector((state) => state.graphResponse.isLoadingData);
  const sidebarProperties = useAppSelector((state) => state.sidebarProperties);
  const { mobileScreen } = sidebarProperties;

  const showError = !shouldRunQuery({
    method: sampleQuery.selectedVerb, authenticated,
    url: sampleQuery.sampleUrl
  });
  const { queryButtonStyles, verbSelector } = queryRunnerStyles();
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

  const runQuery = (queryUrl?: string) => {
    let query: IQuery = sampleQuery;
    if (queryUrl) {
      query = getChangedQueryContent(queryUrl);
    }
    if (!validation.isValid) {
      return;
    }
    handleOnRunQuery(query);
  };

  const queryInputStackTokens: IStackTokens = {
    childrenGap: 10
  };


  return (
    <>
      <Stack horizontal={mobileScreen ? false : true} tokens={queryInputStackTokens} horizontalAlign='space-between'>
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
        <Stack.Item grow>
          <AutoComplete
            contentChanged={contentChanged}
            runQuery={runQuery}
          />
        </Stack.Item>
        <Stack.Item shrink>
          <SubmitButton
            className='run-query-button'
            text={translateMessage('Run Query')}
            disabled={showError || !sampleQuery.sampleUrl || !validation.isValid}
            role='button'
            handleOnClick={() => runQuery()}
            submitting={isLoadingData}
            allowDisabledFocus={true}
          />
        </Stack.Item>
        <Stack.Item shrink styles={!mobileScreen ? queryButtonStyles : {}}>

        </Stack.Item>
      </Stack>
    </>
  )
}

// @ts-ignore
export default QueryInput;
