import Editor, { OnChange, loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { useContext, useEffect, useRef, useState } from 'react';
import { ThemeContext } from '../../../../themes/theme-context';
import { ResizeContext } from '../../../services/context/resize-context/ResizeContext';
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
  const { parentHeight, dragValue, initiator } = useContext(ResizeContext);

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
    if (initiator === 'responseSize') {
      if (editorRef.current && dragValue > 0) {
        const newHeight = parentHeight - dragValue - 124;
        setEditorHeight(Math.max(300, newHeight));
      }
    }
  }, [parentHeight, dragValue, initiator]);

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
