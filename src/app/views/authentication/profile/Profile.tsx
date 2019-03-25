import React from 'react';

export const Profile = ({ user }: any) => {
        return (
            <div className='profile'>
                <span className='user-name'>{user.displayName}</span>
                <br />
                <span className='user-email'>{user.emailAddress}</span>
            </div>
        );
};
