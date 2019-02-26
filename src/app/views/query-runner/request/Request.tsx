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
        };
    }

    private handleOnHeaderNameChange = (event: any, ind: any, name?: any) => {
        this.addEmptyHeader();
    };

    private handleOnHeaderValueChange = (event: any, ind: any, value?: any) => {
        this.addEmptyHeader();
    };

    private handleOnHeaderDelete = (idx: any) => {
        const headers = this.state.headers;
        headers.splice(idx, 1);
        if (idx !== -1) {
            headers.push({ name: '', value: '' });
        }
        this.setState({
            headers,
        });
    };

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
        return this.state.headers[this.state.headers.length - 1];
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
                            headers={headers}
                        />
                    </PivotItem>
                </Pivot>
            </div>
        );
    }
}
