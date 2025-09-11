// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';

import {TEAM_NAME_PATH_PATTERN} from 'utils/path';

const Dashboard = () => <div className='app__content'><h1>{'Dashboard'}</h1></div>;
const Analytics = () => <div className='app__content'><h1>{'Analytics'}</h1></div>;
const Reports = () => <div className='app__content'><h1>{'Reports'}</h1></div>;

export default function HomeController() {
    return (
        <Switch>
            <Route
                path={`/:team(${TEAM_NAME_PATH_PATTERN})/home/dashboard`}
                component={Dashboard}
            />
            <Route
                path={`/:team(${TEAM_NAME_PATH_PATTERN})/home/analytics`}
                component={Analytics}
            />
            <Route
                path={`/:team(${TEAM_NAME_PATH_PATTERN})/home/reports`}
                component={Reports}
            />
            <Redirect to={window.location.pathname.replace('/home', '/home/dashboard')}/>
        </Switch>
    );
}
