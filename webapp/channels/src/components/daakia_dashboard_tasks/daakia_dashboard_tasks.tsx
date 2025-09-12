// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useState} from 'react';

import './daakia_dashboard_tasks.scss';

interface Task {
    id: string;
    title: string;
    date: string;
    time: string;
    tag: string;
    team: string;
    progress: number;
    assignedUsers: Array<{
        id: string;
        name: string;
        avatar: string;
        color: string;
    }>;
}

interface TaskFilter {
    id: string;
    label: string;
    count: number;
    active: boolean;
}

const TaskItem = ({task}: {task: Task}) => (
    <div className='daakia-task-item'>
        <div className='daakia-task-item__header'>
            <h4 className='daakia-task-item__title'>{task.title}</h4>
            <div className='daakia-task-item__meta'>
                <span className='daakia-task-item__date'>{task.date}</span>
                <span className='daakia-task-item__time'>{task.time}</span>
            </div>
        </div>
        
        <div className='daakia-task-item__details'>
            <div className='daakia-task-item__tag'>
                <i className='icon icon-flag'/>
                <span>{task.tag}</span>
            </div>
            <div className='daakia-task-item__team'>
                <i className='icon icon-account-group'/>
                <span>{task.team}</span>
            </div>
        </div>

        <div className='daakia-task-item__progress'>
            <div className='daakia-task-item__progress-bar'>
                <div 
                    className='daakia-task-item__progress-fill'
                    style={{width: `${task.progress}%`}}
                />
            </div>
            <span className='daakia-task-item__progress-text'>{task.progress}%</span>
        </div>

        <div className='daakia-task-item__assignees'>
            {task.assignedUsers.map((user) => (
                <div 
                    key={user.id}
                    className='daakia-task-item__assignee'
                    style={{backgroundColor: user.color}}
                >
                    {user.avatar ? (
                        <img src={user.avatar} alt={user.name} />
                    ) : (
                        <span>{user.name.charAt(0)}</span>
                    )}
                </div>
            ))}
        </div>
    </div>
);

const DaakiaDashboardTasks = () => {
    const [activeFilter, setActiveFilter] = useState('new');

    const filters: TaskFilter[] = [
        {id: 'new', label: 'New Tasks', count: 4, active: activeFilter === 'new'},
        {id: 'in-progress', label: 'In Progress', count: 3, active: activeFilter === 'in-progress'},
        {id: 'completed', label: 'Completed', count: 1, active: activeFilter === 'completed'},
    ];

    const tasks: Task[] = [
        {
            id: '1',
            title: 'Complete UX for new landing page',
            date: '6th July 2023',
            time: '9:30 pm',
            tag: 'Designing',
            team: 'Team 1',
            progress: 70,
            assignedUsers: [
                {id: '1', name: 'T', avatar: '', color: '#8B5CF6'},
                {id: '2', name: 'J', avatar: '', color: '#10B981'},
            ],
        },
        {
            id: '2',
            title: 'Complete UX for new landing page',
            date: '6th July 2023',
            time: '9:30 pm',
            tag: 'No Tag',
            team: 'Team 3',
            progress: 0,
            assignedUsers: [
                {id: '1', name: 'T', avatar: '', color: '#8B5CF6'},
                {id: '2', name: 'J', avatar: '', color: '#10B981'},
            ],
        },
        {
            id: '3',
            title: 'Zoom call with developers team',
            date: '6th July 2023',
            time: '9:30 pm',
            tag: 'Developer',
            team: 'Your Task',
            progress: 10,
            assignedUsers: [
                {id: '3', name: 'Dev', avatar: 'https://via.placeholder.com/32', color: '#3B82F6'},
            ],
        },
    ];

    return (
        <div className='daakia-dashboard-tasks'>
            <div className='daakia-dashboard-tasks__header'>
                <h3 className='daakia-dashboard-tasks__title'>
                    {'Recent Tasks'}
                </h3>
                <div className='daakia-dashboard-tasks__actions'>
                    <button className='daakia-dashboard-tasks__add-btn'>
                        <i className='icon icon-plus'/>
                    </button>
                    <a href='#' className='daakia-dashboard-tasks__see-all'>
                        {'See all'}
                    </a>
                </div>
            </div>

            <div className='daakia-dashboard-tasks__filters'>
                {filters.map((filter) => (
                    <button
                        key={filter.id}
                        className={`daakia-dashboard-tasks__filter ${
                            filter.active ? 'daakia-dashboard-tasks__filter--active' : ''
                        }`}
                        onClick={() => setActiveFilter(filter.id)}
                    >
                        {filter.count} {filter.label}
                    </button>
                ))}
            </div>

            <div className='daakia-dashboard-tasks__list'>
                {tasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                ))}
            </div>
        </div>
    );
};

export default DaakiaDashboardTasks;
