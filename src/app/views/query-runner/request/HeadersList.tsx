import { IconButton, TextField } from 'office-ui-fabric-react';
import React from 'react';
import { IHeadersListControl } from '../../../../types/request';

const HeadersList = ({
    handleOnHeaderDelete,
    handleOnHeaderNameChange,
    handleOnHeaderValueChange,
    handleOnHeaderValueBlur,
    headers,
}: IHeadersListControl) => {
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
                            onClick={(event) => handleOnHeaderDelete(event, header)}
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
                    </tr>
                </thead>
                <tbody>
                    { headersList }
                </tbody>
            </table>
        </div>
    );
};

export default HeadersList;