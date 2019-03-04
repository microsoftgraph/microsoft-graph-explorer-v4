import { TextField } from 'office-ui-fabric-react';
import React from 'react';
import MonacoEditor from 'react-monaco-editor';

interface IRequestBodyControl {
    editorChange: Function;
    code: string;
    options: {};
}

export const RequestBodyControl = ({ editorChange, code, options }: IRequestBodyControl) => {
    return (
        <div className='request-editor-control'>
            <MonacoEditor
                width='900'
                height='300'
                value={code}
                options={options}
                onChange={(event, value) => editorChange(event, value)}
            />
        </div>
    );
};
