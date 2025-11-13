# Konnect by Daakia - Customization Documentation

## Overview
This document details all modifications made to customize the Mattermost codebase for "Konnect by Daakia" branding. This includes hiding UI elements, changing text, disabling features, and modifying limits.

**Total Files Modified:** 24 files

**Last Updated:** November 13, 2025

---

## Table of Contents
1. [Frontend Changes (Webapp)](#frontend-changes-webapp)
   - [Hidden UI Elements](#hidden-ui-elements)
   - [Text & Branding Changes](#text--branding-changes)
   - [Disabled Features](#disabled-features)
2. [Backend Changes (Server)](#backend-changes-server)
3. [Configuration Files](#configuration-files)
4. [Summary of All Changes](#summary-of-all-changes)

---

## Frontend Changes (Webapp)

### Hidden UI Elements

#### 1. Team Menu - "Invite People" Menu Item
**File:** `webapp/channels/src/components/sidebar/sidebar_header/sidebar_team_menu.tsx`

**Line:** ~149-170

**Change:**
```tsx
<Menu.Item
    onClick={handleClick}
    leadingElement={(
        <AccountMultiplePlusOutlineIcon
            size={18}
            aria-hidden='true'
        />
    )}
    labels={(
        <>
            <FormattedMessage
                id='sidebarLeft.teamMenu.invitePeopleMenuItem.primaryLabel'
                defaultMessage='Invite people'
            />
            <FormattedMessage
                id='sidebarLeft.teamMenu.invitePeopleMenuItem.secondaryLabel'
                defaultMessage='Add or invite people to the team'
            />
        </>
    )}
    aria-haspopup='dialog'
    className='invite-people-menu-item-hidden'  // ← ADDED
    {...props}
/>
```

**CSS:** `webapp/channels/src/components/sidebar/sidebar_header/sidebar_header.scss`
```scss
// Hide "Invite people" menu items
.invite-people-menu-item-hidden {
    display: none !important;
}
```

**Reason:** Remove invite functionality from team menu.

---

#### 2. Sidebar - "Invite Members" Button
**File:** `webapp/channels/src/sass/layout/_sidebar-left.scss`

**Change:**
```scss
#inviteMembersButton {
    display: none !important;
}
```

**Reason:** Hide the invite members button in the left sidebar channel navigator.

---

#### 3. Browse/Add Channel Menu - "Invite People" & Separator
**File:** `webapp/channels/src/components/sidebar/sidebar_header/sidebar_browse_or_add_channel_menu.tsx`

**Lines:** ~180-200

**Change:**
```tsx
<Menu.Separator className='invite-people-separator-hidden'/>  // ← ADDED CLASS
{invitePeopleMenuItem}
```

```tsx
const invitePeopleMenuItem = (
    <Menu.Item
        id='invitePeopleMenuItem'
        onClick={props.onInvitePeopleClick}
        leadingElement={<AccountPlusOutlineIcon size={18}/>}
        labels={(
            <>
                <FormattedMessage
                    id='sidebarLeft.browserOrCreateChannelMenu.invitePeopleMenuItem.primaryLabel'
                    defaultMessage='Invite people'
                />
                <FormattedMessage
                    id='sidebarLeft.browserOrCreateChannelMenu.invitePeopleMenuItem.secondaryLabel'
                    defaultMessage='Add people to the team'
                />
            </>
        )}
        trailingElements={showInvitePeopleTutorialTip && <InvitePeopleTour/>}
        aria-haspopup='true'
        className='invite-people-menu-item-hidden'  // ← ADDED
    />
);
```

**CSS:** Already defined in `sidebar_header.scss`

**Reason:** Remove invite option from channel menu.

---

#### 4. Channel Intro Message - "Invite Others" Button
**File:** `webapp/channels/src/components/post_view/channel_intro_message/add_members_button.scss`

**Change:**
```scss
#introTextInvite {
    display: none !important;
}
```

**Reason:** Hide invite button shown in channel introduction messages.

---

#### 5. Channel Invite Modal - "Invite Them to Team" Message
**File:** `webapp/channels/src/components/channel_invite_modal/channel_invite_modal.tsx`

**Lines:** ~120-150

**Change:**
```tsx
// Commented out - hide "Invite them to the team" button in no matches message
// const customNoOptionsMessage = (
//     <div
//         className='custom-no-options-message'
//     >
//         <FormattedMessage
//             id='channel_invite.no_options_message'
//             defaultMessage='No matches found - <InvitationModalLink>Invite them to the team</InvitationModalLink>'
//             values={{
//                 InvitationModalLink: (chunks) => (
//                     <InviteModalLink
//                         id='customNoOptionsMessageLink'
//                         abacChannelPolicyEnforced={props.channel.policy_enforced}
//                     >
//                         {chunks}
//                     </InviteModalLink>
//                 ),
//             }}
//         />
//     </div>
// );
const customNoOptionsMessage = null;  // ← SET TO NULL
```

**Reason:** Remove "Invite them to the team" link from search results.

---

#### 6. Channel Info RHS - "Copy Link" Button
**File:** `webapp/channels/src/components/channel_info_rhs/top_buttons.tsx`

**Change:**
```tsx
<CopyButton
    onClick={copyLink.onClick}
    className={`copy-link-button-hidden ${copyLink.copiedRecently ? 'success' : ''}`}  // ← ADDED CLASS
    aria-label={copyText}
>
    <div>
        <i className={'icon ' + copyIcon}/>
    </div>
    <span>{copyText}</span>
</CopyButton>
```

**Reason:** Hide copy invite link functionality.

---

#### 7. Team Settings - "Invite Code" Section
**File:** `webapp/channels/src/components/team_settings/team_access_tab/team_access_tab.scss`

**Change:**
```scss
.access-invite-section {
    display: none !important;
}
```

**Reason:** Hide invite code display and regeneration in team settings.

---

#### 8. Team Members Modal - "Invite People" Button
**File:** `webapp/channels/src/components/team_members_modal/team_members_modal.scss`

**Change:**
```scss
#inviteMembersModal {
    .GenericModal__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    // Hide "Invite People" button
    #invitePeople,
    .invite-people-btn {
        display: none !important;
    }
}
```

**Reason:** Hide invite button in team members management modal.

---

#### 9. User Settings - Notification Troubleshooting Button
**File:** `webapp/channels/src/components/user_settings/notifications/send_test_notification_notice.tsx`

**Changes:**
1. Removed `tertiaryButton` prop from `SectionNotice`
2. Commented out unused imports and functions

```tsx
// Commented out - Troubleshooting docs button removed
// const [externalLink] = useExternalLink('https://mattermost.com/pl/troubleshoot-notifications');

// const onGoToNotificationDocumentation = useCallback(() => {
//     window.open(externalLink);
// }, [externalLink]);

<SectionNotice
    text={intl.formatMessage({
        id: 'user_settings.notifications.test_notification.body',
        defaultMessage: "Not receiving notifications? Send a test notification to all your devices to verify they're working correctly. If you continue to experience issues, check your device settings and notification preferences.",
    })}
    title={intl.formatMessage({id: 'user_settings.notifications.test_notification.title', defaultMessage: 'Troubleshooting notifications'})}
    primaryButton={primaryButton}
    type='hint'
    // tertiaryButton prop REMOVED
/>
```

**Reason:** Remove external documentation link.

---

#### 10. User Settings - "Learn More About Notifications" Link
**File:** `webapp/channels/src/components/user_settings/notifications/user_settings_notifications.tsx`

**Change:**
```tsx
<SettingDesktopHeader
    id='notificationSettingsTitle'
    text={
        <FormattedMessage
            id='user.settings.notifications.header'
            defaultMessage='Notifications'
        />
    }
    // info prop REMOVED (was showing "Learn more" link)
/>
```

**Reason:** Remove external documentation links.

---

#### 11. Channel Info RHS Menu - Hidden Menu Items
**File:** `webapp/channels/src/components/channel_info_rhs/menu.tsx`

**Changes:** Commented out multiple menu items:

```tsx
{/* Commented out - Pinned messages menu item */}
{/* <MenuItem
    icon={<i className='icon icon-pin-outline'/>}
    text={formatMessage({
        id: 'channel_info_rhs.menu.pinned',
        defaultMessage: 'Pinned messages',
    })}
    opensSubpanel={true}
    badge={channelStats?.pinnedpost_count}
    onClick={() => actions.showPinnedPosts(channel.id)}
/> */}

{/* Commented out - Sync Calendar menu item */}
{/* Commented out - Recorded Calls & Captions menu item */}
{/* Commented out - Teams menu item */}
```

**Reason:** Simplify channel info menu, remove unused features.

---

#### 12. Channel Menus - "Move To..." Menu Item
**Files:**
- `webapp/channels/src/components/sidebar/sidebar_channel/sidebar_channel_menu/sidebar_channel_menu.tsx`
- `webapp/channels/src/components/channel_header_menu/channel_header_menu_items/channel_header_public_private_menu.tsx`

**Changes:**
```tsx
{/* Commented out - Move to menu item and separator */}
{/* <Menu.Separator/> */}
{/* <ChannelMoveToSubmenu channel={channel}/> */}
```

**Reason:** Remove channel organization feature.

---

### Text & Branding Changes

#### 13. About Modal - Complete Rebrand
**File:** `webapp/channels/src/components/about_build_modal/about_build_modal.tsx`

**Changes:**

**Subtitle:**
```tsx
let subTitle = (
    <FormattedMessage
        id='about.teamEditionSt'
        defaultMessage='Konnect by Daakia - Empowering teams with seamless communication and collaboration.'  // ← CHANGED
    />
);
```

**Learn More:**
```tsx
let learnMore = (
    <div>
        <FormattedMessage
            id='about.teamEditionLearn'
            defaultMessage='Made with ❤️ by Team Daakia'  // ← CHANGED
        />
    </div>
);
```

**Copyright:**
```tsx
<div className='about-modal__copyright'>
    <FormattedMessage
        id='about.copyright'
        defaultMessage='© {currentYear} Konnect by Daakia. Made with love by Team Daakia.'  // ← CHANGED
        values={{
            currentYear: new Date().getFullYear(),
        }}
    />
</div>
```

**Notice:**
```tsx
<div className='about-modal__notice form-group pt-3'>
    <p>
        <FormattedMessage
            id='about.notice'
            defaultMessage='Konnect by Daakia - Building the future of team collaboration, one connection at a time.'  // ← CHANGED
        />
    </p>
</div>
```

**Removed:** Terms of Service and Privacy Policy links (commented out)

**Reason:** Complete rebrand from Mattermost to Konnect by Daakia.

---

#### 14. Onboarding Welcome Text
**File:** `webapp/channels/src/components/onboarding_tasklist/onboarding_tasklist.tsx`

**Lines:** ~273-281

**Change:**
```tsx
<h1>
    {'Konnect by Daakia'}  // ← CHANGED from "Welcome to Daakia"
</h1>
<p>
    <FormattedMessage
        id='onboardingTask.checklist.main_subtitle'
        defaultMessage='Hope you will like the product'  // ← CHANGED
    />
</p>
```

**Reason:** Update onboarding branding.

---

#### 15. Notification Settings Description
**File:** `webapp/channels/src/i18n/en.json`

**Change:**
```json
"user_settings.notifications.test_notification.body": "Not receiving notifications? Send a test notification to all your devices to verify they're working correctly. If you continue to experience issues, check your device settings and notification preferences.",
```

**Reason:** Improve clarity without mentioning troubleshooting docs.

---

### Disabled Features

#### 16. Trial Modal - Completely Disabled
**File:** `webapp/channels/src/components/learn_more_trial_modal/learn_more_trial_modal.tsx`

**Change:** Modified to always return `null`

```tsx
// Trial modal disabled for Konnect by Daakia - all imports commented out

type Props = {
    onClose?: () => void;
    onExited: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LearnMoreTrialModal = (_props: Props): JSX.Element | null => {
    // Trial modal disabled for Konnect by Daakia - always return null
    return null;

    // Original code commented out - kept for reference
};

export default LearnMoreTrialModal;
```

**Reason:** Disable enterprise trial feature completely.

---

#### 17. Start Trial Button - Completely Disabled
**File:** `webapp/channels/src/components/learn_more_trial_modal/start_trial_btn.tsx`

**Change:** Modified to always return `null`

```tsx
// Trial button disabled for Konnect by Daakia - always return null

export type StartTrialBtnProps = {
    onClick?: () => void;
    handleEmbargoError?: () => void;
    btnClass?: string;
    renderAsButton?: boolean;
    disabled?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StartTrialBtn = (_props: StartTrialBtnProps): JSX.Element | null => {
    // Trial button disabled for Konnect by Daakia - always return null
    return null;
};

export default StartTrialBtn;
```

**Reason:** Disable trial button everywhere in the app.

---

#### 18. Auto-Start Trial Modal - Completely Disabled
**File:** `webapp/channels/src/components/announcement_bar/show_start_trial_modal/show_start_trial_modal.tsx`

**Change:** Modified to always return `null`

```tsx
// Auto-start trial modal disabled for Konnect by Daakia - always return null

const ShowStartTrialModal = (): JSX.Element | null => {
    // Auto-start trial modal disabled for Konnect by Daakia - always return null
    return null;
};

export default ShowStartTrialModal;
```

**Reason:** Prevent automatic trial modal popup.

---

#### 19. System Notice - Completely Disabled
**File:** `webapp/channels/src/components/system_notice/system_notice.tsx`

**Change:** Modified to always return `null`

```tsx
// System notice disabled for Konnect by Daakia - always return null

export class SystemNotice extends React.PureComponent<Props> {
    render() {
        // System notice disabled for Konnect by Daakia - always return null
        return null;
    }
}

export default injectIntl(SystemNotice);
```

**Reason:** Disable all system notices including "Remind Me Later" prompts.

---

#### 20. Onboarding Tour - "Invite People" Step Removed
**File:** `webapp/channels/src/components/tours/constant.ts`

**Changes:**

**Tour Steps:**
```tsx
export const OnboardingTourSteps = {
    CHANNELS_AND_DIRECT_MESSAGES: 0,
    CREATE_AND_JOIN_CHANNELS: 1,
    // INVITE_PEOPLE: 2, // ← Commented out
    SEND_MESSAGE: 2, // ← Changed from 3 to 2
    CUSTOMIZE_EXPERIENCE: 3, // ← Changed from 4 to 3
    FINISHED,
};
```

**Task Names:**
```tsx
export const OnboardingTasksName = {
    CHANNELS_TOUR: 'channels_tour',
    // INVITE_PEOPLE: 'invite_people', // ← Commented out
    COMPLETE_YOUR_PROFILE: 'complete_your_profile',
    VISIT_SYSTEM_CONSOLE: 'visit_system_console',
    // START_TRIAL: 'start_trial', // ← Commented out
};
```

**Reason:** Skip invite people step in onboarding tour.

---

#### 21. Onboarding Tasks - Removed Tasks
**File:** `webapp/channels/src/components/onboarding_tasks/onboarding_tasks_manager.tsx`

**Changes:**

**Task Details:**
```tsx
const useGetTaskDetails = () => {
    const {formatMessage} = useIntl();
    return {
        [OnboardingTasksName.CHANNELS_TOUR]: {
            id: 'task_learn_more_about_messaging',
            svg: Channels,
            message: formatMessage({...}),
        },
        // Commented out - Invite people task removed
        // [OnboardingTasksName.INVITE_PEOPLE]: {...},
        
        // Commented out - Trial modal disabled for Konnect by Daakia
        // [OnboardingTasksName.START_TRIAL]: {...},
    };
};
```

**Task Trigger Handler:**
```tsx
export const useHandleOnBoardingTaskTrigger = () => {
    // ...
    switch (taskName) {
        // Commented out - Invite people task removed
        // case OnboardingTasksName.INVITE_PEOPLE: {
        //     ...
        // }
        
        // Commented out - Trial modal disabled
        // case OnboardingTasksName.START_TRIAL: {
        //     ...
        // }
    }
};
```

**Removed Imports:**
- `openInvitationsModal`
- `Handshake`
- `Security`
- `LearnMoreTrialModal`
- `ModalIdentifiers`
- `openModal`

**Reason:** Remove invite and trial tasks from onboarding checklist.

---

## Backend Changes (Server)

### User Limits (Not Yet Modified)

#### 22. User Limit Constants
**File:** `server/channels/app/limits.go`

**Current State:**
```go
const (
	maxUsersLimit     = 200  // Soft limit
	maxUsersHardLimit = 250  // Hard limit
)
```

**Recommended Change:**
```go
const (
	maxUsersLimit     = 0  // Unlimited
	maxUsersHardLimit = 0  // Unlimited
)
```

**Or modify the function:**
```go
func (a *App) GetServerLimits() (*model.ServerLimits, *model.AppError) {
	limits := &model.ServerLimits{}
	
	// DISABLED FOR KONNECT BY DAAKIA - No user limits
	limits.MaxUsersLimit = 0
	limits.MaxUsersHardLimit = 0
	
	// ... rest of function
}
```

**Status:** ⚠️ **NOT YET MODIFIED** - Needs to be changed for unlimited users

**Reason:** Remove artificial 200/250 user limit for unlicensed servers.

---

## Configuration Files

#### 23. Translation Files
**File:** `webapp/channels/src/i18n/en.json`

**Modified Entries:**
```json
{
    "about.copyright": "© {currentYear} Konnect by Daakia. Made with love by Team Daakia.",
    "about.teamEditionLearn": "Made with ❤️ by Team Daakia",
    "about.teamEditionSt": "Konnect by Daakia - Empowering teams with seamless communication and collaboration.",
    "about.notice": "Konnect by Daakia - Building the future of team collaboration, one connection at a time.",
    "user_settings.notifications.test_notification.body": "Not receiving notifications? Send a test notification to all your devices to verify they're working correctly. If you continue to experience issues, check your device settings and notification preferences.",
    "onboardingTask.checklist.main_subtitle": "Hope you will like the product"
}
```

---

#### 24. SCSS Stylesheets
Multiple SCSS files modified to add `display: none !important` rules:

1. `webapp/channels/src/components/sidebar/sidebar_header/sidebar_header.scss`
   - `.invite-people-menu-item-hidden`
   - `.invite-people-separator-hidden`

2. `webapp/channels/src/sass/layout/_sidebar-left.scss`
   - `#inviteMembersButton`

3. `webapp/channels/src/components/post_view/channel_intro_message/add_members_button.scss`
   - `#introTextInvite`

4. `webapp/channels/src/components/team_settings/team_access_tab/team_access_tab.scss`
   - `.access-invite-section`

5. `webapp/channels/src/components/team_members_modal/team_members_modal.scss`
   - `#invitePeople`
   - `.invite-people-btn`

---

## Summary of All Changes

### By Category:

**Invitation Features Removed (8 instances):**
1. Team menu "Invite people"
2. Sidebar "Invite Members" button
3. Browse channel menu "Invite people"
4. Channel intro "Invite others" button
5. Channel invite modal "Invite to team" link
6. Channel info "Copy Link" button
7. Team settings "Invite Code" section
8. Team members modal "Invite People" button

**Branding Changes (6 instances):**
1. About modal subtitle
2. About modal learn more
3. About modal copyright
4. About modal notice
5. Onboarding welcome title
6. Onboarding subtitle

**Features Disabled (4 components):**
1. Trial modal (LearnMoreTrialModal)
2. Start trial button (StartTrialBtn)
3. Auto-start trial modal (ShowStartTrialModal)
4. System notices (SystemNotice)

**Onboarding Modifications (3 areas):**
1. Removed "Invite People" tour step
2. Removed "Invite People" task
3. Removed "Start Trial" task

**User Settings (2 changes):**
1. Removed troubleshooting docs button
2. Removed "Learn more" link
3. Updated notification text

**Channel Features Removed (4 menu items):**
1. Pinned messages
2. Sync Calendar
3. Recorded Calls & Captions
4. Teams menu
5. Move to... submenu

---

## Complete File List

### Frontend Files (Webapp):
1. `webapp/channels/src/components/sidebar/sidebar_header/sidebar_team_menu.tsx`
2. `webapp/channels/src/components/sidebar/invite_members_button.tsx`
3. `webapp/channels/src/components/sidebar/sidebar_header/sidebar_browse_or_add_channel_menu.tsx`
4. `webapp/channels/src/components/sidebar/sidebar_header/sidebar_header.scss`
5. `webapp/channels/src/sass/layout/_sidebar-left.scss`
6. `webapp/channels/src/components/post_view/channel_intro_message/add_members_button.tsx`
7. `webapp/channels/src/components/post_view/channel_intro_message/add_members_button.scss`
8. `webapp/channels/src/components/channel_invite_modal/channel_invite_modal.tsx`
9. `webapp/channels/src/components/channel_info_rhs/top_buttons.tsx`
10. `webapp/channels/src/components/team_settings/team_access_tab/invite_section_input.tsx`
11. `webapp/channels/src/components/team_settings/team_access_tab/team_access_tab.scss`
12. `webapp/channels/src/components/team_members_modal/team_members_modal.tsx`
13. `webapp/channels/src/components/team_members_modal/team_members_modal.scss`
14. `webapp/channels/src/components/about_build_modal/about_build_modal.tsx`
15. `webapp/channels/src/components/user_settings/notifications/send_test_notification_notice.tsx`
16. `webapp/channels/src/components/user_settings/notifications/user_settings_notifications.tsx`
17. `webapp/channels/src/components/channel_info_rhs/menu.tsx`
18. `webapp/channels/src/components/sidebar/sidebar_channel/sidebar_channel_menu/sidebar_channel_menu.tsx`
19. `webapp/channels/src/components/channel_header_menu/channel_header_menu_items/channel_header_public_private_menu.tsx`
20. `webapp/channels/src/components/learn_more_trial_modal/learn_more_trial_modal.tsx`
21. `webapp/channels/src/components/learn_more_trial_modal/start_trial_btn.tsx`
22. `webapp/channels/src/components/announcement_bar/show_start_trial_modal/show_start_trial_modal.tsx`
23. `webapp/channels/src/components/system_notice/system_notice.tsx`
24. `webapp/channels/src/components/tours/constant.ts`
25. `webapp/channels/src/components/onboarding_tasks/onboarding_tasks_manager.tsx`
26. `webapp/channels/src/components/onboarding_tasklist/onboarding_tasklist.tsx`
27. `webapp/channels/src/i18n/en.json`

### Backend Files (Server):
28. `server/channels/app/limits.go` (⚠️ Not yet modified - needs change for unlimited users)

---

## How to Revert Changes

If you need to revert any changes:

1. **Git History:** Each file can be reverted using:
   ```bash
   git checkout HEAD -- <file-path>
   ```

2. **Search Comments:** All disabled code is commented with:
   - "Commented out - "
   - "DISABLED FOR KONNECT BY DAAKIA"
   - "Trial modal disabled"
   - "System notice disabled"

3. **CSS Rules:** Remove the `display: none !important` rules

4. **Null Returns:** Change `return null;` back to original component rendering

---

## Testing Checklist

After making these changes, test:

- [ ] Team menu doesn't show "Invite people"
- [ ] Sidebar doesn't show "Invite Members" button
- [ ] Channel menu doesn't show "Invite people"
- [ ] Channel intro doesn't show invite button
- [ ] About modal shows Konnect branding
- [ ] Onboarding shows "Konnect by Daakia"
- [ ] Trial modal never appears
- [ ] Start trial button never appears
- [ ] System notices don't appear
- [ ] Channel info menu simplified
- [ ] Notification settings updated
- [ ] User limit enforcement (after backend change)

---

## Future Considerations

1. **License Checks:** Consider modifying license validation to avoid upgrade prompts
2. **User Limits:** Modify `server/channels/app/limits.go` for unlimited users
3. **Feature Flags:** Document any feature flag changes
4. **API Endpoints:** Some server-side endpoints may still check for licenses
5. **Updates:** Merging upstream changes will require reapplying customizations

---

## Contact

For questions about these customizations:
- Project: Konnect by Daakia
- Modified: Mattermost Open Source
- Customizations: UI/UX branding and feature removal

---

**END OF DOCUMENTATION**

