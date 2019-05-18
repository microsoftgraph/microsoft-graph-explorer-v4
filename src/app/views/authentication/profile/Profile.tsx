import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { IProfileProps, IProfileState } from '../../../../types/profile';
import * as queryActionCreators from '../../../services/actions/query-action-creators';
import { USER_INFO_URL, USER_PICTURE_URL } from '../../../services/graph-constants';

export class Profile extends Component<IProfileProps, IProfileState> {
    constructor(props: IProfileProps) {
        super(props);
        this.state = {
            user: {
                displayName: '',
                emailAddress: '',
                profileImageUrl: '',
            }
        };
    }

    public componentDidMount = async () => {
        const { actions } = this.props;

        const jsonUserInfo = (actions) ? await actions.runQuery({
            selectedVerb: 'GET',
            sampleUrl: USER_INFO_URL,
        }) : null;

        const userPicture = (actions) ? await actions.runQuery({
            selectedVerb: 'GET',
            sampleUrl: USER_PICTURE_URL,
        }) : null;

        const userInfo = jsonUserInfo.response.body;
        let imageUrl = '';
        if (userPicture) {
            const buffer = await userPicture.response.body.arrayBuffer();
            const blob = new Blob([buffer], { type: 'image/jpeg' });
            imageUrl = URL.createObjectURL(blob);
        }

        const user = {
            ...{},
            displayName: userInfo.displayName,
            emailAddress: userInfo.mail || userInfo.userPrincipalName,
            profileImageUrl: imageUrl,
        };

        this.setState({
            user
        });

    };

    public render() {
        const { user } = this.state;
        return (
            <div className='profile'>
                <div className='user-imageArea'>
                    <img className='user-image' src={user.profileImageUrl} />
                </div>
                <span className='user-name'>{user.displayName}</span>
                <br />
                <span className='user-email'>{user.emailAddress}</span>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch: Dispatch): object {
    return {
        actions: bindActionCreators(queryActionCreators, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(Profile);