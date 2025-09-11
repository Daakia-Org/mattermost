// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import DaakiaDashboardCards from 'components/daakia_dashboard_cards';
import DaakiaHomeHeader from 'components/daakia_home_header';

import './daakia_dashboard.scss';

const DaakiaDashboard = () => {
    return (
        <div className='app__content'>
            <DaakiaHomeHeader title='Dashboard'/>
            <div className='daakia-dashboard'>
                <div className='daakia-dashboard__content'>
                    <DaakiaDashboardCards/>
                </div>
            </div>
        </div>
    );
};

export default DaakiaDashboard;