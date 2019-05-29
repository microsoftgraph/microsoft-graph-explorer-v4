import { PrimaryButton, TextField } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
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


    private handleOnHeaderAdd = () => {
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
                <div className='row headers-editor'>
                    <div className='col-md-4 col-12'>
                        <label htmlFor=''>
                            <FormattedMessage id='Key' />
                        </label>
                        <TextField
                            className='header-input'
                            onChange={(event, name) => this.handleOnHeaderNameChange(name)}
                        />
                    </div>
                    <div className='col-md-4 col-12'>
                        <label htmlFor=''>
                            <FormattedMessage id='Value' />
                        </label>
                        <TextField className='header-input'
                            onChange={(event, value) => this.handleOnHeaderValueChange(value)}
                        />
                    </div>
                    <div className='col-md-4 col-12'>
                        <br/>
                        <PrimaryButton onClick={() => this.handleOnHeaderAdd()}>
                            <FormattedMessage id='Add' />
                        </PrimaryButton>
                    </div>
                </div>
                <br />
                <hr />
                <HeadersList
                    handleOnHeaderDelete={(event: any, header: any) => this.handleOnHeaderDelete(header)}
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

