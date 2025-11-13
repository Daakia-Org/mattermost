// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

export const FEEDBACK_EMAIL = 'test@example.com';
export const ABOUT_LINK = 'https://www.daakia.co.in/about-us';
export const ASK_COMMUNITY_LINK = 'https://www.daakia.co.in/contact-us';
export const HELP_LINK = 'https://www.daakia.co.in/contact-us';
export const PRIVACY_POLICY_LINK = 'https://www.daakia.co.in/privacy-policy';
export const REPORT_A_PROBLEM_LINK = 'https://www.daakia.co.in/contact-us';
export const TERMS_OF_SERVICE_LINK = 'https://www.daakia.co.in/end-user-agreement';
export const MATTERMOST_USER_GUIDE = 'https://docs.daakia.co.in/guides/use-daakia';

export const CLOUD = 'Cloud';
export const E20 = 'E20';
export const TEAM = 'Team';

export const FixedPublicLinks = {
    TermsOfService: 'https://www.daakia.co.in/end-user-agreement',
    PrivacyPolicy: 'https://www.daakia.co.in/privacy-policy',
};

export const SupportSettings = {
    ABOUT_LINK,
    ASK_COMMUNITY_LINK,
    HELP_LINK,
    PRIVACY_POLICY_LINK,
    REPORT_A_PROBLEM_LINK,
    TERMS_OF_SERVICE_LINK,
    MATTERMOST_USER_GUIDE,
};

export const FixedCloudConfig = {
    EmailSettings: {
        FEEDBACK_EMAIL,
    },
    SupportSettings,
};

export const ServerEdition = {
    CLOUD,
    E20,
    TEAM,
};

export const Constants = {
    FixedCloudConfig,
    ServerEdition,
};

export const CustomStatusDuration = {
    DONT_CLEAR: '',
    THIRTY_MINUTES: 'thirty_minutes',
    ONE_HOUR: 'one_hour',
    FOUR_HOURS: 'four_hours',
    TODAY: 'today',
    THIS_WEEK: 'this_week',
    DATE_AND_TIME: 'date_and_time',
};

export default Constants;
