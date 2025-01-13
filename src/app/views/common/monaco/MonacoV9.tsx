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

const useStyles = makeStyles({
  container: {
    width: '99.8%'
  }
});

const MonacoV9 = (props: MonacoProps) => {
  const editorStyles = useStyles();
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
  const editorHeight = height ? height : '300px';
  if (body && typeof body !== 'string') {
    body = formatJsonStringForAllBrowsers(body);
  }

  return (
    <div className={editorStyles.container}>
      {props.extraInfoElement}
      <Editor
        language={language ? language : 'json'}
        height={editorHeight}
        value={body}
        options={editorOptions}
        onChange={onChange}
      ></Editor>
    </div>
  );
};

export { MonacoV9 };
