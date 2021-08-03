import { FocusZone } from 'office-ui-fabric-react';
import React from 'react';
import MonacoEditor, { ChangeHandler } from 'react-monaco-editor';

import { ThemeContext } from '../../../../themes/theme-context';
import './monaco.scss';
import { formatJsonStringForAllBrowsers } from './util/format-json';

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
              wordWrap: 'on'
            }}
            onChange={onChange}
            theme={theme === 'light' ? 'vs' : 'vs-dark'}
          />)}
        </ThemeContext.Consumer>
      </div>
    </FocusZone>
  );
}
