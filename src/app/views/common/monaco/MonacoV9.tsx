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


const MonacoV9 = (props: MonacoProps)=>{
  const { onChange, language, readOnly, height} = props;
  const editorOptions: editor.IStandaloneEditorConstructionOptions={
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
  }
  let body = props.body;
  const editorHeight = height ? height : '300px';
  if (body && typeof body !== 'string') {
    body = formatJsonStringForAllBrowsers(body);
  }


  return <div className='monaco-editor'><Editor
    language={language?language:'json'}
    width='800 !important'
    height={editorHeight}
    value={body}
    options={editorOptions}
    onChange={onChange}>
  </Editor></div>
}

export { MonacoV9 };

