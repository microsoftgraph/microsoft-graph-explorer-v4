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

export function Monaco(props: IMonaco) {

  let { body } = props;
  const { onChange, language, readOnly, height } = props;

  if (body && typeof body !== 'string') {
    body = formatJsonStringForAllBrowsers(body);
  }
  const itemHeight = height ? height : '300px';

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
            onChange={onChange}
            theme={theme === 'light' ? 'vs' : 'vs-dark'}
          />)}
        </ThemeContext.Consumer>
      </div>
    </FocusZone>
  );
}

function formatJsonStringForAllBrowsers(body: string | object | undefined) {
  /**
   * 1. Remove whitespace, tabs or raw string (Safari related issue)
   * 2. Convert back to javascript object
   * 3. format the string (works for all browsers)
   */
  body = JSON.stringify(body).replace(/(?:\\[rnt]|[\r\n\t]+)+/g, '');
  body = JSON.parse(body);
  return JSON.stringify(body, null, 4);
}
