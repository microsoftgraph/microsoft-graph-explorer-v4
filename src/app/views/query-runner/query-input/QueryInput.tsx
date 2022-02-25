import { IDropdownOption, Dropdown, Dialog, IconButton, DialogType,
  FontSizes, DialogFooter, DefaultButton, IIconProps, TooltipHost, DirectionalHint } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';
import { httpMethods, IQueryInputProps } from '../../../../types/query-runner';

import { IRootState } from '../../../../types/root';
import { setSampleQuery } from '../../../services/actions/query-input-action-creators';
import { GRAPH_API_VERSIONS } from '../../../services/graph-constants';
import { getStyleFor } from '../../../utils/http-methods.utils';
import { sanitizeQueryUrl } from '../../../utils/query-url-sanitization';
import { parseSampleUrl } from '../../../utils/sample-url-generation';
import { translateMessage } from '../../../utils/translate-messages';
import SubmitButton from '../../../views/common/submit-button/SubmitButton';
import { copy } from '../../common/copy';
import { CopyButton } from '../../common/copy/CopyButton';
import { createShareLink } from '../../common/share';
import { queryRunnerStyles } from '../QueryRunner.styles';
import { AutoComplete } from './auto-complete';


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
    isLoadingData: submitting, sidebarProperties } = useSelector((state: IRootState) => state);
  const authenticated = !!authToken.token;

  const { mobileScreen } = sidebarProperties;

  const [showShareQueryDialog, setShareQuaryDialogStatus] = useState(true);
  const [shareLink, setShareLink] = useState(() => createShareLink(sampleQuery));

  const toggleShareQueryDialogState = () => {
    setShareQuaryDialogStatus(prevState => !prevState);
  };

  useEffect(() => {
    setShareLink(createShareLink(sampleQuery));
  }, [sampleQuery]);

  const iconProps : IIconProps = {
    iconName: 'Share'
  }

  const showError = !authenticated && sampleQuery.selectedVerb !== 'GET';
  const verbSelector: any = queryRunnerStyles().verbSelector;
  verbSelector.title = {
    ...verbSelector.title,
    background: getStyleFor(sampleQuery.selectedVerb)
  };

  const shareButtonStyles = queryRunnerStyles().iconButton;

  const calloutProps = {
    gapSpace: 0
  };

  const content = <div style={{padding:'3px'}}>{translateMessage('Share Query')}</div>

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

  const handleCopy = () => {
    copy('share-query-text');
    trackCopyEvent();
  };

  const trackCopyEvent = () => {
    const sanitizedUrl = sanitizeQueryUrl(sampleQuery.sampleUrl);
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT,
      {
        ComponentName: componentNames.SHARE_QUERY_COPY_BUTTON,
        QuerySignature: `${sampleQuery.selectedVerb} ${sanitizedUrl}`
      });
  }

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
            selectedKey={sampleQuery.selectedVersion || 'v1.0'}
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
        {!mobileScreen &&
        <>
          <div className='col-lg-2'>
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
          <div className='col-lg-1' style={{flexShrink: 2}}>
            <TooltipHost
              content={content}
              calloutProps={calloutProps}
              directionalHint={DirectionalHint.leftBottomEdge}
            >
              <IconButton
                onClick={toggleShareQueryDialogState}
                iconProps={iconProps}
                styles={shareButtonStyles}
              />
            </TooltipHost>
          </div>
        </>
        }
      </div>
      {mobileScreen &&
      <div style={{display: 'flex'}}>
        <div style={{flexGrow: 5, flexBasis: '100%'}}>
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
        <div style={{flexGrow: 1, flexShrink: 2}}>
          <TooltipHost
            content={content}
            calloutProps={calloutProps}
            directionalHint={DirectionalHint.leftBottomEdge}
          >
            <IconButton
              onClick={toggleShareQueryDialogState}
              iconProps={iconProps}
              styles={shareButtonStyles}
            />
          </TooltipHost>
        </div>
      </div>
      }
      <Dialog
        hidden={showShareQueryDialog}
        onDismiss={toggleShareQueryDialogState}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Share Query',
          isMultiline: true,
          subText: translateMessage('Share Query Message')
        }}
      >
        <textarea
          style={{
            wordWrap: 'break-word',
            fontFamily: 'monospace',
            fontSize: FontSizes.xSmall,
            width: '100%',
            height: 63,
            overflowY: 'scroll',
            resize: 'none',
            color: 'black'
          }}
          id='share-query-text'
          className='share-query-params'
          defaultValue={shareLink}
          aria-label={translateMessage('Share Query')}
        />
        <DialogFooter>
          <CopyButton handleOnClick={handleCopy} isIconButton={false} />
          <DefaultButton
            text={translateMessage('Close')}
            onClick={toggleShareQueryDialogState}
          />
        </DialogFooter>
      </Dialog>
    </>
  )
}

// @ts-ignore
const IntlQueryInput = injectIntl(QueryInput);
// @ts-ignore
export default IntlQueryInput;
