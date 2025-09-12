// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import './daakia_announcements.scss';

interface AnnouncementProps {
    title: string;
    content: string;
    date: string;
    priority: 'high' | 'medium' | 'low';
}

const AnnouncementItem = ({title, content, date, priority}: AnnouncementProps) => (
    <div className={`daakia-announcement-item daakia-announcement-item--${priority}`}>
        <div className='daakia-announcement-item__header'>
            <h4 className='daakia-announcement-item__title'>{title}</h4>
            <span className='daakia-announcement-item__date'>{date}</span>
        </div>
        <p className='daakia-announcement-item__content'>{content}</p>
    </div>
);

const DaakiaAnnouncements = () => {
    const announcements = [
        {
            title: 'System Maintenance',
            content: 'Scheduled maintenance will occur this weekend from 2-4 AM EST.',
            date: '2 days ago',
            priority: 'high' as const,
        },
        {
            title: 'New Feature Release',
            content: 'We have released new collaboration tools for better team productivity.',
            date: '1 week ago',
            priority: 'medium' as const,
        },
        {
            title: 'Team Meeting',
            content: 'Monthly all-hands meeting scheduled for next Friday at 3 PM.',
            date: '3 days ago',
            priority: 'low' as const,
        },
        {
            title: 'Security Update',
            content: 'Please update your passwords and enable two-factor authentication.',
            date: '5 days ago',
            priority: 'high' as const,
        },
    ];

    return (
        <div className='daakia-announcements'>
            <h3 className='daakia-announcements__title'>{'Announcements'}</h3>
            <div className='daakia-announcements__list'>
                {announcements.map((announcement, index) => (
                    <AnnouncementItem
                        key={index}
                        title={announcement.title}
                        content={announcement.content}
                        date={announcement.date}
                        priority={announcement.priority}
                    />
                ))}
            </div>
        </div>
    );
};

export default DaakiaAnnouncements;