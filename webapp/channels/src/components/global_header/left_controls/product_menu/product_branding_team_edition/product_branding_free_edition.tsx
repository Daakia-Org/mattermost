// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components';

import type {GlobalState} from '@mattermost/types/store';

import {getTheme} from 'mattermost-redux/selectors/entities/preferences';

import KonnectLogoLight from 'images/konnectLogo.png';
import KonnectLogoDark from 'images/konnectLogoDark.png';

const ProductBrandingFreeEditionContainer = styled.span`
    display: flex;
    align-items: center;

    > * + * {
        margin-left: 8px;
    }
`;

const StyledLogo = styled.img`
    height: 25px;
    width: 70px;
    object-fit: contain;
    object-position: left center;
`;

const ProductBrandingFreeEdition = (): JSX.Element => {
    const theme = useSelector((state: GlobalState) => getTheme(state));

    // Determine if we should use dark logo based on theme type
    // Available themes: Quartz (Light), Onyx (Dark), Indigo (Dark)
    // Check if theme type is 'Light (default)' or 'Quartz' for light theme
    const isLightTheme = theme.type === 'Light (default)' || theme.type === 'Quartz';
    const logoSrc = isLightTheme ? KonnectLogoLight : KonnectLogoDark;

    return (
        <ProductBrandingFreeEditionContainer tabIndex={-1}>
            <StyledLogo
                src={logoSrc}
                alt='Konnect'
                height={25}
            />
        </ProductBrandingFreeEditionContainer>
    );
};

export default ProductBrandingFreeEdition;
