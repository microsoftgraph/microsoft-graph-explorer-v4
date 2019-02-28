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
        header: { name: '', value: '' },
    };

    private handleOnHeaderNameChange = (event: any, name?: any) => {
        if (name) {
            const headerName = this.state.header;
            headerName.name = name;
            this.setState({
                header: headerName,
            });
        }
    };

    private handleOnHeaderValueChange = (event: any, value?: any) => {
        if (value) {
            const headerValue = this.state.header;
            headerValue.value = value;
            this.setState({
                header: headerValue,
            });
        }
    };

    private handleOnHeaderDelete = (item: any) => {
        const headers = this.state.headers.filter((header: any) => {
            if (header !== item) {
                return header;
            }
        });
        this.setState({
            headers,
        });
    };

    private handleOnHeaderValueBlur = () => {
        if (this.state.header.name !== '') {
            let headerItems = this.state.headers.filter((header) => {
                return header.name !== '';
            });

            headerItems = [...headerItems, this.state.header];
            this.setState({
                headers: headerItems,
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
