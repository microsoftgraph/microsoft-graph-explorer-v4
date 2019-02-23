import { TextField } from 'office-ui-fabric-react';
import React from 'react';

interface IRequestBodyControl {
    disabled: boolean;
}

export const RequestBodyControl = ({ disabled }: IRequestBodyControl) => {
    return (
        <div className='request-editor-control'>
            <TextField
                disabled={disabled}
                multiline rows={10}
                className='query-text-field'
            />
        </div>
    );
};
