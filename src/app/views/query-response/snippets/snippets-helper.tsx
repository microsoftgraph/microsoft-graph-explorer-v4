import { PivotItem } from 'office-ui-fabric-react';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { getSnippet } from '../../../services/actions/snippet-action-creator';
import { Monaco } from '../../common';

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


  const sampleQuery = useSelector((state: any) => state.sampleQuery, shallowEqual);
  const snippet = useSelector((state: any) => (state.snippets)[language]);
  const [ loadingState, setLoadingState ] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
      setLoadingState(true);

      getSnippet(language, sampleQuery, dispatch)
        .then(() => setLoadingState(false));
  }, [sampleQuery.sampleUrl]);

  return (
    <Monaco
      body={loadingState ? 'Fetching code snippet...' : snippet}
      language={language}
      readOnly={true}
    />
  );
}
