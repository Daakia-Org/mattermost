// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import './simple_team_button.scss';

interface Props {
    id: string;
    icon: string;
    tooltip: string;
    active: boolean;
    disabled?: boolean;
    onClick?: (e: React.MouseEvent) => void;
}

const SimpleTeamButton: React.FC<Props> = ({
    id,
    icon,
    tooltip,
    active,
    disabled = false,
    onClick,
}) => {
    return (
        <div
            key={id}
            className='simple-team-button-container'
            style={{marginBottom: '12px'}}
        >
            <div className={`simple-team-button ${active ? 'active' : ''} ${disabled ? 'disabled' : ''}`}>
                <button
                    className='simple-team-btn'
                    title={tooltip}
                    disabled={disabled}
                    onClick={disabled ? undefined : onClick}
                >
                    <i
                        className={`${icon.startsWith('fa-') ? 'fa ' + icon + ' fa-lg' : 'icon ' + icon}`}
                        role='img'
                        aria-label={`${tooltip} Icon`}
                    />
                </button>
            </div>
        </div>
    );
};

export default SimpleTeamButton;
