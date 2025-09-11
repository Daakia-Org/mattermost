// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import ChannelInfoButton from 'components/channel_header/channel_info_button';

import './daakia_home_header.scss';

interface Props {
    title: string;
}

const DaakiaHomeHeader: React.FC<Props> = ({title}) => {
    // Create a dummy channel object for the button
    const dummyChannel = {
        id: 'home',
        name: 'home',
        type: 'O',
    } as any;
    return (
        <div
            id='home-header'
            className='channel-header alt'
            role='banner'
        >
            <div className='flex-parent'>
                <div className='flex-child'>
                    <div className='channel-header__info'>
                        <div className='channel-header__title'>
                            <div className='channel-header__top'>
                                <strong className='heading'>{title}</strong>
                            </div>
                        </div>
                    </div>
                </div>
                <ChannelInfoButton channel={dummyChannel}/>
            </div>
        </div>
    );
};

export default DaakiaHomeHeader;