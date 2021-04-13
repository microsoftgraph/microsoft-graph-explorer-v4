import { IconButton, Label, PivotItem } from 'office-ui-fabric-react';
import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { FormattedMessage } from 'react-intl';
import { getSnippet } from '../../../services/actions/snippet-action-creator';
import { Monaco } from '../../common';
import { genericCopy } from '../../common/copy';

import { componentNames, eventTypes, telemetry } from '../../../../telemetry';
import { IQuery } from '../../../../types/query-runner';
import { sanitizeQueryUrl } from '../../../utils/query-url-sanitization';
import { convertVhToPx, getResponseHeight } from '../../common/dimensions-adjustment';
import { IRootState } from '../../../../types/root';

interface ISnippetProps {
  language: string;
}

export function renderSnippets(supportedLanguages: string[]) {
  return supportedLanguages.map((language: string) => (
    <PivotItem
      key={language}
      headerText={language}
    >
      <Snippet language={language} />
    </PivotItem>
  ));
}

function Snippet(props: ISnippetProps) {
  let { language } = props;

  /**
   * Converting language lowercase so that we won't have to call toLowerCase() in multiple places.
   *
   * Ie the monaco component expects a lowercase string for the language prop and the graphexplorerapi expects
   * a lowercase string for the param value.
   */
  language = language.toLowerCase();

  const sampleQuery = useSelector((state: IRootState) => state.sampleQuery, shallowEqual);
  const { dimensions: { response }, snippets, responseAreaExpanded } = useSelector((state: IRootState) => state);
  const { data, pending: loadingState } = snippets;
  const snippet = (!loadingState && data) ? data[language] : null;

  const responseHeight = getResponseHeight(response.height, responseAreaExpanded);
  const height = convertVhToPx(responseHeight, 140);

  const dispatch = useDispatch();

  const copyIcon = {
    iconName: 'copy',
  };

  useEffect(() => {
    dispatch(getSnippet(language));
  }, [sampleQuery.sampleUrl]);

  return (
    <div style={{ display: 'block' }}>
      {loadingState &&
        <Label style={{ padding: 10 }}>
          <FormattedMessage id='Fetching code snippet' />...
        </Label>
      }
      {!loadingState && snippet &&
        <>
          <IconButton
            style={{ float: 'right', zIndex: 1 }}
            iconProps={copyIcon}
            onClick={async () => {
              genericCopy(snippet);
              trackSnippetCopyEvent(sampleQuery, language);
            }}
          />
          <Monaco
            body={snippet}
            language={language}
            readOnly={true}
            height={height}
          />
        </>
      }
      {!loadingState && !snippet &&
        <Label style={{ padding: 10 }}>
          <FormattedMessage id='Snippet not available' />
        </Label>
      }
    </div>
  );
}

function trackSnippetCopyEvent(query: IQuery, language: string) {
  const sanitizedUrl = sanitizeQueryUrl(query.sampleUrl);
  telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT,
    {
      ComponentName: componentNames.CODE_SNIPPETS_COPY_BUTTON,
      SelectedLanguage: language,
      QuerySignature: `${query.selectedVerb} ${sanitizedUrl}`
    });
}
