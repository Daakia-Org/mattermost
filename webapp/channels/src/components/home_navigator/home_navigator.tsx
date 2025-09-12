// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {useDispatch} from 'react-redux';
import {useHistory, useParams, useLocation} from 'react-router-dom';

import {close as closeLhs} from 'actions/views/lhs';

export default function HomeNavigator() {
    const dispatch = useDispatch();
    const history = useHistory();
    const {team} = useParams<{team: string}>();
    const location = useLocation();
    const currentPath = location.pathname;

    const homeItems = [
        {id: 'dashboard', name: 'Dashboard', path: `/${team}/home/dashboard`, icon: 'icon-globe'},

        // {id: 'analytics', name: 'Analytics', path: `/${team}/home/analytics`, icon: 'icon-plus'},
        // {id: 'reports', name: 'Reports', path: `/${team}/home/reports`, icon: 'icon-chevron-down'},
    ];

    return (
        <div className='SidebarChannelGroup a11y__section'>
            <div className='SidebarChannelGroupHeader'>
                <button
                    className='SidebarChannelGroupHeader_groupButton'
                    aria-label='HOME'
                    aria-expanded='true'
                >
                    <i className='icon icon-chevron-down'/>
                    <div className='SidebarChannelGroupHeader_text'>{'HOME'}</div>
                </button>
            </div>
            <div className='SidebarChannelGroup_content'>
                <ul className='NavGroupContent'>
                    {homeItems.map((item) => (
                        <li
                            key={item.id}
                            className={`SidebarChannel expanded ${currentPath === item.path ? 'active' : ''}`}
                            tabIndex={-1}
                        >
                            <a
                                className='SidebarLink'
                                href={item.path}
                                onClick={(e) => {
                                    e.preventDefault();
                                    history.push(item.path);
                                    dispatch(closeLhs());
                                }}
                                tabIndex={0}
                            >
                                <i className={`icon ${item.icon}`}/>
                                <div className='SidebarChannelLinkLabel_wrapper'>
                                    <span className='SidebarChannelLinkLabel'>{item.name}</span>
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
