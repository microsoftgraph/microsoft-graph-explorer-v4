import { FocusZone, getTheme } from 'office-ui-fabric-react'
import React from 'react';
import MonacoEditor, { ChangeHandler } from 'react-monaco-editor';

import './monaco.scss';

interface IMonaco {
  body: object|undefined;
  onChange?: ChangeHandler | undefined;
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

  const { body, onChange } = props;
  const currentTheme = getTheme();
  const isDark = currentTheme.palette.black === '#ffffff' ? true : false;


  return (
    <FocusZone disabled={true}>
      <div className='monaco-editor'>
        <MonacoEditor
          width='800'
          height='300'
          value={JSON.stringify(body)}
          language='json'
          options={{ lineNumbers: 'off', minimap: { enabled: false } }}
          editorDidMount={editorDidMount}
          onChange={onChange}
          theme={isDark ? 'vs-dark' : 'vs'}
        />
      </div>
    </FocusZone>
  );
}
