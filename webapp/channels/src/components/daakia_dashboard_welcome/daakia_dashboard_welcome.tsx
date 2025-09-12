// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {useSelector} from 'react-redux';

import {getCurrentUser} from 'mattermost-redux/selectors/entities/users';

import type {GlobalState} from 'types/store';

import './daakia_dashboard_welcome.scss';

const DaakiaDashboardWelcome = () => {
    const currentUser = useSelector((state: GlobalState) => getCurrentUser(state));

    const displayName = currentUser?.first_name && currentUser?.last_name ?
        `${currentUser.first_name} ${currentUser.last_name}` :
        currentUser?.username || 'User';

    return (
        <div className='daakia-dashboard-welcome'>
            <div className='daakia-dashboard-welcome__content'>
                <h1 className='daakia-dashboard-welcome__title'>
                    {'Welcome '}
                    <span className='daakia-dashboard-welcome__name'>{displayName}</span>
                </h1>
                <p className='daakia-dashboard-welcome__subtitle'>
                    {'Connect and collaborate effectively with people for seamless communication.'}
                </p>
            </div>
            <div className='daakia-dashboard-welcome__divider'/>
        </div>
    );
};

export default DaakiaDashboardWelcome;
