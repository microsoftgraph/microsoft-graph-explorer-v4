import { Pivot, PivotItem, PivotLinkSize } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import './request.scss';
import { RequestBodyControl } from './RequestBody';
import { RequestHeadersControl } from './RequestHeaders';

export class Request extends Component<any, any> {
    public state = {
        headers: [
            { name: '', value: '' },
        ],
        headerName: '',
        headerValue: '',
    };

    private handleOnHeaderNameChange = (event: any, name?: any) => {
        if (name) {
            this.setState({
                headerName: name,
            });
        }
    };

    private handleOnHeaderValueChange = (event: any, value?: any) => {
        if (value) {
            this.setState({
                headerValue: value,
            });
        }
    };

    private handleOnHeaderDelete = (headerIndex: any) => {
        const { headers } = this.state;
        const headersToDelete = [...headers];
        headersToDelete.splice(headerIndex, 1);
        this.setState({
            headers: headersToDelete,
        });

    };

    private handleOnHeaderValueBlur = () => {
        if (this.state.headerName !== '') {
            const { headerName, headerValue, headers } = this.state;
            const header = { name: headerName, value: headerValue };
            const newHeaders = [header, ...headers];
            this.setState({
                headers: newHeaders,
                headerName: '',
                headerValue: '',
            });
        }
    }

    public getLastHeader() {
        const headersLength = this.state.headers.length;
        return this.state.headers[headersLength - 1];
    }

    public render() {
        const { headers } = this.state;
        return (
            <div className='request-editors'>
                <Pivot linkSize={PivotLinkSize.large}>
                    <PivotItem headerText='Request Body'>
                        <RequestBodyControl disabled={true} />
                    </PivotItem>
                    <PivotItem headerText='Request Headers'>
                        <RequestHeadersControl
                            handleOnHeaderDelete={this.handleOnHeaderDelete}
                            handleOnHeaderNameChange={this.handleOnHeaderNameChange}
                            handleOnHeaderValueChange={this.handleOnHeaderValueChange}
                            handleOnHeaderValueBlur={this.handleOnHeaderValueBlur}
                            headers={headers}
                        />
                    </PivotItem>
                </Pivot>
            </div>
        );
    }
}
