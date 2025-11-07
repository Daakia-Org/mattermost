// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useLocation, useHistory} from 'react-router-dom';

import {Client4} from 'mattermost-redux/client';

import ExternalLink from 'components/external_link';
import ExternalLoginButton from 'components/external_login_button/external_login_button';
import AlternateLinkLayout from 'components/header_footer_route/content_layouts/alternate_link';
import LoginOpenIDIcon from 'components/widgets/icons/login_openid_icon';

import './sso_only_signup.scss';

type SSOOnlySignupProps = {
    openIdButtonText?: string;
    openIdButtonColor?: string;
    siteName?: string;
    termsOfServiceLink?: string;
    privacyPolicyLink?: string;
    onSSOClick: (url: string) => void;
    onBackClick?: () => void;
}

const SSOOnlySignup = ({
    openIdButtonText,
    openIdButtonColor,
    siteName,
    termsOfServiceLink,
    privacyPolicyLink,
    onSSOClick,
    onBackClick,
}: SSOOnlySignupProps) => {
    const intl = useIntl();
    const {formatMessage} = intl;
    const {search} = useLocation();
    const history = useHistory();

    const handleBackClick = () => {
        if (onBackClick) {
            onBackClick();
        } else {
            history.goBack();
        }
    };

    const url = `${Client4.getOAuthRoute()}/openid/signup${search}`;

    const handleSSOClick = (event: React.MouseEvent) => {
        event.preventDefault();
        onSSOClick(url);
    };

    return (
        <div className='sso-only-signup'>
            <div className='sso-only-signup-container'>
                {/* Top right login link */}
                <div className='sso-only-signup-header'>
                    <AlternateLinkLayout
                        className='sso-only-signup-alternate-link'
                        alternateMessage={formatMessage({
                            id: 'signup_user_completed.haveAccount',
                            defaultMessage: 'Already have an account?',
                        })}
                        alternateLinkPath='/login'
                        alternateLinkLabel={formatMessage({
                            id: 'signup_user_completed.signIn',
                            defaultMessage: 'Log in',
                        })}
                    />
                </div>

                {/* Main content card */}
                <div className='sso-only-signup-card'>
                    {/* Back button inside card */}
                    <button
                        className='sso-only-signup-back-button'
                        onClick={handleBackClick}
                    >
                        {'← Back'}
                    </button>
                    <h1 className='sso-only-signup-title'>
                        {formatMessage({id: 'signup_user_completed.title', defaultMessage: 'Let\'s get started'})}
                    </h1>
                    <p className='sso-only-signup-description'>
                        {formatMessage({
                            id: 'signup.sso_only.description',
                            defaultMessage: 'Sign up with your Daakia account to get started.',
                        })}
                    </p>
                    <div className='sso-only-signup-button-container'>
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

                {/* Footer */}
                <div className='sso-only-signup-footer'>
                    <p className='sso-only-signup-footer-text'>
                        <FormattedMessage
                            id='signup.agreement'
                            defaultMessage='By proceeding to create your account and use {siteName}, you agree to our <termsOfUseLink>Terms of Use</termsOfUseLink> and <privacyPolicyLink>Privacy Policy</privacyPolicyLink>.  If you do not agree, you cannot use {siteName}.'
                            values={{
                                siteName: siteName || 'Mattermost',
                                termsOfUseLink: (chunks) => (
                                    <ExternalLink
                                        href={termsOfServiceLink as string}
                                        location='signup-terms-of-use'
                                    >
                                        {chunks}
                                    </ExternalLink>
                                ),
                                privacyPolicyLink: (chunks) => (
                                    <ExternalLink
                                        href={privacyPolicyLink as string}
                                        location='signup-privacy-policy'
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

export default SSOOnlySignup;

