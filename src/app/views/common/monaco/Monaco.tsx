import Editor, { OnChange, loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { useEffect, useRef, useState } from 'react';
import { ThemeContext } from '../../../../themes/theme-context';
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
  const { onChange, language, readOnly } = props;

  if (body && typeof body !== 'string') {
    body = formatJsonStringForAllBrowsers(body);
  }

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

  const editorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  };

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [editorHeight, setEditorHeight] = useState(300);

  useEffect(() => {
    const handleResize = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { initiator, value } = customEvent.detail as {
        initiator: string;
        value: number;
      };
      if (initiator === 'responseSize') {
        if (editorRef.current) {
          const newHeight = window.innerHeight - value;
          setEditorHeight(newHeight);
        }
      }
    };
    window.addEventListener('onResizeDragEnd', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {props.extraInfoElement}
      <ThemeContext.Consumer>
        {/* TODO: handle this theme differently? */}
        {(theme) => (
          <Editor
            width='99.8%'
            height={editorHeight}
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
            onMount={editorDidMount}
          />
        )}
      </ThemeContext.Consumer>
    </>
  );
}
