import { useContext } from 'react';
import {
  Dropdown,
  Field,
  Tooltip,
  Option,
  Badge,
  makeStyles,
  tokens
} from '@fluentui/react-components';
import { ErrorCircle12Filled } from '@fluentui/react-icons';
import { useAppDispatch, useAppSelector } from '../../../../store';
import {
  IQuery,
  IQueryInputProps,
  httpMethods
} from '../../../../types/query-runner';
import { ValidationContext } from '../../../services/context/validation-context/ValidationContext';
import { GRAPH_API_VERSIONS } from '../../../services/graph-constants';
import { setSampleQuery } from '../../../services/slices/sample-query.slice';
import { parseSampleUrl } from '../../../utils/sample-url-generation';
import { translateMessage } from '../../../utils/translate-messages';
import SubmitButton from '../../../views/common/submit-button/SubmitButton';
import { shouldRunQuery } from '../../sidebar/sample-queries/sample-query-utils';
import { AutoComplete } from './auto-complete';
import { methodColors, getStyleFor } from '../../../utils/http-methods.utils';

const useStyles = makeStyles({
  container: {
    display: 'grid',
    gridTemplateColumns: 'auto auto 1fr auto',
    alignItems: 'start',
    columnGap: tokens.spacingHorizontalS,
    width: '100%'
  },
  containerMobile: {
    display: 'grid',
    gridTemplateRows: 'auto auto auto auto',
    rowGap: tokens.spacingHorizontalMNudge,
    width: '100%'
  },
  errorText: {
    color: 'red',
    marginTop: '4px'
  },
  smallDropdown: {
    '&.fui-Dropdown': {
      minWidth: '90px',
      height: 'min-content'
    }
  },
  autocomplete: {
    flexGrow: '1'
  }
});

const QueryInput = (props: IQueryInputProps) => {
  const { handleOnRunQuery, handleOnMethodChange, handleOnVersionChange } = props;

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

  // Compute the selected badge color for the method dropdown
  const selectedMethod = sampleQuery.selectedVerb;
  const selectedBadgeColor = getStyleFor(selectedMethod);

  return (
    <div className={mobileScreen ? classes.containerMobile : classes.container}>
      <Field
        validationMessageIcon={showError ? <ErrorCircle12Filled /> : null}
        validationMessage={
          showError ? translateMessage('Sign in to use this method') : undefined
        }
        validationState={showError ? 'error' : 'none'}
      >
        <Tooltip
          content={translateMessage('HTTP request method')}
          relationship='description'
          withArrow>
          <Dropdown
            aria-label={translateMessage('HTTP request method option')}
            placeholder='Select method'
            value={sampleQuery.selectedVerb}
            className={classes.smallDropdown}
            button={{ style: { color: selectedBadgeColor } }}
            onOptionSelect={(event, data) => {
              handleOnMethodChange({
                key: data.optionValue,
                text: data.optionValue
              });
            }}
          >
            {Object.values(httpMethods).map((method) => {
              const badgeColor = methodColors[method] || 'brand';

              return (
                <Option
                  key={method}
                  value={method}
                  text={method}
                >
                  <Badge appearance='ghost' color={badgeColor}>
                    {method}
                  </Badge>
                </Option>
              );
            })}
          </Dropdown>
        </Tooltip>
      </Field>

      <Tooltip
        content={translateMessage('Microsoft Graph API Version')}
        relationship='description'
        withArrow
      >
        <Dropdown
          aria-label={translateMessage('Microsoft Graph API Version option')}
          placeholder='Select a version'
          value={sampleQuery.selectedVersion || GRAPH_API_VERSIONS[0]}
          onOptionSelect={(event, data) => {
            handleOnVersionChange({
              key: data.optionValue,
              text: data.optionValue
            });
          }}
          className={classes.smallDropdown}
        >
          {GRAPH_API_VERSIONS.map((version) => (
            <Option key={version} value={version}>
              {version}
            </Option>
          ))}
        </Dropdown>
      </Tooltip>
      <AutoComplete contentChanged={contentChanged} runQuery={runQuery} />

      <SubmitButton
        text={translateMessage('Run Query')}
        disabled={showError || !sampleQuery.sampleUrl || !validation.isValid}
        handleOnClick={() => runQuery()}
        submitting={isLoadingData}
      />
    </div>
  );
};

export default QueryInput;
