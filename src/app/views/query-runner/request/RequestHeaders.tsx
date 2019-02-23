import { IconButton, TextField } from 'office-ui-fabric-react';
import React from 'react';

interface IRequestHeadersControl {
    handleOnClick: Function;
    handleOnInputChange: Function;
}

export const RequestHeadersControl = ({
    handleOnClick,
    handleOnInputChange,
}: IRequestHeadersControl) => {
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
                        <TextField
                            className='header-input'
                            onChange={(event, value) => handleOnInputChange(event, value)}
                        />
                    </td>
                    <td>
                        <TextField className='header-input' />
                    </td>
                    <td className='remove-header-btn'>
                        <IconButton
                            iconProps={{ iconName: 'Delete' }}
                            title='Remove request header'
                            ariaLabel='Remove request header'
                            onClick={() => handleOnClick()}
                        />
                    </td>
                </tr>
            </table>
        </div>
    );
};
