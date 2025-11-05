// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {FormattedMessage} from 'react-intl';
import {useSelector} from 'react-redux';

import {makeGetFilesForPost} from 'mattermost-redux/selectors/entities/files';
import {getPost} from 'mattermost-redux/selectors/entities/posts';
import {getCurrentUserId, getUser} from 'mattermost-redux/selectors/entities/users';

import type {GlobalState} from 'types/store';

import './quoted_message_display.scss';

type Props = {
    quotedPostId: string;
    quotedMessage?: string;
    quotedUserId?: string;
    currentUserId?: string;
    onClick?: () => void;
};

const QuotedMessageDisplayComponent: React.FC<Props> = ({quotedPostId, quotedMessage, quotedUserId, currentUserId, onClick}) => {
    const terminalQuotedPost = useSelector((state: GlobalState) => {
        const currentId: string | null = quotedPostId;
        let current = currentId ? getPost(state, currentId) : null;
        let steps = 0;
        while (steps < 5 && current) { // safety limit
            const nextId = typeof current.props?.quoted_post_id === 'string' ? current.props.quoted_post_id : null;
            if (!nextId) {
                break;
            }
            const next = getPost(state, nextId);
            if (!next) {
                break;
            }
            current = next;
            steps++;
        }
        return current;
    });
    const currentUserIdFromState = useSelector(getCurrentUserId);
    const userId = currentUserId || currentUserIdFromState;
    const author = useSelector((state: GlobalState) => getUser(state, terminalQuotedPost?.user_id || quotedUserId || ''));
    const isOwnMessage = userId === (terminalQuotedPost?.user_id || quotedUserId);
    const selectFilesForPost = React.useMemo(makeGetFilesForPost, []);
    const terminalFiles = useSelector((state: GlobalState) => (terminalQuotedPost ? selectFilesForPost(state, terminalQuotedPost.id) : []));

    const handleClick = () => {
        if (onClick) {
            onClick();
            return;
        }

        if (terminalQuotedPost) {
            const element = document.getElementById(`${terminalQuotedPost.id}_message`);
            if (element) {
                element.scrollIntoView({behavior: 'smooth', block: 'center'});
                element.classList.add('highlight');
                setTimeout(() => element.classList.remove('highlight'), 2000);
            }
        }
    };

    const displayMessage = terminalQuotedPost?.message || quotedMessage || '';
    const displayAuthor = author?.username || (
        <FormattedMessage
            id='quoted_message_display.unknown_user'
            defaultMessage='Unknown User'
        />
    );

    return (
        <div
            className='QuotedMessageDisplay'
            onClick={handleClick}
            role='button'
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick();
                }
            }}
        >
            <div className='QuotedMessageDisplay__border'/>
            <div className='QuotedMessageDisplay__text'>
                {!isOwnMessage && (
                    <div className='QuotedMessageDisplay__author'>
                        {displayAuthor}
                    </div>
                )}
                <div className='QuotedMessageDisplay__message'>
                    {displayMessage}
                </div>
                {terminalFiles && terminalFiles.length > 0 && (
                    <div className='QuotedMessageDisplay__attachments'>
                        {(() => {
                            const first = terminalFiles[0];
                            const isImage = first?.mime_type?.startsWith('image/');
                            const isVideo = first?.mime_type?.startsWith('video/');
                            const label = first?.name || 'attachment';
                            let badge = '📄';
                            if (isImage) {
                                badge = '🖼️';
                            } else if (isVideo) {
                                badge = '🎬';
                            }

                            return (
                                <div className='QuotedMessageDisplay__attachmentItem'>
                                    <span className='QuotedMessageDisplay__attachmentBadge'>{badge}</span>
                                    <span className='QuotedMessageDisplay__attachmentName'>{label}</span>
                                    {terminalFiles.length > 1 && (
                                        <span className='QuotedMessageDisplay__attachmentMore'>{'+' + (terminalFiles.length - 1)}</span>
                                    )}
                                </div>
                            );
                        })()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuotedMessageDisplayComponent;
