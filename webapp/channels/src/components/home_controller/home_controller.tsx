// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

/* eslint-disable */
import React, {useEffect} from 'react';

import DaakiaHomePage from 'components/daakia_home_page';
import HomeSidebar from 'components/home_sidebar';

import {isInternetExplorer, isEdge} from 'utils/user_agent';

const BODY_CLASS_FOR_HOME = ['app__body', 'channel-view'];

function getClassnamesForBody(platform: string, isMsBrowser = false) {
    const bodyClass = [...BODY_CLASS_FOR_HOME];

    if (platform === 'Win32' || platform === 'Win64') {
        bodyClass.push('os--windows');
    } else if (platform === 'MacIntel' || platform === 'MacPPC') {
        bodyClass.push('os--mac');
    }

    if (isMsBrowser) {
        bodyClass.push('browser--ie');
    }

    return bodyClass;
}

const HomeController = () => {
    useEffect(() => {
        const isMsBrowser = isInternetExplorer() || isEdge();
        const {navigator} = window;
        const platform = (navigator as any)?.userAgentData?.platform || navigator?.platform || 'unknown';
        document.body.classList.add(...getClassnamesForBody(platform, isMsBrowser));

        return () => {
            document.body.classList.remove(...BODY_CLASS_FOR_HOME);
        };
    }, []);

    return (
        <>
            <HomeSidebar />
            <div style={{gridArea: 'center'}}>
                <DaakiaHomePage/>
            </div>
        </>
    );
};

export default HomeController;
