// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import daakiaCircleLogo from 'images/daakiaDlogoCircle.svg';

export default function DaakiaConnectIcon(props: React.HTMLAttributes<HTMLSpanElement>) {
    return (
        <span {...props}>
            <img
                src={daakiaCircleLogo}
                alt='Daakia Connect'
                width='16'
                height='16'
                style={{display: 'block'}}
            />
        </span>
    );
}

