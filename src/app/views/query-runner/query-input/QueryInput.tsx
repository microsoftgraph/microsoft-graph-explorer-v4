import React, { useContext } from 'react';
import {
  Dropdown,
  Field,
  Option,
  Text,
  makeStyles,
  tokens
} from '@fluentui/react-components';

import { useAppDispatch, useAppSelector } from '../../../../store';
import { IQuery, IQueryInputProps, httpMethods } from '../../../../types/query-runner';
import { ValidationContext } from '../../../services/context/validation-context/ValidationContext';
import { GRAPH_API_VERSIONS } from '../../../services/graph-constants';
import { setSampleQuery } from '../../../services/slices/sample-query.slice';
import { getMethodColor } from '../../../utils/http-methods.utils';
import { parseSampleUrl } from '../../../utils/sample-url-generation';
import { translateMessage } from '../../../utils/translate-messages';
import SubmitButton from '../../../views/common/submit-button/SubmitButton';
import { shouldRunQuery } from '../../sidebar/sample-queries/sample-query-utils';
import { AutoComplete } from './auto-complete';
import { ErrorCircle12Filled } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: tokens.spacingHorizontalM,
    columnGap: tokens.spacingHorizontalM
  },
  errorText: {
    color: 'red',
    marginTop: '4px'
  },
  verbDropdown: {
  },
  smallDropdown: {
    width: '150px'
  },
  methodText: {
    color: 'var(--method-color)'
  }

});

const QueryInput = (props: IQueryInputProps) => {
  const {
    handleOnRunQuery,
    handleOnMethodChange,
    handleOnVersionChange
  } = props;

  const classes = useStyles();
  const dispatch = useAppDispatch();
  const validation = useContext(ValidationContext);

  const sampleQuery = useAppSelector((state) => state.sampleQuery);
  const authToken = useAppSelector((state) => state.auth.authToken);
  const authenticated = !!authToken.token;
  const isLoadingData = useAppSelector((state) => state.graphResponse.isLoadingData);
  const sidebarProperties = useAppSelector((state) => state.sidebarProperties);
  const { mobileScreen } = sidebarProperties;

  const showError = !shouldRunQuery({
    method: sampleQuery.selectedVerb,
    authenticated,
    url: sampleQuery.sampleUrl
  });

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
  };

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

  return (
    <div
      className={classes.container}
      style={{
        flexDirection: mobileScreen ? 'column' : 'row'
      }}
    >
      <Field
        validationMessageIcon={showError ? <ErrorCircle12Filled /> : null}
        validationMessage={showError ? translateMessage('Sign in to use this method') : undefined}
        validationState={showError ? 'error' : 'none'}
      >
        <Dropdown
          placeholder="Select method"
          value={sampleQuery.selectedVerb}
          // Combine your smallDropdown style
          className={classes.smallDropdown}
          onOptionSelect={(event, data) => {
            handleOnMethodChange({ key: data.optionValue, text: data.optionValue });
          }}
        >
          {httpMethods.map(method => {
            const textColor = getMethodColor(method.key.toString());

            return (
              <Option text={method.text} key={method.key} value={method.key.toString()}>
                <Text style={{ '--method-color': textColor } as React.CSSProperties}>{method.text}</Text>
              </Option>
            );
          })}
        </Dropdown>
      </Field>

      <div>
        <Dropdown
          aria-label={translateMessage('Microsoft Graph API Version option')}
          placeholder="Select a version"
          value={sampleQuery.selectedVersion || GRAPH_API_VERSIONS[0]}
          onOptionSelect={(event, data) => {
            handleOnVersionChange({ key: data.optionValue, text: data.optionValue });
          }}
          className={classes.smallDropdown}
        >
          {GRAPH_API_VERSIONS.map(version => (
            <Option key={version} value={version}>
              {version}
            </Option>
          ))}
        </Dropdown>
      </div>

      <div style={{ flexGrow: 1 }}>
        <AutoComplete
          contentChanged={contentChanged}
          runQuery={runQuery}
        />
      </div>

      <div>
        <SubmitButton
          className="run-query-button"
          text={translateMessage('Run Query')}
          disabled={showError || !sampleQuery.sampleUrl || !validation.isValid}
          handleOnClick={() => runQuery()}
          submitting={isLoadingData}
        />
      </div>
    </div>
  );
};

export default QueryInput;
