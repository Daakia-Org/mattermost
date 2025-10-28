// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {PureComponent} from 'react';
import {FormattedMessage} from 'react-intl';

import BrowserStore from 'stores/browser_store';

import ExternalLink from 'components/external_link';

import desktopImg from 'images/deep-linking/deeplinking-desktop-img.png';
import mobileImg from 'images/deep-linking/deeplinking-mobile-img.png';
import DaakiaLogo from 'components/common/svg_images_components/logo_dark_blue_svg';
import {LandingPreferenceTypes} from 'utils/constants';
import * as UserAgent from 'utils/user_agent';
import * as Utils from 'utils/utils';

type Props = {
    defaultTheme: any;
    desktopAppLink?: string;
    iosAppLink?: string;
    androidAppLink?: string;
    siteUrl?: string;
    siteName?: string;
    brandImageUrl?: string;
    enableCustomBrand: boolean;
}

type State = {
    rememberChecked: boolean;
    redirectPage: boolean;
    location: string;
    nativeLocation: string;
    brandImageError: boolean;
    navigating: boolean;
}

export default class LinkingLandingPage extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        const location = window.location.href.replace('/landing#', '');

        this.state = {
            rememberChecked: false,
            redirectPage: false,
            location,
            nativeLocation: location.replace(/^(https|http)/, 'daakia'),
            brandImageError: false,
            navigating: false,
        };

        if (!BrowserStore.hasSeenLandingPage()) {
            BrowserStore.setLandingPageSeen(true);
        }
    }

    componentDidMount() {
        Utils.applyTheme(this.props.defaultTheme);
        if (this.checkLandingPreferenceApp()) {
            this.openMattermostApp();
        }

        window.addEventListener('beforeunload', this.clearLandingPreferenceIfNotChecked);
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.clearLandingPreferenceIfNotChecked);
    }

    clearLandingPreferenceIfNotChecked = () => {
        if (!this.state.navigating && !this.state.rememberChecked) {
            BrowserStore.clearLandingPreference(this.props.siteUrl);
        }
    };

    checkLandingPreferenceBrowser = () => {
        const landingPreference = BrowserStore.getLandingPreference(this.props.siteUrl);
        return landingPreference && landingPreference === LandingPreferenceTypes.BROWSER;
    };

    isEmbedded = () => {
        // this cookie is set by any plugin that facilitates iframe embedding (e.g. mattermost-plugin-msteams-sync).
        const cookieName = 'MMEMBED';
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(cookieName + '=')) {
                const value = cookie.substring(cookieName.length + 1);
                return decodeURIComponent(value) === '1';
            }
        }
        return false;
    };

    checkLandingPreferenceApp = () => {
        const landingPreference = BrowserStore.getLandingPreference(this.props.siteUrl);
        return landingPreference && landingPreference === LandingPreferenceTypes.MATTERMOSTAPP;
    };

    handleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({rememberChecked: e.target.checked});

        // If it was checked, and now we're unchecking it, clear the preference
        if (!e.target.checked) {
            BrowserStore.clearLandingPreference(this.props.siteUrl);
        }
    };

    setPreference = (pref: string, clearIfNotChecked?: boolean) => {
        if (!this.state.rememberChecked) {
            if (clearIfNotChecked) {
                BrowserStore.clearLandingPreference(this.props.siteUrl);
            }
            return;
        }

        switch (pref) {
        case LandingPreferenceTypes.MATTERMOSTAPP:
            BrowserStore.setLandingPreferenceToMattermostApp(this.props.siteUrl);
            break;
        case LandingPreferenceTypes.BROWSER:
            BrowserStore.setLandingPreferenceToBrowser(this.props.siteUrl);
            break;
        default:
            break;
        }
    };

    openMattermostApp = () => {
        this.setPreference(LandingPreferenceTypes.MATTERMOSTAPP);
        this.setState({redirectPage: true});
        window.location.href = this.state.nativeLocation;
    };

    openInBrowser = () => {
        this.setPreference(LandingPreferenceTypes.BROWSER);
        window.location.href = this.state.location;
    };

    renderSystemDialogMessage = () => {
        const isMobile = UserAgent.isMobile();

        if (isMobile) {
            return (
                <FormattedMessage
                    id='get_app.systemDialogMessageMobile'
                    defaultMessage='View in App'
                />
            );
        }

        return (
            <FormattedMessage
                id='get_app.systemDialogMessage'
                defaultMessage='View in Desktop App'
            />
        );
    };

    renderGoNativeAppMessage = () => {
        return (
            <a
                href={UserAgent.isMobile() ? '#' : this.state.nativeLocation}
                onMouseDown={() => {
                    this.setPreference(LandingPreferenceTypes.MATTERMOSTAPP, true);
                }}
                onClick={() => {
                    this.setPreference(LandingPreferenceTypes.MATTERMOSTAPP, true);
                    this.setState({redirectPage: true, navigating: true});
                    if (UserAgent.isMobile()) {
                        if (UserAgent.isAndroidWeb()) {
                            const timeout = setTimeout(() => {
                                window.location.replace(this.getDownloadLink()!);
                            }, 2000);
                            window.addEventListener('blur', () => {
                                clearTimeout(timeout);
                            });
                        }
                        window.location.replace(this.state.nativeLocation);
                    }
                }}
                className='btn btn-primary btn-lg get-app__download'
            >
                {this.renderSystemDialogMessage()}
            </a>
        );
    };

    getDownloadLink = () => {
        if (UserAgent.isIosWeb()) {
            return this.props.iosAppLink;
        } else if (UserAgent.isAndroidWeb()) {
            return this.props.androidAppLink;
        }

        return this.props.desktopAppLink;
    };

    handleBrandImageError = () => {
        this.setState({brandImageError: true});
    };

    renderGraphic = () => {
        const isMobile = UserAgent.isMobile();

        if (isMobile) {
            return (
                <img src={mobileImg}/>
            );
        }

        return (
            <img src={desktopImg}/>
        );
    };

    renderDownloadLinkText = () => {
        const isMobile = UserAgent.isMobile();

        if (isMobile) {
            return (
                <FormattedMessage
                    id='get_app.dontHaveTheMobileApp'
                    defaultMessage={'Don\'t have the Mobile App?'}
                />
            );
        }

        return (
            <FormattedMessage
                id='get_app.dontHaveTheDesktopApp'
                defaultMessage={'Don\'t have the Desktop App?'}
            />
        );
    };

    renderDownloadLinkSection = () => {
        // const downloadLink = this.getDownloadLink();

        if (this.state.redirectPage) {
            return (
                <div className='get-app__download-link'>
                    <FormattedMessage
                        id='getApp.downloadLinkInBrowser'
                        defaultMessage='Or, <a>open this link in your browser</a>.'
                        values={{
                            a: (chunks) => (
                                <ExternalLink
                                    href={this.state.location}
                                    location='landingPage'
                                >
                                    {chunks}
                                </ExternalLink>
                            ),
                        }}
                    />
                </div>
            );
        }
        // Download options removed - Coming Soon
        // else if (downloadLink) {
        //     return (
        //         <div className='get-app__download-link'>
        //             {this.renderDownloadLinkText()}
        //             {'\u00A0'}
        //             <br/>
        //             <a href={downloadLink}>
        //                 <FormattedMessage
        //                     id='get_app.downloadTheAppNow'
        //                     defaultMessage='Download the app now.'
        //                 />
        //             </a>
        //         </div>
        //     );
        // }

        return (
            <div className='get-app__download-link'>
                <span>Desktop App - Coming Soon</span>
            </div>
        );
    };

    renderDialogHeader = () => {
        const downloadLink = this.getDownloadLink();
        const isMobile = UserAgent.isMobile();

        let openingLink = (
            <FormattedMessage
                id='get_app.openingLink'
                defaultMessage='Opening link in Daakia...'
            />
        );
        if (this.props.enableCustomBrand) {
            openingLink = (
                <FormattedMessage
                    id='get_app.openingLinkWhiteLabel'
                    defaultMessage='Opening link in {appName}...'
                    values={{
                        appName: this.props.siteName || 'Daakia',
                    }}
                />
            );
        }

        if (this.state.redirectPage) {
            return (
                <h1 className='get-app__launching'>
                    {openingLink}
                    <div className={`get-app__alternative${this.state.redirectPage ? ' redirect-page' : ''}`}>
                        <FormattedMessage
                            id='get_app.redirectedInMoments'
                            defaultMessage='You will be redirected in a few moments.'
                        />
                        <br/>
                        <span>Desktop App - Coming Soon</span>
                    </div>
                </h1>
            );
        }

        let viewApp = (
            <FormattedMessage
                id='get_app.ifNothingPrompts'
                defaultMessage='YYour workspace is ready—connect, collaborate, and get things done seamlessly'
            />
        );
        if (isMobile) {
            viewApp = (
                <FormattedMessage
                    id='get_app.ifNothingPromptsMobile'
                    defaultMessage='YYour workspace is ready—connect, collaborate, and get things done seamlessly'
                />
            );
        }

        return (
            <div className='get-app__launching'>
                <FormattedMessage
                    id='get_app.launching'
                    tagName='h1'
                    defaultMessage='Welcome to Daakia'
                />
                {/* <div className='get-app__alternative'>
                    {viewApp}
                </div> */}
            </div>
        );
    };

    renderDialogBody = () => {
        if (this.state.redirectPage) {
            return (
                <div className='get-app__dialog-body'>
                    {this.renderDialogHeader()}
                    {this.renderDownloadLinkSection()}
                </div>
            );
        }

        return (
            <div className='get-app__dialog-body'>
                {this.renderDialogHeader()}
                <div className='get-app__buttons'>
                    <a
                        href={this.state.location}
                        onMouseDown={() => {
                            this.setPreference(LandingPreferenceTypes.BROWSER, true);
                        }}
                        onClick={() => {
                            this.setPreference(LandingPreferenceTypes.BROWSER, true);
                            this.setState({navigating: true});
                        }}
                        className='btn btn-primary btn-lg'
                    >
                        <FormattedMessage
                            id='get_app.continueToBrowser'
                            defaultMessage='View in Browser'
                        />
                    </a>
                </div>
                <label className='get-app__preference'>
                    <input
                        type='checkbox'
                        checked={this.state.rememberChecked}
                        className='get-app__checkbox'
                        onChange={this.handleChecked}
                    />
                    <FormattedMessage
                        id='get_app.rememberMyPreference'
                        defaultMessage='Remember my preference'
                    />
                </label>
                {/* Download section commented out - Coming Soon */}
                {/* {this.renderDownloadLinkSection()} */}
            </div>
        );
    };

    renderHeader = () => {
        let header = (
            <div className='get-app__header'>
                <DaakiaLogo
                    className='get-app__logo'
                    width={120}
                    height={40}
                />
            </div>
        );
        if (this.props.enableCustomBrand && this.props.brandImageUrl) {
            let customLogo;
            if (this.props.brandImageUrl && !this.state.brandImageError) {
                customLogo = (
                    <img
                        src={this.props.brandImageUrl}
                        onError={this.handleBrandImageError}
                        className='get-app__custom-logo'
                    />
                );
            }

            header = (
                <div className='get-app__header'>
                    {customLogo}
                    <div className='get-app__custom-site-name'>
                        <span>{this.props.siteName}</span>
                    </div>
                </div>
            );
        }

        return header;
    };

    render() {
        const isMobile = UserAgent.isMobile();

        if (this.checkLandingPreferenceBrowser() || this.isEmbedded()) {
            this.openInBrowser();
            return null;
        }

        return (
            <div className='get-app'>
                {this.renderHeader()}
                <div className='get-app__dialog'>
                    <div
                        className={`get-app__graphic ${isMobile ? 'mobile' : ''}`}
                    >
                        {this.renderGraphic()}
                    </div>
                    {this.renderDialogBody()}
                </div>
            </div>
        );
    }
}
