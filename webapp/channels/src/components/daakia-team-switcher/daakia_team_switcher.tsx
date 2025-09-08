// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback, useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import type {DropResult} from 'react-beautiful-dnd';

import {getMyTeams, getCurrentTeamId} from 'mattermost-redux/selectors/entities/teams';
import {getTeamsUnreadStatuses} from 'mattermost-redux/selectors/entities/channels';
import {get} from 'mattermost-redux/selectors/entities/preferences';

import {updateTeamsOrderForUser} from 'actions/team_actions';
import {getCurrentLocale} from 'selectors/i18n';
import {Preferences, Constants} from 'utils/constants';
import {filterAndSortTeamsByDisplayName} from 'utils/team_utils';
import * as Keyboard from 'utils/keyboard';

import TeamIcon from 'components/widgets/team_icon/team_icon';
import WithTooltip from 'components/with_tooltip';
import {ShortcutKeys} from 'components/with_tooltip/tooltip_shortcut';
import * as Utils from 'utils/utils';

import './daakia_team_switcher.scss';

const DaakiaTeamSwitcher: React.FC = () => {
    const myTeams = useSelector(getMyTeams);
    const currentTeamId = useSelector(getCurrentTeamId);
    const [unreadTeamsSet, mentionsInTeamMap] = useSelector(getTeamsUnreadStatuses);
    const locale = useSelector(getCurrentLocale);
    const userTeamsOrderPreference = useSelector((state) => get(state, Preferences.TEAMS_ORDER, '', ''));
    const history = useHistory();
    const dispatch = useDispatch();
    const [showOrder, setShowOrder] = useState(false);
    
    const sortedTeams = filterAndSortTeamsByDisplayName(myTeams, locale, userTeamsOrderPreference);

    const handleTeamClick = useCallback((teamName: string) => {
        history.push(`/${teamName}`);
    }, [history]);

    const onDragEnd = useCallback((result: DropResult) => {
        if (!result.destination) {
            return;
        }

        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;

        const popElement = (list: any[], idx: number) => {
            return [...list.slice(0, idx), ...list.slice(idx + 1, list.length)];
        };

        const pushElement = (list: any[], idx: number, itemId: string) => {
            return [
                ...list.slice(0, idx),
                sortedTeams.find((team) => team.id === itemId)!,
                ...list.slice(idx, list.length),
            ];
        };

        const newTeamsOrder = pushElement(
            popElement(sortedTeams, sourceIndex),
            destinationIndex,
            result.draggableId,
        );
        
        dispatch(updateTeamsOrderForUser(newTeamsOrder.map((team) => team.id)));
    }, [sortedTeams, dispatch]);

    const switchToPrevOrNextTeam = useCallback((e: KeyboardEvent) => {
        if (Keyboard.isKeyPressed(e, Constants.KeyCodes.UP) || Keyboard.isKeyPressed(e, Constants.KeyCodes.DOWN)) {
            e.preventDefault();
            const delta = Keyboard.isKeyPressed(e, Constants.KeyCodes.DOWN) ? 1 : -1;
            const pos = sortedTeams.findIndex((team) => team.id === currentTeamId);
            const newPos = pos + delta;

            let team;
            if (newPos === -1) {
                team = sortedTeams[sortedTeams.length - 1];
            } else if (newPos === sortedTeams.length) {
                team = sortedTeams[0];
            } else {
                team = sortedTeams[newPos];
            }

            handleTeamClick(team.name);
            return true;
        }
        return false;
    }, [sortedTeams, currentTeamId, handleTeamClick]);

    const switchToTeamByNumber = useCallback((e: KeyboardEvent) => {
        const digits = [
            Constants.KeyCodes.ONE,
            Constants.KeyCodes.TWO,
            Constants.KeyCodes.THREE,
            Constants.KeyCodes.FOUR,
            Constants.KeyCodes.FIVE,
            Constants.KeyCodes.SIX,
            Constants.KeyCodes.SEVEN,
            Constants.KeyCodes.EIGHT,
            Constants.KeyCodes.NINE,
            Constants.KeyCodes.ZERO,
        ];

        for (const idx in digits) {
            if (Keyboard.isKeyPressed(e, digits[idx]) && parseInt(idx, 10) < sortedTeams.length) {
                e.preventDefault();

                if (sortedTeams[idx].id === currentTeamId) {
                    return false;
                }
                const team = sortedTeams[idx];
                handleTeamClick(team.name);
                return true;
            }
        }
        return false;
    }, [sortedTeams, currentTeamId, handleTeamClick]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.altKey) {
            if (switchToPrevOrNextTeam(e)) {
                return;
            }

            if (switchToTeamByNumber(e)) {
                return;
            }

            setShowOrder(true);
        }
    }, [switchToPrevOrNextTeam, switchToTeamByNumber]);

    const handleKeyUp = useCallback((e: KeyboardEvent) => {
        if (!((e.ctrlKey || e.metaKey) && e.altKey)) {
            setShowOrder(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleKeyDown, handleKeyUp]);



    return (
        <div className='daakia-team-switcher'>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId='team-switcher' direction='horizontal'>
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className='team-switcher-droppable'
                        >
                            {sortedTeams.map((team, index) => {
                                const isActive = team.id === currentTeamId;
                                const isUnread = unreadTeamsSet.has(team.id);
                                const mentions = mentionsInTeamMap.get(team.id) || 0;
                                const order = index + 1;
                                
                                const shortcut = order < 10 ? {
                                    default: [ShortcutKeys.ctrl, ShortcutKeys.alt, order.toString()],
                                    mac: [ShortcutKeys.cmd, ShortcutKeys.option, order.toString()],
                                } : undefined;

                                return (
                                    <Draggable key={team.id} draggableId={team.id} index={index}>
                                        {(provided, snapshot) => (
                                            <WithTooltip 
                                                title={team.display_name}
                                                shortcut={shortcut}
                                            >
                                                <a
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    href={`/${team.name}`}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleTeamClick(team.name);
                                                    }}
                                                    className={`draggable-team-container inline-block ${snapshot.isDragging ? 'isDragging' : ''}`}
                                                    draggable={false}
                                                >
                                                    <div className={`team-container ${isActive ? 'active' : ''} ${isUnread ? 'unread' : ''}`}>
                                                        <div className='team-btn'>
                                                            {mentions > 0 && (
                                                                <span className='badge badge-max-number pull-right small'>
                                                                    {mentions > 99 ? '99+' : mentions}
                                                                </span>
                                                            )}
                                                            <TeamIcon
                                                                className={isActive ? 'active' : ''}
                                                                withHover={true}
                                                                content={team.display_name}
                                                                url={Utils.imageURLForTeam(team)}
                                                                size='xs'
                                                            />
                                                        </div>
                                                        {showOrder && order < 10 && (
                                                            <div className='order-indicator'>
                                                                {order}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {isUnread && mentions === 0 && (
                                                        <span className='unread-badge'/>
                                                    )}
                                                </a>
                                            </WithTooltip>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default DaakiaTeamSwitcher;