// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useState} from 'react';

import DaakiaContainer from 'components/daakia-container';
import DaakiaTeamSwitcher from 'components/daakia-team-switcher';
import ResizableLhs from 'components/resizable_sidebar/resizable_lhs';

import './home_sidebar.scss';

const HomeSidebar: React.FC = () => {
    const [isTeamSwitcherOpen, setIsTeamSwitcherOpen] = useState(true);

    const handleToggleTeamSwitcher = (isOpen: boolean) => {
        setIsTeamSwitcherOpen(isOpen);
    };

    return (
        <ResizableLhs
            id='SidebarContainer'
            className='sidebar--left'
        >
            <DaakiaContainer onToggleTeamSwitcher={handleToggleTeamSwitcher}/>
            <DaakiaTeamSwitcher isVisible={isTeamSwitcherOpen}/>
            {/* Home Dashboard Navigation */}
            <div className='home-sidebar-nav'>
                <button className='home-sidebar-nav__button'>
                    <i className='icon icon-home-outline'/>
                    <span>{'Dashboard'}</span>
                </button>
                <button className='home-sidebar-nav__button'>
                    <i className='icon icon-chart-line-outline'/>
                    <span>{'Analytics'}</span>
                </button>
                <button className='home-sidebar-nav__button'>
                    <i className='icon icon-cog-outline'/>
                    <span>{'Settings'}</span>
                </button>
            </div>

            {/* Home Quick Actions */}
            <div className='home-sidebar-actions'>
                <div className='home-sidebar-actions__header'>
                    <span>{'Quick Actions'}</span>
                </div>
                <div className='home-sidebar-actions__items'>
                    <button className='home-sidebar-actions__item'>
                        <i className='icon icon-plus'/>
                        <span>{'New Project'}</span>
                    </button>
                    <button className='home-sidebar-actions__item'>
                        <i className='icon icon-file-text-outline'/>
                        <span>{'Create Report'}</span>
                    </button>
                    <button className='home-sidebar-actions__item'>
                        <i className='icon icon-calendar-outline'/>
                        <span>{'Schedule Meeting'}</span>
                    </button>
                </div>
            </div>

            {/* Home Recent Activity */}
            <div className='home-sidebar-recent'>
                <div className='home-sidebar-recent__header'>
                    <span>{'Recent Activity'} </span>
                </div>
                <div className='home-sidebar-recent__items'>
                    <div className='home-sidebar-recent__item'>
                        <i className='icon icon-check-circle'/>
                        <span>{'Project Alpha completed'}</span>
                    </div>
                    <div className='home-sidebar-recent__item'>
                        <i className='icon icon-bell-outline'/>
                        <span>{'New notification'}</span>
                    </div>
                    <div className='home-sidebar-recent__item'>
                        <i className='icon icon-message-text-outline'/>
                        <span>{'Message received'}</span>
                    </div>
                </div>
            </div>
        </ResizableLhs>
    );
};

export default HomeSidebar;
