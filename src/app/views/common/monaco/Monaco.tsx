import { useEffect, useMemo, useRef, useState } from 'react';
import { makeStyles } from '@fluentui/react-components';
import { Editor, OnChange } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { ThemeContext } from '../../../../themes/theme-context';
import { formatJsonStringForAllBrowsers } from './util/format-json';
import { useAppSelector } from '../../../../store';
import { Mode } from '../../../../types/enums';

interface MonacoProps {
  body: object | string | undefined;
  onChange?: OnChange;
  verb?: string;
  language?: string;
  readOnly?: boolean;
  height?: string;
  extraInfoElement?: JSX.Element;
  isVisible?: boolean;
}

const useStyles = makeStyles({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  }
});

const Monaco = ({ body, onChange, language, readOnly, extraInfoElement, isVisible }: MonacoProps) => {
  const styles = useStyles();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [isEditorReady, setEditorReady] = useState(false);

  const editorOptions: editor.IStandaloneEditorConstructionOptions = {
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
  };

  const formattedBody = useMemo(() => {
    if (typeof body === 'string') {
      return body;
    }
    if (body) {
      return formatJsonStringForAllBrowsers(body);
    }
    return '';
  }, [body]);

  // Recalculate layout when the tab becomes visible
  useEffect(() => {
    if (isVisible && editorRef.current) {
      editorRef.current.layout();
    }
  }, [isVisible]);

  // Update editor content without resetting cursor
  useEffect(() => {
    if (editorRef.current && isEditorReady) {
      const currentValue = editorRef.current.getValue();
      if (formattedBody !== currentValue) {
        const model = editorRef.current.getModel();
        if (model) {
          editorRef.current.pushUndoStop();
          model.pushEditOperations(
            [],
            [{ range: model.getFullModelRange(), text: formattedBody ?? '' }],
            () => null
          );
        }
      }
    }
  }, [formattedBody, isEditorReady]);

  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <div id='monaco-editor' className={styles.container}>
          {extraInfoElement}
          <Editor
            language={language || 'json'}
            width='100%'
            height='100%'
            options={editorOptions}
            onChange={onChange}
            theme={theme === 'light' ? 'vs' : 'vs-dark'}
            onMount={(editorInstance) => {
              editorRef.current = editorInstance;
              editorInstance.layout();
              editorInstance.setValue(formattedBody ?? '');
              setEditorReady(true);
            }}
          />
        </div>
      )}
    </ThemeContext.Consumer>
  );
};

export { Monaco };
