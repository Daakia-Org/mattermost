// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useState} from 'react';
import {useLocation} from 'react-router-dom';

import './daakia_container.scss';

interface Props {
    onToggleTeamSwitcher?: (isOpen: boolean) => void;
}

const DaakiaContainer: React.FC<Props> = ({onToggleTeamSwitcher}) => {
    const location = useLocation();
    const [isTeamSwitcherOpen, setIsTeamSwitcherOpen] = useState(true);

    const sections = [
        {
            id: 'home',
            name: 'Home',
            icon: 'fa-home',
            path: '/home',
        },
        {
            id: 'chats',
            name: 'Organization',
            icon: 'icon-message-text-outline',
            path: '/chats',
        },
        {
            id: 'calendar',
            name: 'Calendar',
            icon: 'icon-calendar-outline',
            path: '/calendar',
        },
        {
            id: 'meetings',
            name: 'Meetings & Events',
            icon: 'icon-video-outline',
            path: '/meetings',
        },
        {
            id: 'tasks',
            name: 'Task Manager',
            icon: 'fa-tasks',
            path: '/tasks',
        },
        {
            id: 'files',
            name: 'Saved Files',
            icon: 'icon-file-text-outline',
            path: '/files',
        },
        {
            id: 'bhashika',
            name: 'Bhashika',
            icon: 'icon-microphone-outline',
            path: '/bhashika',
        },
    ];

    // Find the current active section based on pathname
    const getCurrentSection = () => {
        if (location.pathname.includes('/home')) {
            return sections.find((section) => section.id === 'home');
        }

        // For other paths, find the first matching section or default to chats
        return sections.find((section) => location.pathname.startsWith(section.path)) || sections.find((section) => section.id === 'chats');
    };

    const currentSection = getCurrentSection();

    const handleToggleTeamSwitcher = () => {
        const newState = !isTeamSwitcherOpen;
        setIsTeamSwitcherOpen(newState);
        onToggleTeamSwitcher?.(newState);
    };

    return (
        <div className='daakia-container'>
            {currentSection && (
                <div className='daakia-section-info'>
                    <div className='daakia-section-icon'>
                        <i
                            className={`${currentSection.icon.startsWith('fa-') ? 'fa ' + currentSection.icon + ' fa-lg' : 'icon ' + currentSection.icon}`}
                            role='img'
                            aria-label={`${currentSection.name} Icon`}
                        />
                    </div>
                    <div className='daakia-section-name'>
                        {currentSection.name}
                    </div>
                </div>
            )}
            <div className='daakia-toggle-container'>
                <button
                    className='daakia-toggle-btn'
                    onClick={handleToggleTeamSwitcher}
                    title={isTeamSwitcherOpen ? 'Hide team switcher' : 'Show team switcher'}
                >
                    <i
                        className={`fa fa-chevron-${isTeamSwitcherOpen ? 'down' : 'up'}`}
                        role='img'
                        aria-label={`${isTeamSwitcherOpen ? 'Hide' : 'Show'} team switcher`}
                    />
                </button>
            </div>
        </div>
    );
};

export default DaakiaContainer;
