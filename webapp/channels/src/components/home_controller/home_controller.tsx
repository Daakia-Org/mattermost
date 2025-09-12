// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Route, Switch, useParams, useLocation} from 'react-router-dom';

import {getCurrentUserId} from 'mattermost-redux/selectors/entities/users';

import DaakiaDashboard from 'components/daakia_dashboard';
import DaakiaHomeHeader from 'components/daakia_home_header';
import HomeRedirect from 'components/home_redirect';

import {setLastVisitedHomePage} from 'utils/home_storage';
import {TEAM_NAME_PATH_PATTERN} from 'utils/path';

// const Analytics = () => <h1>{'Analytics'}</h1>;
// const Reports = () => <h1>{'Reports'}</h1>;

export default function HomeController() {
    const {team} = useParams<{team: string}>();
    const location = useLocation();
    const currentUserId = useSelector(getCurrentUserId);

    // Get current page title based on route
    const getCurrentTitle = () => {
        if (location.pathname.includes('/home/dashboard')) {
            return 'Dashboard';
        }
        if (location.pathname.includes('/home/analytics')) {
            return 'Analytics';
        }
        if (location.pathname.includes('/home/reports')) {
            return 'Reports';
        }
        return 'Home';
    };

    useEffect(() => {
        if (team && currentUserId) {
            const pathParts = location.pathname.split('/');
            const homePageIndex = pathParts.indexOf('home');
            if (homePageIndex !== -1 && pathParts[homePageIndex + 1]) {
                const currentPage = pathParts[homePageIndex + 1];
                setLastVisitedHomePage(currentUserId, team, currentPage);
            }
        }
    }, [location.pathname, team, currentUserId]);

    return (
        <div className='app__content'>
            <DaakiaHomeHeader title={getCurrentTitle()}/>
            <Switch>
                <Route
                    path={`/:team(${TEAM_NAME_PATH_PATTERN})/home/dashboard`}
                    component={DaakiaDashboard}
                />
                {/* <Route
                    path={`/:team(${TEAM_NAME_PATH_PATTERN})/home/analytics`}
                    component={Analytics}
                />
                <Route
                    path={`/:team(${TEAM_NAME_PATH_PATTERN})/home/reports`}
                    component={Reports}
                /> */}
                <Route
                    exact={true}
                    path={`/:team(${TEAM_NAME_PATH_PATTERN})/home`}
                    component={HomeRedirect}
                />
            </Switch>
        </div>
    );
}
