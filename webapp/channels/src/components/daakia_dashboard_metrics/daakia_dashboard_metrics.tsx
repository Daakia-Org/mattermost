// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import './daakia_dashboard_metrics.scss';

interface MetricCardProps {
    title: string;
    value: string;
    icon: string;
    color?: string;
}

const MetricCard = ({title, value, icon, color = 'blue'}: MetricCardProps) => (
    <div className={`daakia-metric-card daakia-metric-card--${color}`}>
        <div className='daakia-metric-card__icon'>
            <i className={`icon ${icon}`}/>
        </div>
        <div className='daakia-metric-card__content'>
            <div className='daakia-metric-card__title'>{title}</div>
            <div className='daakia-metric-card__value'>{value}</div>
        </div>
    </div>
);

const DaakiaDashboardMetrics = () => {
    const metrics = [
        {
            title: 'Upcoming Events',
            value: '2',
            icon: 'icon-lightning-bolt-outline',
            color: 'yellow',
        },
        {
            title: 'Upcoming Meetings',
            value: '3',
            icon: 'icon-calendar-outline',
            color: 'blue',
        },
        {
            title: 'Active Channels',
            value: '10',
            icon: 'icon-check-circle-outline',
            color: 'blue',
        },
        {
            title: 'Teams',
            value: '6',
            icon: 'icon-account-multiple-outline',
            color: 'blue',
        },
    ];

    return (
        <div className='daakia-dashboard-metrics'>
            {metrics.map((metric, index) => (
                <MetricCard
                    key={index}
                    title={metric.title}
                    value={metric.value}
                    icon={metric.icon}
                    color={metric.color}
                />
            ))}
        </div>
    );
};

export default DaakiaDashboardMetrics;
