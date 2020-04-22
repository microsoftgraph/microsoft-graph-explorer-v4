import React from 'react';
import { Monaco } from '../../../common';

export const RequestBodyControl = () => {
    return (
        <div className='request-editor-control'>
            <Monaco
                body={undefined}
            />
        </div>
    );
};
