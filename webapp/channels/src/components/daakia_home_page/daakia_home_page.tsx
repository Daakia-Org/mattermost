// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import DaakiaWelcomeCard from 'components/daakia_welcome_card';
import DaakiaDashboardCards from 'components/daakia_dashboard_cards';
import DaakiaRecentTasks from 'components/daakia_recent_tasks';
import DaakiaAnnouncements from 'components/daakia_announcements';
import DaakiaComingSoonOverlay from 'components/daakia_coming_soon_overlay';

import './daakia_home_page.scss';

const DaakiaHomePage = () => {
    return (
        <div className='daakia-home-page'>
            <DaakiaComingSoonOverlay />
            <div className='daakia-home-page__content'>
                <DaakiaWelcomeCard />
                <DaakiaDashboardCards />
                <div className='daakia-home-page__bottom-section'>
                    <DaakiaRecentTasks />
                    <DaakiaAnnouncements />
                </div>
            </div>
        </div>
    );
};

export default DaakiaHomePage;