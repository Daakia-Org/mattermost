// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import classNames from 'classnames';
import React from 'react';
import {useSelector} from 'react-redux';
import {Link} from 'react-router-dom';

import type {GlobalState} from '@mattermost/types/store';

import {getConfig, getLicense} from 'mattermost-redux/selectors/entities/general';
import {getTheme} from 'mattermost-redux/selectors/entities/preferences';

import BackButton from 'components/common/back_button';

import KonnectLogoLight from 'images/konnectLogo.png';
import KonnectLogoDark from 'images/konnectLogoDark.png';
import './header.scss';
import {LicenseSkus} from 'utils/constants';

export type HeaderProps = {
    alternateLink?: React.ReactElement;
    backButtonURL?: string;
    onBackButtonClick?: React.EventHandler<React.MouseEvent>;
}

const Header = ({alternateLink, backButtonURL, onBackButtonClick}: HeaderProps) => {
    const {SiteName} = useSelector(getConfig);
    const license = useSelector(getLicense);
    const theme = useSelector((state: GlobalState) => getTheme(state));

    const ariaLabel = SiteName || 'Daakia';

    // Determine if we should use dark logo based on theme type
    // Available themes: Quartz (Light), Onyx (Dark), Indigo (Dark)
    const isLightTheme = theme.type === 'Light (default)' || theme.type === 'Quartz';
    const logoSrc = isLightTheme ? KonnectLogoLight : KonnectLogoDark;

    const LogoImage = () => (
        <img
            src={logoSrc}
            alt='Konnect'
            width={80}
            height={41}
            style={{objectFit: 'contain'}}
        />
    );

    let freeBanner = null;
    if (license.IsLicensed === 'false') {
        freeBanner = <><LogoImage/><span className='freeBadge'>{'TEAM EDITION'}</span></>;
    } else if (license.SkuShortName === LicenseSkus.Entry) {
        freeBanner = <><LogoImage/><span className='freeBadge'>{'ENTRY EDITION'}</span></>;
    }

    let title: React.ReactNode = SiteName;
    if (title === 'Mattermost' || title === 'Daakia') {
        if (freeBanner) {
            title = '';
        } else {
            title = <LogoImage/>;
        }
    }

    return (
        <div className={classNames('hfroute-header', {'has-free-banner': freeBanner, 'has-custom-site-name': title})}>
            <div className='header-main'>
                <div>
                    {freeBanner &&
                        <Link
                            className='header-logo-link'
                            to='/'
                            aria-label={ariaLabel}
                        >
                            {freeBanner}
                        </Link>
                    }
                    {title &&
                        <Link
                            className='header-logo-link'
                            to='/'
                            aria-label={ariaLabel}
                        >
                            {title}
                        </Link>
                    }
                </div>
                {alternateLink}
            </div>
            {onBackButtonClick && (
                <BackButton
                    className='header-back-button'
                    url={backButtonURL}
                    onClick={onBackButtonClick}
                />
            )}
        </div>
    );
};

export default Header;
