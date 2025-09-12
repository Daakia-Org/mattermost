// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

const HOME_STORAGE_PREFIX = 'home_last_visited_';

export function getLastVisitedHomePage(userId: string, teamName: string): string | null {
    const key = `${HOME_STORAGE_PREFIX}${userId}_${teamName}`;
    return localStorage.getItem(key);
}

export function setLastVisitedHomePage(userId: string, teamName: string, page: string): void {
    const key = `${HOME_STORAGE_PREFIX}${userId}_${teamName}`;
    localStorage.setItem(key, page);
}
