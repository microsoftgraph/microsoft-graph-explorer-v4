import { FocusZone, getTheme } from 'office-ui-fabric-react';
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
  const { onChange, verb, language, readOnly } = props;

  if (body && typeof body !== 'string') {
    body = JSON.stringify(body);
  }

  const verbIsGet = verb === 'GET';

  return (
    <FocusZone disabled={true}>
      <div className='monaco-editor'>
        <ThemeContext.Consumer >
          {(theme) => (<MonacoEditor
            width='800 !important'
            height={verbIsGet ? '80vh' : '350px'}
            // @ts-ignore
            value={body  ? body : ''}
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
