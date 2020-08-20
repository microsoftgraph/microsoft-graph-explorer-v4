import { IconButton, Label, PivotItem } from 'office-ui-fabric-react';
import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { FormattedMessage } from 'react-intl';
import { getSnippet } from '../../../services/actions/snippet-action-creator';
import { Monaco } from '../../common';
import { genericCopy } from '../../common/copy';

import { telemetry } from '../../../../telemetry';
import { TAB_CLICK_EVENT, BUTTON_CLICK_EVENT } from '../../../../telemetry/event-types';
import { IQuery } from '../../../../types/query-runner';

interface ISnippetProps {
  language: string;
  sampleQuery: IQuery
}

export function renderSnippets(supportedLanguages: string[]) {
  const sampleQuery = useSelector((state: any) => state.sampleQuery, shallowEqual);
  telemetry.trackEvent(TAB_CLICK_EVENT, 
   {
     ComponentName: 'Code Snippets Tab',
     QueryUrl: sampleQuery.sampleUrl,
     HttpVerb: sampleQuery.selectedVerb
   });
  return supportedLanguages.map((language: string) => (
    <PivotItem
      key={language}
      headerText={language}
    >
      <Snippet language={language} sampleQuery={sampleQuery} />
    </PivotItem>
  ));
}



function Snippet(props: ISnippetProps) {
  let { language, sampleQuery } = props;
  /**
   * Converting language lowercase so that we won't have to call toLowerCase() in multiple places.
   *
   * Ie the monaco component expects a lowercase string for the language prop and the graphexplorerapi expects
   * a lowercase string for the param value.
   */
  language = language.toLowerCase();

  const snippets = useSelector((state: any) => (state.snippets));
  const { data, pending: loadingState } = snippets;
  const snippet = (!loadingState && data) ? data[language] : null;

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
          <FormattedMessage id ='Fetching code snippet' />...
        </Label>
      }
      {!loadingState && snippet &&
        <>
          <IconButton
            style={{ float: 'right', zIndex: 1 }}
            iconProps={copyIcon}
            onClick={async () => {
              genericCopy(snippet);
              telemetry.trackEvent(BUTTON_CLICK_EVENT,
               {
                 ComponentName: 'Code Snippets Copy Button',
                 QueryUrl: sampleQuery.sampleUrl,
                 HttpVerb: sampleQuery.selectedVerb,
                 SelectedLanguage: language
               });}}
          />
          <Monaco
            body={snippet}
            language={language}
            readOnly={true}
          />
        </>
      }
      {!loadingState && !snippet &&
        <Label style={{ padding: 10 }}>
          <FormattedMessage id ='Snippet not available' />
        </Label>
      }
    </div>
  );
}
