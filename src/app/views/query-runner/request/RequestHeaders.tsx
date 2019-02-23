import { DefaultButton, TextField, IconButton } from 'office-ui-fabric-react';
import React from 'react';

export const RequestHeadersControl = () => {
    return (
        <div className='request-editor-control'>
            <table className='headers-editor'>
                <tr>
                    <th>Key</th>
                    <th>Value</th>
                    <th></th>
                </tr>
                <tr>
                    <td>
                        <TextField className='header-input' />
                    </td>
                    <td>
                        <TextField className='header-input' />
                    </td>
                    <td className='remove-header-btn'>
                        <IconButton
                            iconProps={{ iconName: 'Delete' }}
                            title='Remove'
                            ariaLabel='Remove'
                        />
                    </td>
                </tr>
            </table>
        </div>
    );
};
