import { FocusZone, getTheme } from 'office-ui-fabric-react';
import React from 'react';
import MonacoEditor, { ChangeHandler } from 'react-monaco-editor';

import './monaco.scss';

interface IMonaco {
  body: object | string | undefined;
  onChange?: ChangeHandler | undefined;
  verb?: string;
}

function editorDidMount(editor: any) {
  const editorHasText = !!editor.getModel().getValue();

  if (editorHasText) {
    setTimeout(() => {
      formatDocument(editor);
    }, 500);
  }

  editor.onDidChangeModelContent(() => {
    formatDocument(editor);
  });
}

function formatDocument(editor: any) {
  editor.getAction('editor.action.formatDocument').run();
}

export function Monaco(props: IMonaco) {

  let { body } = props;
  const { onChange, verb } = props;
  const currentTheme = getTheme();
  const isLight = currentTheme.semanticColors.bodyBackground === '#ffffff' ? true : false;

  if (typeof body !== 'string') {
    body = JSON.stringify(body);
  }

  const verbIsGet = verb === 'GET';

  return (
    <FocusZone disabled={true}>
      <div className='monaco-editor'>
        <MonacoEditor
          width='800 !important'
          height={verbIsGet ? '80vh' : '350px'}
          value={body}
          language='json'
          options={{ lineNumbers: 'off', minimap: { enabled: false } }}
          editorDidMount={editorDidMount}
          onChange={onChange}
          theme={isLight ? 'vs' : 'vs-dark'}
        />
      </div>
    </FocusZone>
  );
}
