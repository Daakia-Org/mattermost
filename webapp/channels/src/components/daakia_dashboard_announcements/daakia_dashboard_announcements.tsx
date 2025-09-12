// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import './daakia_dashboard_announcements.scss';

interface Announcement {
    id: string;
    title: string;
    content: string;
    author: string;
    isFromUser?: boolean;
}

const AnnouncementItem = ({announcement}: {announcement: Announcement}) => (
    <div className='daakia-announcement-item'>
        <div className='daakia-announcement-item__icon'>
            <i className='icon icon-message-text-outline'/>
        </div>
        <div className='daakia-announcement-item__content'>
            <h4 className='daakia-announcement-item__title'>
                {announcement.title}
            </h4>
            <p className='daakia-announcement-item__text'>
                {announcement.content}
            </p>
            <div className='daakia-announcement-item__meta'>
                <span className='daakia-announcement-item__author'>
                    {announcement.isFromUser ? 'from You' : `from ${announcement.author}`}
                </span>
            </div>
        </div>
        <div className='daakia-announcement-item__actions'>
            <button className='daakia-announcement-item__menu-btn'>
                <i className='icon icon-dots-vertical'/>
            </button>
        </div>
    </div>
);

const DaakiaDashboardAnnouncements = () => {
    const announcements: Announcement[] = [
        {
            id: '1',
            title: 'Welcome New HR to our Organization @Hannah B',
            content: '',
            author: 'Travis Baker',
        },
        {
            id: '2',
            title: 'Exciting news! 🎉 Our app is now live and available for download on iOS and Android. Thanks to the team for their hard work in making this happen!',
            content: '',
            author: 'You',
            isFromUser: true,
        },
    ];

    return (
        <div className='daakia-dashboard-announcements'>
            <div className='daakia-dashboard-announcements__header'>
                <h3 className='daakia-dashboard-announcements__title'>
                    {'Announcements'}
                </h3>
                <div className='daakia-dashboard-announcements__actions'>
                    <button className='daakia-dashboard-announcements__add-btn'>
                        <i className='icon icon-plus'/>
                    </button>
                    <a href='#' className='daakia-dashboard-announcements__see-all'>
                        {'See all'}
                    </a>
                </div>
            </div>

            <div className='daakia-dashboard-announcements__list'>
                {announcements.map((announcement) => (
                    <AnnouncementItem key={announcement.id} announcement={announcement} />
                ))}
            </div>
        </div>
    );
};

export default DaakiaDashboardAnnouncements;
