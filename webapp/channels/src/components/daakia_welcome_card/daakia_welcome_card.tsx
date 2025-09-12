// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import './daakia_welcome_card.scss';

const DaakiaWelcomeCard = () => {
    return (
        <div className='daakia-welcome-card'>
            <div className='daakia-welcome-card__content'>
                <h1 className='daakia-welcome-card__title'>
                    {'Welcome'}
                </h1>
                <p className='daakia-welcome-card__description'>
                    {'Connect and collaborate effectively with people for seamless communication'}
                </p>
            </div>
        </div>
    );
};

export default DaakiaWelcomeCard;