import { TextField } from 'office-ui-fabric-react';
import React from 'react';

export const RequestBodyControl = () => {
    return (
        <div className='request-editor-control'>
            <TextField
                multiline rows={10}
                className='query-text-field'
            />
        </div>
    );
};
