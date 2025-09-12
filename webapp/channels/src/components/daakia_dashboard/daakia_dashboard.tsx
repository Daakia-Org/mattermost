// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

/*eslint-disable*/
import React from 'react';

import DaakiaDashboardAnnouncements from 'components/daakia_dashboard_announcements';
import DaakiaDashboardMetrics from 'components/daakia_dashboard_metrics';
import DaakiaDashboardWelcome from 'components/daakia_dashboard_welcome';
import DaakiaDashboardTasks from 'components/daakia_dashboard_tasks';


import './daakia_dashboard.scss';

const DaakiaDashboard = () => {
    return (
        <div className='daakia-dashboard'>
            <div className='daakia-dashboard__content'>
                <div className='daakia-dashboard__welcome-section'>
                    <DaakiaDashboardWelcome />
                    <DaakiaDashboardMetrics />
                </div>
                
                <div className='daakia-dashboard__main-content'>
                    <div className='daakia-dashboard__left-panel'>
                        <DaakiaDashboardTasks />
                    </div>
                    <div className='daakia-dashboard__right-panel'>
                        <DaakiaDashboardAnnouncements />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DaakiaDashboard;
