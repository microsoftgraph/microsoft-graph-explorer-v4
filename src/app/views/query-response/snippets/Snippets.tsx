import { Pivot, PivotItem } from 'office-ui-fabric-react';
import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { getSnippet } from '../../../services/actions/snippet-action-creator';

interface ISnippetProps {
  language: string;
}

export function Snippets() {
  const supportedLanguages = ['java', 'csharp', 'Javascript', 'Objective-C'];

  return (
    <Pivot>
      {renderSnippets(supportedLanguages)}
    </Pivot>
  );
}

function renderSnippets(supportedLanguages: string[]) {
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
  const { language } = props;
  const sampleQuery = useSelector((state: any) => state.sampleQuery, shallowEqual);
  const dispatch = useDispatch();

  let pathname = '';

  if (sampleQuery.sampleUrl) {
    pathname = new URL(sampleQuery.sampleUrl).pathname;
  }
  sampleQuery.sampleUrl = pathname;

  useEffect(() => {
    // tslint:disable-next-line
    console.log('mounting component');
    getSnippet(language, sampleQuery, dispatch)
      // tslint:disable-next-line
      .catch((error: any) => console.log(error));
  }, [sampleQuery.sampleUrl]);

  // TODO: Render the snippet in Monaco
  return (<div>{`Showing snippets for ${language}`}</div>);
}
