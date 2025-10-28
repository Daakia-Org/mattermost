// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useState} from 'react';
import {Modal} from 'react-bootstrap';
import {FormattedMessage} from 'react-intl';

import type {ClientConfig, ClientLicense} from '@mattermost/types/config';

// import {Client4} from 'mattermost-redux/client'; // Commented out - not used in simplified UI

// import CopyButton from 'components/copy_button'; // Commented out - not used in simplified UI
import ExternalLink from 'components/external_link';
import Nbsp from 'components/html_entities/nbsp';
import MattermostLogo from 'components/widgets/icons/mattermost_logo';

import {AboutLinks} from 'utils/constants';
import {getSkuDisplayName} from 'utils/subscription';

// import {getDesktopVersion, isDesktopApp} from 'utils/user_agent'; // Commented out - not used in simplified UI

import AboutBuildModalCloud from './about_build_modal_cloud/about_build_modal_cloud';

type SocketStatus = {
    connected: boolean;
    serverHostname: string | undefined;
}

type Props = {

    /**
     * Function called after the modal has been hidden
     */
    onExited: () => void;

    /**
     * Global config object
     */
    config: Partial<ClientConfig>;

    /**
     * Global license object
     */
    license: ClientLicense;

    socketStatus: SocketStatus;
};

export default function AboutBuildModal(props: Props) {
    // const intl = useIntl(); // Commented out - not used in simplified UI
    const [show, setShow] = useState(true);

    // const [loadMetric, setLoadMetric] = useState<number | null>(0); // Commented out - not used in simplified UI

    // useEffect(() => { // Commented out - not used in simplified UI
    //     const fetchLoadMetric = async () => {
    //         try {
    //             const result = await Client4.getLicenseLoadMetric();
    //             if (result?.load) {
    //                 setLoadMetric(result.load);
    //             }
    //         } catch (e) {
    //             // eslint-disable-next-line no-console
    //             console.error('Error fetching load metric:', e);
    //         }
    //     };

    //     fetchLoadMetric();
    // }, []);

    const doHide = () => {
        setShow(false);
        props.onExited();
    };

    const config = props.config;
    const license = props.license;

    if (license.Cloud === 'true') {
        return (
            <AboutBuildModalCloud
                {...props}
                show={show}
                doHide={doHide}
            />
        );
    }

    let title = (
        <FormattedMessage
            id='about.teamEditiont0'
            defaultMessage='Team Edition'
        />
    );

    let subTitle = (
        <FormattedMessage
            id='about.teamEditionSt'
            defaultMessage='All your team communication in one place, instantly searchable and accessible anywhere.'
        />
    );

    let learnMore = (
        <div>
            <FormattedMessage
                id='about.teamEditionLearn'
                defaultMessage='Join the Daakia community at '
            />
            <ExternalLink
                location='about_build_modal'
                href='https://www.daakia.co.in/community/'
            >
                {'www.daakia.co.in/community/'}
            </ExternalLink>
        </div>
    );

    let licensee;
    if (config.BuildEnterpriseReady === 'true') {
        title = (
            <FormattedMessage
                id='about.teamEditiont1'
                defaultMessage='Enterprise Edition'
            />
        );

        subTitle = (
            <FormattedMessage
                id='about.enterpriseEditionSt'
                defaultMessage='Modern communication from behind your firewall.'
            />
        );

        if (license.IsLicensed === 'true') {
            // Show the plan name instead of generic "Enterprise Edition"
            const skuName = getSkuDisplayName(license.SkuShortName || '', license.IsGovSku === 'true');
            title = <>{skuName}</>;
            learnMore = (
                <div>
                    <FormattedMessage
                        id='about.enterpriseEditionLearn'
                        defaultMessage='Learn more about Mattermost {planName} at '
                        values={{planName: skuName}}
                    />
                    <ExternalLink
                        location='about_build_modal'
                        href='https://mattermost.com/'
                    >
                        {'mattermost.com'}
                    </ExternalLink>
                </div>
            );
            licensee = (
                <div className='form-group'>
                    <FormattedMessage
                        id='about.licensed'
                        defaultMessage='Licensed to:'
                    />
                    <Nbsp/>{license.Company}
                </div>
            );
        } else {
            learnMore = (
                <div>
                    <FormattedMessage
                        id='about.enterpriseEditionLearn'
                        defaultMessage='Learn more about Daakia Enterprise at '
                    />
                    <ExternalLink
                        location='about_build_modal'
                        href='https://www.daakia.co.in/'
                    >
                        {'www.daakia.co.in'}
                    </ExternalLink>
                </div>
            );
        }
    }

    const termsOfService = (
        <ExternalLink
            location='about_build_modal'
            id='tosLink'
            href={AboutLinks.TERMS_OF_SERVICE}
        >
            <FormattedMessage
                id='about.tos'
                defaultMessage='Terms of Use'
            />
        </ExternalLink>
    );

    const privacyPolicy = (
        <ExternalLink
            id='privacyLink'
            location='about_build_modal'
            href={AboutLinks.PRIVACY_POLICY}
        >
            <FormattedMessage
                id='about.privacy'
                defaultMessage='Privacy Policy'
            />
        </ExternalLink>
    );

    // const getServerVersionString = () => { // Commented out - not used in simplified UI
    //     return intl.formatMessage(
    //         {id: 'about.serverVersion', defaultMessage: 'Server Version:'},
    //     ) + '\u00a0' + (config.BuildNumber === 'dev' ? config.BuildNumber : config.Version);
    // };

    // const getDesktopVersionString = () => { // Commented out - not used in simplified UI
    //     return intl.formatMessage(
    //         {id: 'about.desktopVersion', defaultMessage: 'Desktop Version:'},
    //     ) + '\u00a0' + getDesktopVersion();
    // };

    // const getLoadMetricString = () => { // Commented out - not used in simplified UI
    //     return intl.formatMessage(
    //         {id: 'about.loadmetric', defaultMessage: 'Load Metric:'},
    //     ) + '\u00a0' + loadMetric;
    // };

    // const getDbVersionString = () => { // Commented out - not used in simplified UI
    //     return intl.formatMessage(
    //         {id: 'about.dbversion', defaultMessage: 'Database Schema Version:'},
    //     ) + '\u00a0' + config.SchemaVersion;
    // };

    // const getBuildNumberString = () => { // Commented out - not used in simplified UI
    //     return intl.formatMessage(
    //         {id: 'about.buildnumber', defaultMessage: 'Build Number:'},
    //     ) + '\u00a0' + (config.BuildNumber === 'dev' ? 'n/a' : config.BuildNumber);
    // };

    // const getDatabaseString = () => { // Commented out - not used in simplified UI
    //     return intl.formatMessage(
    //         {id: 'about.database', defaultMessage: 'Database:'},
    //     ) + '\u00a0' + config.SQLDriverName;
    // };

    // const versionInfo = () => { // Commented out - not used in simplified UI
    //     const parts = [
    //         getServerVersionString(),
    //         isDesktopApp() && getDesktopVersionString(),
    //         (loadMetric !== null && loadMetric > 0) && getLoadMetricString(),
    //         getDbVersionString(),
    //         getBuildNumberString(),
    //         getDatabaseString(),
    //     ].filter(Boolean);
    //     return parts.join('\n');
    // };

    // let serverHostname; // Commented out - not used in simplified UI
    // if (!props.socketStatus.connected) {
    //     serverHostname = (
    //         <div>
    //             <FormattedMessage
    //                 id='about.serverHostname'
    //                 defaultMessage='Hostname:'
    //             />
    //             <Nbsp/>
    //             <FormattedMessage
    //                 id='about.serverDisconnected'
    //                 defaultMessage='disconnected'
    //             />
    //         </div>
    //     );
    // } else if (props.socketStatus.serverHostname) {
    //     serverHostname = (
    //         <div>
    //             <FormattedMessage
    //                 id='about.serverHostname'
    //                 defaultMessage='Hostname:'
    //             />
    //             <Nbsp/>
    //             {props.socketStatus.serverHostname}
    //         </div>
    //     );
    // } else {
    //     serverHostname = (
    //         <div>
    //             <FormattedMessage
    //                 id='about.serverHostname'
    //                 defaultMessage='Hostname:'
    //             />
    //             <Nbsp/>
    //             <FormattedMessage
    //                 id='about.serverUnknown'
    //                 defaultMessage='server did not provide hostname'
    //             />
    //         </div>
    //     );
    // }

    return (
        <Modal
            dialogClassName='a11y__modal about-modal'
            show={show}
            onHide={doHide}
            onExited={props.onExited}
            role='dialog'
            aria-labelledby='aboutModalLabel'
        >
            <Modal.Header closeButton={true}>
                <Modal.Title
                    componentClass='h1'
                    id='aboutModalLabel'
                >
                    <FormattedMessage
                        id='about.title'
                        values={{
                            appTitle: config.SiteName || 'Daakia',
                        }}
                        defaultMessage='About {appTitle}'
                    />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='about-modal__content'>
                    <div className='about-modal__logo'>
                        <MattermostLogo/>
                    </div>
                    <div>
                        <h3 className='about-modal__title'>
                            <strong>
                                {config.SiteName || 'Daakia'} {title}
                            </strong>
                        </h3>
                        <p className='about-modal__subtitle pb-2'>
                            {subTitle}
                        </p>
                        {/* Technical details commented out for cleaner UI */}
                        {/* <div className='form-group less'>
                            <div
                                className='about-modal__version-info'
                                data-testid='aboutModalVersionInfo'
                            >
                                {getServerVersionString()}<br/>
                                {isDesktopApp() && (
                                    <>
                                        {getDesktopVersionString()}<br/>
                                    </>
                                )}
                                {(loadMetric !== null && loadMetric > 0) && (
                                    <>
                                        {getLoadMetricString()}<br/>
                                    </>
                                )}
                                {getDbVersionString()}<br/>
                                {getBuildNumberString()}<br/>
                                {getDatabaseString()}<br/>
                                <CopyButton
                                    className='about-modal__version-info-copy-button'
                                    isForText={true}
                                    content={versionInfo()}
                                />
                            </div>
                            {serverHostname}
                        </div> */}
                        {licensee}
                    </div>
                </div>
                <div className='about-modal__footer'>
                    {learnMore}
                    <div className='form-group'>
                        <div className='about-modal__copyright'>
                            <FormattedMessage
                                id='about.copyright'
                                defaultMessage='Copyright 2015 - {currentYear} Daakia, Inc. All rights reserved'
                                values={{
                                    currentYear: new Date().getFullYear(),
                                }}
                            />
                        </div>
                        <div className='about-modal__links'>
                            {termsOfService}
                            {' - '}
                            {privacyPolicy}
                        </div>
                    </div>
                </div>
                <div className='about-modal__notice form-group pt-3'>
                    <p>
                        <FormattedMessage
                            id='about.notice'
                            defaultMessage='Daakia - Modern team communication platform built for enterprise needs.'
                        />
                    </p>
                </div>
                {/* Build hash details commented out for cleaner UI */}
                {/* <div className='about-modal__hash'>
                    <p>
                        <FormattedMessage
                            id='about.hash'
                            defaultMessage='Build Hash:'
                        />
                        <Nbsp/>
                        {config.BuildHash}
                        <br/>
                        <FormattedMessage
                            id='about.hashee'
                            defaultMessage='EE Build Hash:'
                        />
                        <Nbsp/>
                        {config.BuildHashEnterprise}
                    </p>
                    <p>
                        <FormattedMessage
                            id='about.date'
                            defaultMessage='Build Date:'
                        />
                        <Nbsp/>
                        {config.BuildDate}
                    </p>
                </div> */}
            </Modal.Body>
        </Modal>
    );
}
