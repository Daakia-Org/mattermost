// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import './daakia_recent_tasks.scss';

interface TaskProps {
    title: string;
    status: 'completed' | 'pending' | 'in-progress';
    time: string;
}

const TaskItem = ({title, status, time}: TaskProps) => (
    <div className='daakia-task-item'>
        <div className={`daakia-task-item__status daakia-task-item__status--${status}`}/>
        <div className='daakia-task-item__content'>
            <div className='daakia-task-item__title'>{title}</div>
            <div className='daakia-task-item__time'>{time}</div>
        </div>
    </div>
);

const DaakiaRecentTasks = () => {
    const tasks = [
        {title: 'Review project proposal', status: 'completed' as const, time: '2 hours ago'},
        {title: 'Team standup meeting', status: 'in-progress' as const, time: '30 minutes ago'},
        {title: 'Update documentation', status: 'pending' as const, time: '1 day ago'},
        {title: 'Code review for PR #123', status: 'completed' as const, time: '3 hours ago'},
        {title: 'Client presentation prep', status: 'pending' as const, time: '5 hours ago'},
    ];

    return (
        <div className='daakia-recent-tasks'>
            <h3 className='daakia-recent-tasks__title'>{'Recent Tasks'}</h3>
            <div className='daakia-recent-tasks__list'>
                {tasks.map((task, index) => (
                    <TaskItem
                        key={index}
                        title={task.title}
                        status={task.status}
                        time={task.time}
                    />
                ))}
            </div>
        </div>
    );
};

export default DaakiaRecentTasks;