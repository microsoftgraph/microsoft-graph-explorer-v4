import React from 'react';
import MonacoEditor from 'react-monaco-editor';

import './monaco.scss';

interface IMonaco {
  body: object|undefined;
}

function editorDidMount(editor: any) {
  const editorHasText = !!editor.getModel().getValue();

  if (editorHasText) {
    formatDocument(editor);
  }

  editor.onDidChangeModelContent(() => {
    formatDocument(editor);
  });
}

function formatDocument(editor: any) {
  editor.getAction('editor.action.formatDocument').run();
}

export function Monaco(props: IMonaco) {
  const { body } = props;

  return (
    <div className='monaco-editor'>
      <MonacoEditor
        width='800'
        height='300'
        value={JSON.stringify(body)}
        language='json'
        options={{ lineNumbers: 'off', minimap: { enabled: false } }}
        editorDidMount={editorDidMount}
      />
    </div>
  );
}
