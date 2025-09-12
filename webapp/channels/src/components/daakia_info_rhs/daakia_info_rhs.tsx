// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {memo} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import styled from 'styled-components';

import {Client4} from 'mattermost-redux/client';
import {getCurrentUser, getStatusForUserId} from 'mattermost-redux/selectors/entities/users';

import {closeRightHandSide} from 'actions/views/rhs';

import ProfilePicture from 'components/profile_picture';
import WithTooltip from 'components/with_tooltip';

import type {GlobalState} from 'types/store';

import './daakia_info_rhs.scss';

const AboutArea = styled.div`
    overflow-wrap: anywhere;
    padding: 24px;
    padding-bottom: 12px;
    font-size: 14px;
    line-height: 20px;
`;

const UserInfoContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 12px;
`;

const UserAvatar = styled.div`
    .status {
        bottom: 0;
        right: 0;
        height: 18px;
        width: 18px;
        & svg {
            min-height: 14.4px;
        }
    }
`;

const UserInfo = styled.div`
    margin-left: 12px;
    display: flex;
    flex-direction: column;
`;

const Username = styled.p`
    font-family: Metropolis, sans-serif;
    font-size: 18px;
    line-height: 24px;
    color: rgb(var(--center-channel-color-rgb));
    font-weight: 600;
    margin: 0;
`;

const UserEmail = styled.div`
    line-height: 20px;
    color: rgba(var(--center-channel-color-rgb), 0.75);
    font-size: 12px;

    p {
        margin-bottom: 0;
    }
`;

const DaakiaInfoRhs = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector(getCurrentUser);
    const userStatus = useSelector((state: GlobalState) => getStatusForUserId(state, currentUser?.id || ''));

    if (!currentUser) {
        return null;
    }

    const displayName = currentUser.first_name && currentUser.last_name ? `${currentUser.first_name} ${currentUser.last_name}` : currentUser.username;

    return (
        <div
            id='rhsContainer'
            className='sidebar-right__body'
        >
            <div className='sidebar--right__header daakia-info-rhs__header'>
                <div className='daakia-info-rhs__header-content'>
                    <div className='daakia-info-rhs__header-content-title'>
                        {'Details'}
                    </div>
                    <div className='daakia-info-rhs__header-content-spacer'/>
                </div>
                <WithTooltip title='Close'>
                    <button
                        id='rhsCloseButton'
                        type='button'
                        className='sidebar--right__close btn btn-icon btn-sm daakia-info-rhs__header-close'
                        onClick={() => dispatch(closeRightHandSide())}
                    >
                        <i className='icon icon-close'/>
                    </button>
                </WithTooltip>
            </div>
            <div className='daakia-info-rhs__description'>
                {'Description'}
            </div>
            <AboutArea>
                <UserInfoContainer>
                    <UserAvatar>
                        <ProfilePicture
                            src={Client4.getProfilePictureUrl(currentUser.id, currentUser.last_picture_update)}
                            status={userStatus}
                            username={displayName}
                            userId={currentUser.id}
                            size='xl'
                        />
                    </UserAvatar>
                    <UserInfo>
                        <Username>{displayName}</Username>
                        {currentUser.email && (
                            <UserEmail>
                                <p>{currentUser.email}</p>
                            </UserEmail>
                        )}
                    </UserInfo>
                </UserInfoContainer>
            </AboutArea>

            <div className='daakia-info-rhs__action-buttons'>
                <button className='daakia-info-rhs__action-buttons-button'>
                    <div>
                        <i className='icon icon-video-outline daakia-info-rhs__action-buttons-button-icon'/>
                    </div>
                    <span>{'Video Call'}</span>
                </button>
                <button className='daakia-info-rhs__action-buttons-button'>
                    <div>
                        <i className='icon icon-calendar-outline daakia-info-rhs__action-buttons-button-icon'/>
                    </div>
                    <span>{'Meetings'}</span>
                </button>
            </div>

            <div className='daakia-info-rhs__notifications'>
                <div className='daakia-info-rhs__notifications-title'>
                    {'Recent Notifications'}
                </div>
                <div className='daakia-info-rhs__notifications-list'>
                    <div className='daakia-info-rhs__notification-item'>
                        <div className='daakia-info-rhs__notification-icon'>
                            <i className='icon icon-bell-outline'/>
                        </div>
                        <div className='daakia-info-rhs__notification-content'>
                            <div className='daakia-info-rhs__notification-text'>
                                {'New message in General channel'}
                            </div>
                            <div className='daakia-info-rhs__notification-time'>
                                {'2 minutes ago'}
                            </div>
                        </div>
                    </div>
                    <div className='daakia-info-rhs__notification-item'>
                        <div className='daakia-info-rhs__notification-icon'>
                            <i className='icon icon-account-plus-outline'/>
                        </div>
                        <div className='daakia-info-rhs__notification-content'>
                            <div className='daakia-info-rhs__notification-text'>
                                {'John joined the team'}
                            </div>
                            <div className='daakia-info-rhs__notification-time'>
                                {'5 minutes ago'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(DaakiaInfoRhs);
