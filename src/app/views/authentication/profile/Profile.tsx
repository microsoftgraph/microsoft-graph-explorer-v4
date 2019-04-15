import React from 'react';

import { IProfileProps } from '../../../../types/profile';

export const Profile = ({ user }: { user: IProfileProps}) => {
        return (
            <div className='profile'>
                <div className='user-imageArea'>
                    <img className='user-image' src={user.profileImageUrl}/>
                </div>
                <span className='user-name'>{user.displayName}</span>
                <br />
                <span className='user-email'>{user.emailAddress}</span>
            </div>
        );
};
