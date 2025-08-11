// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useEffect} from 'react';
import {useIntl} from 'react-intl';
import {useSelector} from 'react-redux';

import {getConfig} from 'mattermost-redux/selectors/entities/general';

import ExternalLink from 'components/external_link';

type Props = {
    children?: React.ReactNode | React.ReactNodeArray;
}

const HeaderFooterNotLoggedIn = (props: Props) => {
    const intl = useIntl();
    const {formatMessage} = intl;
    const config = useSelector(getConfig);

    useEffect(() => {
        document.body.classList.add('sticky');
        const rootElement: HTMLElement | null = document.getElementById('root');
        if (rootElement) {
            rootElement.classList.add('container-fluid');
        }

        return () => {
            document.body.classList.remove('sticky');
            const rootElement: HTMLElement | null = document.getElementById('root');
            if (rootElement) {
                rootElement.classList.remove('container-fluid');
            }
        };
    }, []);

    if (!config) {
        return null;
    }

    const content = [];

    // Always show About link with Daakia URL
    content.push(
        <ExternalLink
            key='about_link'
            id='about_link'
            className='footer-link'
            location='header_footer_template'
            href='https://www.daakia.co.in/about-us'
        >
            {formatMessage({id: 'web.footer.about', defaultMessage: 'About'})}
        </ExternalLink>,
    );

    // Always show Privacy Policy link with Daakia URL
    content.push(
        <ExternalLink
            key='privacy_link'
            id='privacy_link'
            className='footer-link'
            location='header_footer_template'
            href='https://www.daakia.co.in/privacy-policy'
        >
            {formatMessage({id: 'web.footer.privacy', defaultMessage: 'Privacy Policy'})}
        </ExternalLink>,
    );

    return (
        <div className='inner-wrap'>
            <div className='row content'>
                {props.children}
            </div>
            <div className='row footer'>
                <div
                    id='footer_section'
                    className='footer-pane col-xs-12'
                >
                    <div className='col-xs-12'>
                        <span
                            id='company_name'
                            className='pull-right footer-site-name'
                        >
                            {'Daakia'}
                        </span>
                    </div>
                    <div className='col-xs-12'>
                        <span
                            id='copyright'
                            className='pull-right footer-link copyright'
                        >
                            {`© 2015-${new Date().getFullYear()} Daakia, Inc.`}
                        </span>
                        <span className='pull-right'>
                            {content}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeaderFooterNotLoggedIn;
