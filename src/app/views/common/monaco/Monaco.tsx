import React from 'react';
import MonacoEditor from 'react-monaco-editor';

import './monaco.scss';

interface IMonaco {
  body: object|undefined;
  readOnly: boolean;
}

function editorDidMount(editor: any, monaco: any) {
  return editor.onDidChangeModelContent(() => {
    editor.getAction('editor.action.formatDocument').run();
  });
}

export function Monaco(props: IMonaco) {
  const { body, readOnly } = props;

  return (
    <div className='monaco-editor'>
      <MonacoEditor
        width='800'
        height='300'
        value={JSON.stringify(body)}
        language='json'
        options={{ formatOnPaste: true, formatOnType: true, lineNumbers: 'off' }}
        editorDidMount={editorDidMount}
      />
    </div>
  );
}
