import { FocusZone } from 'office-ui-fabric-react';
import React from 'react';
import MonacoEditor, { ChangeHandler } from 'react-monaco-editor';

import { ThemeContext } from '../../../../themes/theme-context';
import './monaco.scss';

interface IMonaco {
  body: object | string | undefined;
  onChange?: ChangeHandler | undefined;
  verb?: string;
  language?: string;
  readOnly?: boolean;
  height?: string;
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

  let { body } = props;
  const { onChange, language, readOnly, height } = props;

  if (body && typeof body !== 'string') {
    body = JSON.stringify(body);
  }

  let itemHeight = '300px';
  if (height) {
    itemHeight = height;
  }

  return (
    <FocusZone disabled={true}>
      <div className='monaco-editor'>
        <ThemeContext.Consumer >
          {(theme) => (<MonacoEditor
            width='800 !important'
            height={itemHeight}
            // @ts-ignore
            value={body ? body : ''}
            language={language ? language : 'json'}
            options={{
              lineNumbers: 'off',
              automaticLayout: true,
              minimap: { enabled: false },
              readOnly,
              scrollbar: {
                horizontalHasArrows: true,
                horizontal: 'visible',
                horizontalScrollbarSize: 17,
              },
            }}
            editorDidMount={editorDidMount}
            onChange={onChange}
            theme={theme === 'light' ? 'vs' : 'vs-dark'}
          />)}
        </ThemeContext.Consumer>
      </div>
    </FocusZone>
  );
}
