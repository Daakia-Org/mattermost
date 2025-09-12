// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import styled from 'styled-components';

import type {Channel} from '@mattermost/types/channels';

import WithTooltip from 'components/with_tooltip';

interface Props {
    channel: Channel;
    isArchived: boolean;
    isMobile: boolean;
    onClose: () => void;
    onTabChange?: (tab: string) => void;
}

const TabsContainer = styled.div`
    display: flex;
    flex: 1;
    align-self: stretch;
`;

const Tab = styled.button<{active: boolean}>`
    flex: 1;
    padding: 0;
    margin: 0;
    border: none;
    background: ${props => props.active ? 'rgba(var(--button-bg-rgb), 0.08)' : 'transparent'};
    color: ${props => props.active ? 'var(--button-bg)' : 'rgba(var(--center-channel-color-rgb), 0.6)'};
    font-weight: ${props => props.active ? '600' : '400'};
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background: rgba(var(--button-bg-rgb), 0.04);
        color: var(--button-bg);
    }
`;

const Icon = styled.i`
    font-size:12px;
`;

const HeaderTitle = styled.span`
    line-height: 2.4rem;
`;

const Header = ({channel, isArchived, isMobile, onClose, onTabChange}: Props) => {
    const {formatMessage} = useIntl();
    const [activeTab, setActiveTab] = useState('details');

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        onTabChange?.(tab);
    };

    return (
        <div className='sidebar--right__header' style={{display: 'flex', alignItems: 'center'}}>
            {isMobile && (
                <button
                    className='sidebar--right__back btn btn-icon btn-sm'
                    onClick={onClose}
                    aria-label={formatMessage({id: 'rhs_header.back.icon', defaultMessage: 'Back Icon'})}
                >
                    <i
                        className='icon icon-arrow-back-ios'
                    />
                </button>
            )}
            
            <TabsContainer>
                <Tab
                    active={activeTab === 'details'}
                    onClick={() => handleTabChange('details')}
                >
                    Details
                </Tab>
                <Tab
                    active={activeTab === 'history'}
                    onClick={() => handleTabChange('history')}
                >
                    History
                </Tab>
            </TabsContainer>

            <WithTooltip
                title={
                    <FormattedMessage
                        id='rhs_header.closeSidebarTooltip'
                        defaultMessage='Close'
                    />
                }
            >
                <button
                    id='rhsCloseButton'
                    type='button'
                    className='sidebar--right__close btn btn-icon btn-sm'
                    aria-label={formatMessage({id: 'rhs_header.closeTooltip.icon', defaultMessage: 'Close Sidebar Icon'})}
                    onClick={onClose}
                    style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                >
                    <i
                        className='icon icon-close'
                    />
                </button>
            </WithTooltip>
        </div>
    );
};

export default Header;

