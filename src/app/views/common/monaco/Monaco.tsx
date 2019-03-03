import React from 'react';
import MonacoEditor from 'react-monaco-editor';

import './monaco.scss';

interface IMonaco {
  body: object|undefined;
}

function editorDidMount(editor: any, monaco: any) {
  editor.onDidChangeModelContent(() => {
    editor.getAction('editor.action.formatDocument').run();
  });
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
        options={{ lineNumbers: 'off' }}
        editorDidMount={editorDidMount}
      />
    </div>
  );
}
