import { IconButton, TextField } from 'office-ui-fabric-react';
import React from 'react';

interface IRequestHeadersControl {
    handleOnHeaderDelete: Function;
    handleOnHeaderNameChange: Function;
    handleOnHeaderValueChange: Function;
    handleOnHeaderValueBlur: Function;
    headers: Array<{ name: string; value: string; }>;
}

export const RequestHeadersControl = ({
    handleOnHeaderDelete,
    handleOnHeaderNameChange,
    handleOnHeaderValueChange,
    handleOnHeaderValueBlur,
    headers,
}: IRequestHeadersControl) => {
    const headersList = (
        headers.map((header, index) => {
            return (
                <tr key={index}>
                    <td>
                        <TextField
                            className='header-input'
                            onChange={(event, name) => handleOnHeaderNameChange(event, name)}
                        />
                    </td>
                    <td>
                        <TextField className='header-input'
                            onChange={(event, value) => handleOnHeaderValueChange(event, value)}
                            onBlur={() => handleOnHeaderValueBlur()}
                        />
                    </td>
                    <td className='remove-header-btn'>
                        <IconButton
                            iconProps={{ iconName: 'Delete' }}
                            title='Remove request header'
                            ariaLabel='Remove request header'
                            onClick={() => handleOnHeaderDelete(index)}
                        />
                    </td>
                </tr>
            );
        })
    );
    return (
        <div className='request-editor-control'>
            <table className='headers-editor'>
                <thead>
                    <tr>
                        <th>Key</th>
                        <th>Value</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {headersList}
                </tbody>
            </table>
        </div>
    );
};
