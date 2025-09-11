// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Route, Switch, useParams, useLocation} from 'react-router-dom';

import {getCurrentUserId} from 'mattermost-redux/selectors/entities/users';

// import {closeRightHandSide} from 'actions/views/rhs';

import DaakiaDashboard from 'components/daakia_dashboard';
import HomeRedirect from 'components/home_redirect';

import {setLastVisitedHomePage} from 'utils/home_storage';
import {TEAM_NAME_PATH_PATTERN} from 'utils/path';

const Analytics = () => <div className='app__content'><h1>{'Analytics'}</h1></div>;
const Reports = () => <div className='app__content'><h1>{'Reports'}</h1></div>;

export default function HomeController() {
    const {team} = useParams<{team: string}>();
    const location = useLocation();
    const currentUserId = useSelector(getCurrentUserId);
    const dispatch = useDispatch();

    useEffect(() => {
        // dispatch(closeRightHandSide());

        if (team && currentUserId) {
            const pathParts = location.pathname.split('/');
            const homePageIndex = pathParts.indexOf('home');
            if (homePageIndex !== -1 && pathParts[homePageIndex + 1]) {
                const currentPage = pathParts[homePageIndex + 1];
                setLastVisitedHomePage(currentUserId, team, currentPage);
            }
        }
    }, [location.pathname, team, currentUserId, dispatch]);

    return (
        <Switch>
            <Route
                path={`/:team(${TEAM_NAME_PATH_PATTERN})/home/dashboard`}
                component={DaakiaDashboard}
            />
            <Route
                path={`/:team(${TEAM_NAME_PATH_PATTERN})/home/analytics`}
                component={Analytics}
            />
            <Route
                path={`/:team(${TEAM_NAME_PATH_PATTERN})/home/reports`}
                component={Reports}
            />
            <Route
                exact={true}
                path={`/:team(${TEAM_NAME_PATH_PATTERN})/home`}
                component={HomeRedirect}
            />
        </Switch>
    );
}
