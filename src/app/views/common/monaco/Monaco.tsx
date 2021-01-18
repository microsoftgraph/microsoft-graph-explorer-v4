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
}

export function Monaco(props: IMonaco) {

  let { body } = props;
  const { onChange, language, readOnly } = props;

  if (body && typeof body !== 'string') {
    body = JSON.stringify(body).replace(/(?:\\[rnt]|[\r\n\t]+)+/g, '');
    // remove whitespace, tabs or raw string (Safari related issue)
    body = JSON.parse(body); // convert back to javascript object
    body = JSON.stringify(body, null, 4); // format the string (works for all browsers)
  }

  return (
    <FocusZone disabled={true}>
      <div className='monaco-editor'>
        <ThemeContext.Consumer >
          {(theme) => (<MonacoEditor
            width='800 !important'
            height={'80vh'}
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
            onChange={onChange}
            theme={theme === 'light' ? 'vs' : 'vs-dark'}
          />)}
        </ThemeContext.Consumer>
      </div>
    </FocusZone>
  );
}
