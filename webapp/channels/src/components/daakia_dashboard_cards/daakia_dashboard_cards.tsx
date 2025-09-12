// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import './daakia_dashboard_cards.scss';

interface DashboardCardProps {
    title: string;
    value: string;
    icon: string;
}

const DashboardCard = ({title, value, icon}: DashboardCardProps) => (
    <div className='daakia-dashboard-card'>
        <div className='daakia-dashboard-card__icon'>
            <i className={`icon ${icon}`}/>
        </div>
        <div className='daakia-dashboard-card__content'>
            <div className='daakia-dashboard-card__value'>{value}</div>
            <div className='daakia-dashboard-card__title'>{title}</div>
        </div>
    </div>
);

const DaakiaDashboardCards = () => {
    const cards = [
        {title: 'Dashboard', value: '12', icon: 'icon-view-dashboard'},
        {title: 'Upcoming Events', value: '5', icon: 'icon-calendar'},
        {title: 'Unread Messages', value: '23', icon: 'icon-message-text'},
        {title: 'Total Teams', value: '8', icon: 'icon-account-multiple'},
    ];

    return (
        <div className='daakia-dashboard-cards'>
            {cards.map((card, index) => (
                <DashboardCard
                    key={index}
                    title={card.title}
                    value={card.value}
                    icon={card.icon}
                />
            ))}
        </div>
    );
};

export default DaakiaDashboardCards;