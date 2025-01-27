import { makeStyles } from '@fluentui/react-components';
import { Editor, OnChange } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { formatJsonStringForAllBrowsers } from './util/format-json';

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

  return (
    <div id='monaco-editor' className={styles.container}>
      {props.extraInfoElement}
      <Editor
        language={language ? language : 'json'}
        width='98.9%'
        height={height ? height : '95%'}
        value={body}
        options={editorOptions}
        onChange={onChange}
      ></Editor>
    </div>
  );
};

export { MonacoV9 };
