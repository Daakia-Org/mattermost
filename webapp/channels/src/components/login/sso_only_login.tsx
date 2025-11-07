// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useLocation} from 'react-router-dom';

import {Client4} from 'mattermost-redux/client';

import ExternalLink from 'components/external_link';
import ExternalLoginButton from 'components/external_login_button/external_login_button';
import LoginOpenIDIcon from 'components/widgets/icons/login_openid_icon';

import './sso_only_login.scss';

type SSOOnlyLoginProps = {
    openIdButtonText?: string;
    openIdButtonColor?: string;
    termsOfServiceLink?: string;
    privacyPolicyLink?: string;
    onSSOClick: (url: string) => void;
}

const SSOOnlyLogin = ({
    openIdButtonText,
    openIdButtonColor,
    termsOfServiceLink,
    privacyPolicyLink,
    onSSOClick,
}: SSOOnlyLoginProps) => {
    const intl = useIntl();
    const {formatMessage} = intl;
    const {search} = useLocation();

    const url = `${Client4.getOAuthRoute()}/openid/login${search}`;

    const handleSSOClick = (event: React.MouseEvent) => {
        event.preventDefault();
        onSSOClick(url);
    };

    return (
        <div className='sso-only-login'>
            <div className='sso-only-login-content'>
                {/* Centered card */}
                <div className='sso-only-login-card'>
                    <div className='sso-only-login-card-content'>
                        <h1 className='sso-only-login-card-title'>
                            {formatMessage({id: 'sso_only_login.title', defaultMessage: 'Welcome back'})}
                        </h1>
                        <p className='sso-only-login-card-subtitle'>
                            {formatMessage({id: 'sso_only_login.subtitle', defaultMessage: 'Sign in to your Daakia account to access your workspace and collaborate with your team.'})}
                        </p>
                        <div className='sso-only-login-button-container'>
                            <ExternalLoginButton
                                id='openid'
                                url={url}
                                icon={<LoginOpenIDIcon/>}
                                label={openIdButtonText || formatMessage({id: 'login.openid', defaultMessage: 'Daakia Connect'})}
                                style={{color: openIdButtonColor, borderColor: openIdButtonColor}}
                                onClick={handleSSOClick}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className='sso-only-login-footer'>
                    <p className='sso-only-login-footer-text'>
                        <FormattedMessage
                            id='signup.agreement'
                            defaultMessage='By proceeding to create your account and use {siteName}, you agree to our <termsOfUseLink>Terms of Use</termsOfUseLink> and <privacyPolicyLink>Privacy Policy</privacyPolicyLink>. If you do not agree, you cannot use {siteName}.'
                            values={{
                                siteName: 'Daakia',
                                termsOfUseLink: (chunks: React.ReactNode) => (
                                    <ExternalLink
                                        href={termsOfServiceLink as string}
                                        location='login-footer-terms'
                                    >
                                        {chunks}
                                    </ExternalLink>
                                ),
                                privacyPolicyLink: (chunks: React.ReactNode) => (
                                    <ExternalLink
                                        href={privacyPolicyLink as string}
                                        location='login-footer-privacy'
                                    >
                                        {chunks}
                                    </ExternalLink>
                                ),
                            }}
                        />
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SSOOnlyLogin;

