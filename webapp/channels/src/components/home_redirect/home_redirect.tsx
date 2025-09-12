// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {useSelector} from 'react-redux';
import {Redirect, useParams} from 'react-router-dom';

import {getCurrentUserId} from 'mattermost-redux/selectors/entities/users';

import {getLastVisitedHomePage} from 'utils/home_storage';

export default function HomeRedirect() {
    const {team} = useParams<{team: string}>();
    const currentUserId = useSelector(getCurrentUserId);

    if (!team || !currentUserId) {
        return <Redirect to={`/${team}/home/dashboard`}/>;
    }

    const lastVisitedPage = getLastVisitedHomePage(currentUserId, team);
    const redirectTo = lastVisitedPage ? `/${team}/home/${lastVisitedPage}` : `/${team}/home/dashboard`;

    return <Redirect to={redirectTo}/>;
}
