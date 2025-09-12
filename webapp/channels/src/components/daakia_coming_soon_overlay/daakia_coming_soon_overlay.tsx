// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import './daakia_coming_soon_overlay.scss';

const DaakiaComingSoonOverlay = () => {
    return (
        <div className='daakia-coming-soon-overlay'>
            <div className='daakia-coming-soon-overlay__content'>
                <div className='daakia-coming-soon-overlay__icon'>
                    <i className='icon icon-clock-outline'/>
                </div>
                <h2 className='daakia-coming-soon-overlay__title'>
                    {'Coming Soon'}
                </h2>
                <p className='daakia-coming-soon-overlay__description'>
                    {'This feature is currently under development and will be available soon.'}
                </p>
            </div>
        </div>
    );
};

export default DaakiaComingSoonOverlay;
