// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {FormattedMessage} from 'react-intl';
import {useSelector} from 'react-redux';

import {makeGetFilesForPost} from 'mattermost-redux/selectors/entities/files';
import {getPost} from 'mattermost-redux/selectors/entities/posts';
import {getCurrentUserId, getUser} from 'mattermost-redux/selectors/entities/users';

import {StoragePrefixes} from 'utils/constants';

import type {GlobalState} from 'types/store';

import './quoted_message_preview.scss';

type Props = {
    channelId: string;
    onClose: () => void;
};

const QuotedMessagePreview: React.FC<Props> = ({channelId, onClose}) => {
    const currentUserId = useSelector(getCurrentUserId);

    // Get quoted post from localStorage
    const [quotedPostData, setQuotedPostData] = React.useState<{
        postId: string;
        message: string;
        channelId: string;
        userId: string;
        channelType: string;
    } | null>(null);

    const checkStorage = React.useCallback(() => {
        const storageKey = `${StoragePrefixes.QUOTED_POST}${channelId}`;
        const dataStr = localStorage.getItem(storageKey);
        if (dataStr) {
            try {
                setQuotedPostData(JSON.parse(dataStr));
            } catch (e) {
                // Invalid JSON
                setQuotedPostData(null);
            }
        } else {
            setQuotedPostData(null);
        }
    }, [channelId]);

    React.useEffect(() => {
        checkStorage();

        // Listen for storage changes
        const handleStorageChange = (event: StorageEvent | CustomEvent) => {
            if (event instanceof CustomEvent) {
                // Custom event from dot menu
                if (event.detail?.channelId === channelId) {
                    checkStorage();
                }
            } else if (event instanceof StorageEvent) {
                // Native storage event (for cross-tab sync)
                const storageKey = `${StoragePrefixes.QUOTED_POST}${channelId}`;
                if (event.key === storageKey) {
                    checkStorage();
                }
            }
        };

        window.addEventListener('quotedPostChanged', handleStorageChange as EventListener);
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('quotedPostChanged', handleStorageChange as EventListener);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [channelId, checkStorage]);

    const quotedPost = useSelector((state: GlobalState) => {
        if (!quotedPostData) {
            return null;
        }
        return getPost(state, quotedPostData.postId);
    });
    const selectFilesForPost = React.useMemo(makeGetFilesForPost, []);
    const quotedFiles = useSelector((state: GlobalState) => (quotedPostData ? selectFilesForPost(state, quotedPostData.postId) : []));
    const author = useSelector((state: GlobalState) => {
        if (!quotedPostData) {
            return null;
        }
        return getUser(state, quotedPostData.userId);
    });

    if (!quotedPostData) {
        return null;
    }

    const isOwnMessage = currentUserId === quotedPostData.userId;

    const truncateMessage = (message: string, maxLength = 80) => {
        if (message.length <= maxLength) {
            return message;
        }
        return message.substring(0, maxLength) + '...';
    };

    const displayMessage = quotedPost?.message || quotedPostData.message || '';
    const displayAuthor = author?.username || (
        <FormattedMessage
            id='quoted_message_preview.unknown_user'
            defaultMessage='Unknown User'
        />
    );

    return (
        <div className='QuotedMessagePreview'>
            <div className='QuotedMessagePreview__content'>
                <div className='QuotedMessagePreview__border'/>
                <div className='QuotedMessagePreview__text'>
                    {!isOwnMessage && (
                        <div className='QuotedMessagePreview__author'>
                            {displayAuthor}
                        </div>
                    )}
                    <div className='QuotedMessagePreview__message'>
                        {truncateMessage(displayMessage)}
                    </div>
                    {quotedFiles && quotedFiles.length > 0 && (
                        <div className='QuotedMessagePreview__attachments'>
                            {(() => {
                                const first = quotedFiles[0];
                                const isImage = first?.mime_type?.startsWith('image/');
                                const isVideo = first?.mime_type?.startsWith('video/');
                                const label = first?.name || 'attachment';
                                return (
                                    <div className='QuotedMessagePreview__attachmentItem'>
                                        <span className='QuotedMessagePreview__attachmentBadge'>
                                            {(() => {
                                                if (isImage) {
                                                    return '🖼️';
                                                }
                                                if (isVideo) {
                                                    return '🎬';
                                                }
                                                return '📄';
                                            })()}
                                        </span>
                                        <span className='QuotedMessagePreview__attachmentName'>{label}</span>
                                        {quotedFiles.length > 1 && (
                                            <span className='QuotedMessagePreview__attachmentMore'>{'+' + (quotedFiles.length - 1)}</span>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>
                    )}
                </div>
            </div>
            <button
                className='QuotedMessagePreview__close'
                onClick={onClose}
                aria-label='Close quoted message'
            >
                {'×'}
            </button>
        </div>
    );
};

export default QuotedMessagePreview;
