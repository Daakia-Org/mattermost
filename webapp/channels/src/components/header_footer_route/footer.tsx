// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {useIntl} from 'react-intl';
import {useSelector} from 'react-redux';

import {getConfig} from 'mattermost-redux/selectors/entities/general';

import './footer.scss';
import ExternalLink from 'components/external_link';

const Footer = () => {
    const {formatMessage} = useIntl();

    // Hardcoded custom links
    const customAboutLink = 'https://www.daakia.co.in/about-us';
    const customPrivacyLink = 'https://www.daakia.co.in/privacy-policy';

    // Check if MMEMBED cookie is set and if so, don't show the footer
    if (document.cookie.includes('MMEMBED=1')) {
        return null;
    }

    return (
        <div className='hfroute-footer'>
            <span
                key='footer-copyright'
                className='footer-copyright'
            >
                {`© ${new Date().getFullYear()} Dakiaa Inc.`}
            </span>
            <ExternalLink
                key='footer-link-about'
                className='footer-link'
                href={customAboutLink}
                location='footer'
            >
                {formatMessage({id: 'web.footer.about', defaultMessage: 'About'})}
            </ExternalLink>
            <ExternalLink
                key='footer-link-privacy'
                className='footer-link'
                href={customPrivacyLink}
                location='footer'
            >
                {formatMessage({id: 'web.footer.privacy', defaultMessage: 'Privacy Policy'})}
            </ExternalLink>
        </div>
    );
};

export default Footer;
