import { Pivot, PivotItem, PivotLinkSize } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import './request.scss';
import { RequestBodyControl } from './RequestBody';
import { RequestHeadersControl } from './RequestHeaders';

export class Request extends Component<any, any> {

    private handleOnClick = () => {
        return;
    };

    private handleOnInputChange = (event: any, value?: any) => {
        return;
    };

    public render() {
        return (
            <div className='request-editors'>
                <Pivot linkSize={PivotLinkSize.large}>
                    <PivotItem headerText='Request Body'>
                        <RequestBodyControl disabled={true} />
                    </PivotItem>
                    <PivotItem headerText='Request Headers'>
                        <RequestHeadersControl
                            handleOnClick={this.handleOnClick}
                            handleOnInputChange={this.handleOnInputChange}
                            />
                    </PivotItem>
                </Pivot>
            </div>
        );
    }
}
