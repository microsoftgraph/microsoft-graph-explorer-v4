import { ActionButton, IPersonaSharedProps, Persona, PersonaSize, styled } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';


import { IToggleProps, IToggleState } from '../../../types/toggle';
import { IRootState } from '../../../types/root';
import * as authActionCreators from '../../services/actions/auth-action-creators';
import * as profileActionCreators from '../../services/actions/profile-action-creators';
import { authenticationStyles } from '../authentication/Authentication.styles';

import { Toggle } from "office-ui-fabric-react/lib/Toggle";

export class ToggleMode extends Component<IToggleProps, IToggleState> {
    constructor(props: IToggleProps) {
        super(props);
        this.state = {
            user: {
                mode: "User"
            }
        };
    }


    public render() {
        const { user } = this.state;

        return (
            <div>
                <div style={{ marginTop: 15 }}>
                    {
                        !this.props.minimised &&
                        <>
                            {this.displayToggle()}
                        </>
                    }
                </div>
            </div>
        );
    }

    private displayToggle(): React.ReactNode {
        return (
            <Toggle
                onText="App"
                offText="You"
                defaultChecked={false}
                inlineLabel
            />
        )
    }
}

function mapDispatchToProps(dispatch: Dispatch): object {
    return {
        actions: bindActionCreators({
            ...profileActionCreators,
            ...authActionCreators
        }, dispatch)
    };
}

function mapStateToProps({ sidebarProperties, theme, graphExplorerMode }: IRootState) {
    const mobileScreen = !!sidebarProperties.mobileScreen;
    const showSidebar = !!sidebarProperties.showSidebar;

    return {
        mobileScreen: !!sidebarProperties.mobileScreen,
        appTheme: theme,
        minimised: !mobileScreen && !showSidebar,
        graphExplorerMode
    };
}


// @ts-ignore
const styledToggle = styled(ToggleMode, authenticationStyles);
// @ts-ignore
const IntlToggle = injectIntl(styledToggle);
export default connect(mapStateToProps, mapDispatchToProps)(IntlToggle);

