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
            
            {/* Simple Coming Soon Overlay */}
            <div className='daakia-dashboard__coming-soon'>
                <div className='daakia-dashboard__coming-soon-content'>
                    <div className='daakia-dashboard__coming-soon-icon'>
                        <i className='icon icon-clock-outline'/>
                    </div>
                    <h2 className='daakia-dashboard__coming-soon-title'>
                        Dashboard - Coming Soon
                    </h2>
                    <p className='daakia-dashboard__coming-soon-message'>
                        Dashboard features are coming soon! We are building an amazing analytics and monitoring experience for you.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DaakiaDashboard;
