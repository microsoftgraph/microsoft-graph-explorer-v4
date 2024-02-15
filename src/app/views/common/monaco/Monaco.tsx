import { FocusZone } from '@fluentui/react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import Editor, { OnChange, loader } from '@monaco-editor/react';
import { useEffect } from 'react';

import { ThemeContext } from '../../../../themes/theme-context';
import './monaco.scss';
import { formatJsonStringForAllBrowsers } from './util/format-json';

interface IMonaco {
  body: object | string | undefined;
  onChange?: OnChange;
  verb?: string;
  language?: string;
  readOnly?: boolean;
  height?: string;
  extraInfoElement?: JSX.Element;
}

export function Monaco(props: IMonaco) {
  let { body } = props;
  const { onChange, language, readOnly, height } = props;

  if (body && typeof body !== 'string') {
    body = formatJsonStringForAllBrowsers(body);
  }
  const itemHeight = height ? height : '300px';

  loader.config({ monaco });

  useEffect(() => {
    if (monaco) {
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        allowComments: false,
        schemas: [],
        enableSchemaRequest: true,
        schemaRequest: 'ignore'
      });
    }
  }, [monaco]);

  return (
    <FocusZone disabled= {props.extraInfoElement ? false : true}>
      <div className='monaco-editor'>
        {props.extraInfoElement}
        <ThemeContext.Consumer>
          {(theme) => (<Editor
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
              wordWrap: 'on',
              folding: true,
              foldingStrategy: 'indentation',
              showFoldingControls: 'always',
              renderLineHighlight: 'none',
              scrollBeyondLastLine: true,
              overviewRulerBorder: false,
              wordSeparators: '"'
            }}
            onChange={onChange}
            theme={theme === 'light' ? 'vs' : 'vs-dark'}
          />)}
        </ThemeContext.Consumer>
      </div>
    </FocusZone>
  );
}