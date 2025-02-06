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
}

const useEditorStyles = makeStyles({
  container: {
    height: '95%'
  }
});

const useUpdatedEditorStyles = makeStyles({
  container: {
    height: '350px'
  }
})

const MonacoV9 = (props: MonacoProps) => {
  const styles = useEditorStyles();
  const { onChange, language, readOnly, height } = props;
  const editorOptions: editor.IStandaloneEditorConstructionOptions = {
    lineNumbers: 'off' as 'off',
    automaticLayout: true,
    minimap: { enabled: false },
    readOnly,
    wordWrap: 'on' as 'on',
    folding: true,
    foldingStrategy: 'indentation',
    showFoldingControls: 'always',
    renderLineHighlight: 'none',
    scrollBeyondLastLine: true,
    overviewRulerBorder: false,
    wordSeparators: '"'
  };
  let body = props.body;
  if (body && typeof body !== 'string') {
    body = formatJsonStringForAllBrowsers(body);
  }

  const mode = useAppSelector((state) => state.graphExplorerMode);
  const updatedEditorStyles = useUpdatedEditorStyles()
  const editorStyles = mode === Mode.TryIt ? updatedEditorStyles.container : styles.container;

  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <div id='monaco-editor' className={editorStyles}>
          {props.extraInfoElement}
          <Editor
            language={language ? language : 'json'}
            width='98.9%'
            height={height ? height : '95%'}
            value={body}
            options={editorOptions}
            onChange={onChange}
            theme={theme === 'light' ? 'vs' : 'vs-dark'}
          ></Editor>
        </div>
      )}
    </ThemeContext.Consumer>
  );
};

export { MonacoV9 };
