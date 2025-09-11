// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {useHistory, useParams} from 'react-router-dom';

export default function HomeNavigator() {
    const history = useHistory();
    const {team} = useParams<{team: string}>();
    const currentPath = window.location.pathname;

    const homeItems = [
        {id: 'dashboard', name: 'Dashboard', path: `/${team}/home/dashboard`},
        {id: 'analytics', name: 'Analytics', path: `/${team}/home/analytics`},
        {id: 'reports', name: 'Reports', path: `/${team}/home/reports`},
    ];

    return (
        <div className='SidebarChannelGroup'>
            <div className='SidebarChannelGroupHeader'>
                <span className='SidebarChannelGroupHeader_groupButton'>
                    <span className='SidebarChannelGroupHeader_text'>{'HOME'}</span>
                </span>
            </div>
            <div className='SidebarChannelGroup_content'>
                {homeItems.map((item) => (
                    <div
                        key={item.id}
                        className={`SidebarChannel ${currentPath === item.path ? 'active' : ''}`}
                        onClick={() => history.push(item.path)}
                        role='button'
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && history.push(item.path)}
                    >
                        <div className='SidebarChannel_link'>
                            <span className='SidebarChannelLinkLabel_wrapper'>
                                <span className='SidebarChannelLinkLabel'>{item.name}</span>
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
