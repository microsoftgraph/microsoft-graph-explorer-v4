import { Pivot, PivotItem, PivotLinkSize } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import './request.scss';
import { RequestBodyControl } from './RequestBody';
import { RequestHeadersControl } from './RequestHeaders';

export class Request extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            headers: [
                { name: '', value: '' },
            ],
            header: { name: '', value: '' },
        };
    }

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
        const headers = this.state.headers;
        headers.splice(item, 1);
        if (headers.length < 1) {
            headers.push({ name: '', value: '' });
        }
        this.setState({
            headers,
        });
    };

    private handleOnHeaderValueBlur = () => {
        const headers = this.state.headers;
        if (this.state.header.name !== '') {
            headers.push(this.state.header);
            const header = { name: '', value: '' };
            this.setState({
                headers,
                header,
            });
        }
    }

    private handleOnHeaderNameBlur = () => {
        this.addEmptyHeader();
    }

    private addEmptyHeader() {
        const lastHeader = this.getLastHeader();
        if (lastHeader.name !== '') {
            const headers = this.state.headers;
            headers.push({ name: '', value: '' });
            this.setState({
                headers,
            });
        }
    }

    public getLastHeader() {
        const headersLength = this.state.headers.length;
        return this.state.headers[headersLength - 1];
    }

    public render() {
        const {
            headers,
        } = this.state;
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
                            handleOnHeaderNameBlur={this.handleOnHeaderNameBlur}
                            handleOnHeaderValueBlur={this.handleOnHeaderValueBlur}
                            headers={headers}
                        />
                    </PivotItem>
                </Pivot>
            </div>
        );
    }
}
