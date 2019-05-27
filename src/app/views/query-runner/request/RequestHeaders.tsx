import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import * as headersActionCreators from '../../../services/actions/request-headers-action-creators';
import HeadersList from './HeadersList';

class RequestHeaders extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            headerName: '',
            headerValue: '',
        };
    }

    private handleOnHeaderNameChange = (name?: string) => {
        if (name) {
            this.setState({
                headerName: name,
            });
        }
    };

    private handleOnHeaderValueChange = (value?: string) => {
        if (value) {
            this.setState({
                headerValue: value,
            });
        }
    };

    private handleOnHeaderDelete = (header: any) => {
        const { actions } = this.props;
        if (actions) {
            actions.removeRequestHeader(header);
        }
    };


    private handleOnHeaderValueBlur = () => {
        if (this.state.headerName !== '') {
            const { headerName, headerValue } = this.state;
            const { actions, headers } = this.props;
            const header = { name: headerName, value: headerValue };
            const newHeaders = [header, ...headers];

            this.setState({
                headerName: '',
                headerValue: '',
            });

            if (actions) {
                actions.addRequestHeader(newHeaders);
            }
        }
    };

    public render() {
        const { headers } = this.props;
        return (
            <div className='request-editor-control'>
                <HeadersList
                    handleOnHeaderDelete={(event: any, header: any) => this.handleOnHeaderDelete(header)}
                    handleOnHeaderNameChange={(event: any, name: any) => this.handleOnHeaderNameChange(name)}
                    handleOnHeaderValueChange={(event: any, value: any) => this.handleOnHeaderValueChange(value)}
                    handleOnHeaderValueBlur={(event: any) => this.handleOnHeaderValueBlur()}
                    headers={headers}
                />
            </div>
        );
    }
}

function mapDispatchToProps(dispatch: Dispatch): object {
    return {
        actions: bindActionCreators(headersActionCreators, dispatch),
    };
}

function mapStateToProps(state: any) {
    return {
        headers: state.headersAdded
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestHeaders);

