import { Label } from 'office-ui-fabric-react';
import { Pivot, PivotItem, PivotLinkSize } from 'office-ui-fabric-react/lib/Pivot';
import React, { Component } from 'react';
import './request.scss';
import { RequestBodyControl } from './RequestBody';
import { RequestHeadersControl } from './RequestHeaders';

export class Request extends Component<any, any> {
    public render() {
        return (
            <div className='request-editors'>
                <Pivot linkSize={PivotLinkSize.large}>
                    <PivotItem headerText='Request Body'>
                        <RequestBodyControl />
                    </PivotItem>
                    <PivotItem headerText='Request Headers'>
                        <RequestHeadersControl />
                    </PivotItem>
                </Pivot>
            </div>
        );
    }
}
