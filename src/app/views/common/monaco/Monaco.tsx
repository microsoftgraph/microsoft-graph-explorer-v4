import { useEffect, useRef } from 'react';
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

const Monaco = ({ body, onChange, language, readOnly, height, extraInfoElement, isVisible }: MonacoProps) => {
  const mode = useAppSelector((state) => state.graphExplorerMode);
  const mobileScreen = useAppSelector((state) => state.sidebarProperties.mobileScreen);
  const showSidebar = mode === Mode.Complete && !mobileScreen;
  const styles = useStyles();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

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

  let formattedBody: string | undefined;
  if (typeof body === 'string') {
    formattedBody = body;
  } else if (body) {
    formattedBody = formatJsonStringForAllBrowsers(body);
  }

  // Recalculate layout when the tab becomes visible
  useEffect(() => {
    if (isVisible && editorRef.current) {
      editorRef.current.layout();
    }
  }, [isVisible]);

  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <div id=' monaco-editor'  className={styles.container}>
          {extraInfoElement}
          <Editor
            language={language || 'json'}
            width='100%'
            height='100%'
            value={formattedBody}
            options={editorOptions}
            onChange={onChange}
            theme={theme === 'light' ? 'vs' : 'vs-dark'}
            onMount={(editorInstance) => {
              editorRef.current = editorInstance;
              editorInstance.layout();
            }}
          />
        </div>
      )}
    </ThemeContext.Consumer>
  );
};

export { Monaco };
