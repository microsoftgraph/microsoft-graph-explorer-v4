import { Label } from 'office-ui-fabric-react';
import { Pivot, PivotItem, PivotLinkSize } from 'office-ui-fabric-react/lib/Pivot';
import React, { Component } from 'react';
import './request.scss';

export class Request extends Component<any, any> {
    public render() {
        return (
            <div className='request-editors'>
                <Pivot linkSize={PivotLinkSize.large}>
                    <PivotItem headerText='Request Body'>
                        <Label>Request Body</Label>
                    </PivotItem>
                    <PivotItem headerText='Request Headers'>
                        <Label>Request Headers</Label>
                    </PivotItem>
                </Pivot>
            </div>
        );
    }
}
