# Mention Display Name Feature Documentation

## Overview

This document details the implementation of a feature that allows users to see **display names** (e.g., `@John Doe`) in the text field when selecting mentions from autocomplete, while ensuring the server receives **usernames** (e.g., `@john.doe`) for proper mention parsing and notifications.

**Feature Date:** November 2025  
**Status:** Implemented and Active

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Solution Overview](#solution-overview)
3. [Technical Implementation](#technical-implementation)
4. [Files Modified](#files-modified)
5. [Original File Contents](#original-file-contents)
6. [Changes Made](#changes-made)
7. [How It Works](#how-it-works)
8. [Testing](#testing)
9. [Future Considerations](#future-considerations)

---

## Problem Statement

### User Experience Issue

When the **"Teammate Name Display"** setting is set to **"Show first and last name"**, users expect to see full names (e.g., `@John Doe`) in the text field when they select mentions from the autocomplete dropdown. However, the original implementation only showed usernames (e.g., `@john.doe`), which:

1. **Reduced readability** - Long or cryptic usernames are harder to read
2. **Inconsistent UX** - Display names are shown in posts and DMs, but not in the text field
3. **User confusion** - Users see full names everywhere except when typing mentions

### Technical Constraint

The Mattermost server requires **usernames** (not display names) for:
- Mention parsing and detection
- User lookup and notifications
- Mention highlighting in posts
- All server-side mention processing

### Solution Requirement

- **Frontend (UI)**: Show display names in the text field when users select from autocomplete
- **Backend (Server)**: Receive usernames for proper processing
- **Seamless conversion**: Automatically convert display names to usernames before submission

---

## Solution Overview

The solution implements a **two-part approach**:

1. **Autocomplete Insertion** (`at_mention_provider.tsx`):
   - Modified to insert display names into the text field when users select from autocomplete
   - Uses `displayUsername()` utility to respect user's "Teammate Name Display" setting

2. **Pre-Submission Conversion** (`create_comment.tsx`):
   - Converts display names back to usernames before sending the post to the server
   - Builds a reverse mapping of display names → usernames
   - Uses regex pattern matching to replace `@DisplayName` with `@username`

---

## Technical Implementation

### Architecture Flow

```
User Types "@" → Autocomplete Shows Users
    ↓
User Selects "John Doe" from Dropdown
    ↓
Text Field Shows: "@John Doe"  ← Display Name (User-Friendly)
    ↓
User Submits Post
    ↓
Conversion Logic Runs (create_comment.tsx)
    ↓
Message Sent to Server: "@john.doe"  ← Username (Server-Compatible)
    ↓
Server Processes Mentions Correctly ✅
```

### Key Components

1. **Display Name Mapping**
   - Builds a map of all users' display names to their usernames
   - Only maps users whose display name differs from username and contains spaces
   - Escapes special regex characters for safe pattern matching

2. **Pattern Matching**
   - Uses regex to find `@DisplayName` patterns in the message
   - Handles edge cases like nested names ("John Doe" vs "John Doe Jr")
   - Sorts by length (longest first) to match longer names first

3. **Conversion Logic**
   - Replaces all `@DisplayName` occurrences with `@username`
   - Preserves message structure and other content
   - Only processes mentions, not other text

---

## Files Modified

### 1. `webapp/channels/src/components/suggestion/at_mention_provider/at_mention_provider.tsx`

**Purpose:** Handles mention autocomplete suggestions and insertion into text field

**Changes:**
- Modified `membersGroup()` function to use `displayUsername()` instead of `profile.username`
- Modified `nonMembersGroup()` function to use `displayUsername()` instead of `item.username`
- Added imports for `getTeammateNameDisplaySetting` and `displayUsername`

**Lines Modified:**
- Lines 9, 14: Added imports
- Lines 443-473: Modified `membersGroup()` function
- Lines 495-525: Modified `nonMembersGroup()` function

---

### 2. `webapp/channels/src/actions/views/create_comment.tsx`

**Purpose:** Handles post submission and converts display names to usernames before sending to server

**Changes:**
- Added display name to username conversion logic in `submitPost()` function
- Added imports for `getUsers`, `getTeammateNameDisplaySetting`, and `displayUsername`

**Lines Modified:**
- Lines 20, 23-24: Added imports
- Lines 54-119: Added conversion logic with detailed comments

---

## Original File Contents

### Original `at_mention_provider.tsx` (membersGroup function)

```typescript
export function membersGroup(items: CreatedProfile[]) {
    return {
        key: 'members',
        label: defineMessage({id: 'suggestion.mention.members', defaultMessage: 'Channel Members'}),
        items,
        terms: items.map((profile) => '@' + profile.username),  // ← ORIGINAL: Used username
        component: AtMentionSuggestion,
    };
}
```

### Original `at_mention_provider.tsx` (nonMembersGroup function)

```typescript
export function nonMembersGroup(items: CreatedProfile[]) {
    return {
        key: 'nonMembers',
        label: defineMessage({id: 'suggestion.mention.nonmembers', defaultMessage: 'Not in Channel'}),
        items,
        terms: items.map((item) => '@' + item.username),  // ← ORIGINAL: Used username
        component: AtMentionSuggestion,
    };
}
```

### Original `create_comment.tsx` (submitPost function - relevant section)

```typescript
export function submitPost(
    channelId: string,
    rootId: string,
    draft: PostDraft,
    afterSubmit?: (response: SubmitPostReturnType) => void,
    schedulingInfo?: SchedulingInfo,
    options?: OnSubmitOptions,
): ActionFuncAsync<CreatePostReturnType> {
    return async (dispatch, getState) => {
        const state = getState();
        const userId = getCurrentUserId(state);
        const time = Utils.getTimestamp();

        // ← ORIGINAL: No conversion logic, message sent as-is
        let post = {
            file_ids: [],
            message: draft.message,  // ← ORIGINAL: Used draft.message directly
            channel_id: channelId,
            // ... rest of post
        };
        // ... rest of function
    };
}
```

---

## Changes Made

### Change 1: Modified `at_mention_provider.tsx` - `membersGroup()` function

**Location:** Lines 443-473

**Before:**
```typescript
export function membersGroup(items: CreatedProfile[]) {
    return {
        key: 'members',
        label: defineMessage({id: 'suggestion.mention.members', defaultMessage: 'Channel Members'}),
        items,
        terms: items.map((profile) => '@' + profile.username),
        component: AtMentionSuggestion,
    };
}
```

**After:**
```typescript
// ============================================================================
// FEATURE: Display Name to Username Conversion for Mentions
// ============================================================================
// This function was modified to insert display names (e.g., "@John Doe")
// instead of usernames (e.g., "@john.doe") into the text field when users
// select mentions from the autocomplete dropdown.
//
// WHY: Users prefer seeing full names in the text field for better readability,
//      especially when "Teammate Name Display" is set to "Show first and last name".
//
// HOW IT WORKS:
// - Uses displayUsername() utility to get the display name based on user preferences
// - The display name is inserted into the text field when user selects from autocomplete
// - The conversion back to username happens in create_comment.tsx before server submission
//
// RELATED CHANGES:
// - This file: Modified to insert display names in text field
// - create_comment.tsx: Converts display names to usernames before server submission
// ============================================================================
export function membersGroup(items: CreatedProfile[]) {
    const state = store.getState();
    const teammateNameDisplay = getTeammateNameDisplaySetting(state);
    return {
        key: 'members',
        label: defineMessage({id: 'suggestion.mention.members', defaultMessage: 'Channel Members'}),
        items,
        // MODIFIED: Changed from profile.username to displayUsername() to show full names
        terms: items.map((profile) => '@' + displayUsername(profile, teammateNameDisplay)),
        component: AtMentionSuggestion,
    };
}
```

**Key Changes:**
- Added state access to get `teammateNameDisplay` setting
- Changed `profile.username` to `displayUsername(profile, teammateNameDisplay)`
- Added comprehensive documentation comments

---

### Change 2: Modified `at_mention_provider.tsx` - `nonMembersGroup()` function

**Location:** Lines 495-525

**Before:**
```typescript
export function nonMembersGroup(items: CreatedProfile[]) {
    return {
        key: 'nonMembers',
        label: defineMessage({id: 'suggestion.mention.nonmembers', defaultMessage: 'Not in Channel'}),
        items,
        terms: items.map((item) => '@' + item.username),
        component: AtMentionSuggestion,
    };
}
```

**After:**
```typescript
// ============================================================================
// FEATURE: Display Name to Username Conversion for Mentions
// ============================================================================
// This function was modified to insert display names (e.g., "@John Doe")
// instead of usernames (e.g., "@john.doe") into the text field when users
// select mentions from the autocomplete dropdown for users not in the channel.
//
// WHY: Users prefer seeing full names in the text field for better readability,
//      especially when "Teammate Name Display" is set to "Show first and last name".
//
// HOW IT WORKS:
// - Uses displayUsername() utility to get the display name based on user preferences
// - The display name is inserted into the text field when user selects from autocomplete
// - The conversion back to username happens in create_comment.tsx before server submission
//
// RELATED CHANGES:
// - This file: Modified to insert display names in text field
// - create_comment.tsx: Converts display names to usernames before server submission
// ============================================================================
export function nonMembersGroup(items: CreatedProfile[]) {
    const state = store.getState();
    const teammateNameDisplay = getTeammateNameDisplaySetting(state);
    return {
        key: 'nonMembers',
        label: defineMessage({id: 'suggestion.mention.nonmembers', defaultMessage: 'Not in Channel'}),
        items,
        // MODIFIED: Changed from item.username to displayUsername() to show full names
        terms: items.map((item) => '@' + displayUsername(item, teammateNameDisplay)),
        component: AtMentionSuggestion,
    };
}
```

**Key Changes:**
- Added state access to get `teammateNameDisplay` setting
- Changed `item.username` to `displayUsername(item, teammateNameDisplay)`
- Added comprehensive documentation comments

---

### Change 3: Modified `create_comment.tsx` - Added conversion logic

**Location:** Lines 54-119

**Before:**
```typescript
const time = Utils.getTimestamp();

let post = {
    file_ids: [],
    message: draft.message,
    // ... rest of post
};
```

**After:**
```typescript
const time = Utils.getTimestamp();

// ============================================================================
// FEATURE: Display Name to Username Conversion for Mentions
// ============================================================================
// This section converts display names (e.g., "@John Doe") back to usernames
// (e.g., "@john.doe") before sending the post to the server.
//
// WHY: When "Teammate Name Display" is set to "Show first and last name",
//      users see full names in the text field when selecting mentions from
//      autocomplete. However, the server requires usernames for proper
//      mention parsing and notifications. This conversion ensures:
//      1. Users see friendly display names in the UI
//      2. Server receives correct usernames for processing
//      3. Notifications and mentions work correctly
//
// HOW IT WORKS:
// 1. Build a reverse mapping of display names -> usernames for all users
// 2. Only map users whose display name differs from username and contains spaces
// 3. Escape special regex characters in display names for safe pattern matching
// 4. Sort display names by length (longest first) to handle nested names
// 5. Replace @displayName patterns with @username in the message
//
// RELATED CHANGES:
// - at_mention_provider.tsx: Modified to insert display names in text field
// - This file: Converts display names to usernames before server submission
// ============================================================================
let message = draft.message;
const users = getUsers(state);
const teammateNameDisplay = getTeammateNameDisplaySetting(state);

// Create a reverse mapping: display name -> username
// This map will be used to convert display names back to usernames
const displayNameToUsername = new Map<string, string>();
for (const userId in users) {
    if (Object.hasOwn(users, userId)) {
        const user = users[userId];
        const displayName = displayUsername(user, teammateNameDisplay);

        // Only map if display name is different from username and has spaces (full name)
        // This ensures we only convert actual full names, not usernames that happen to match
        if (displayName !== user.username && displayName.includes(' ')) {
            // Escape special regex characters in display name to prevent regex injection
            // Characters like . * + ? ^ $ { } ( ) | [ ] \ need to be escaped
            const escapedDisplayName = displayName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            displayNameToUsername.set(escapedDisplayName, user.username);
        }
    }
}

// Replace @displayName with @username in the message
if (displayNameToUsername.size > 0) {
    // Sort by length (longest first) to handle cases where one display name contains another
    // Example: "John Doe" and "John Doe Jr" - we want to match "John Doe Jr" first
    const sortedDisplayNames = Array.from(displayNameToUsername.keys()).sort((a, b) => b.length - a.length);
    for (const displayName of sortedDisplayNames) {
        const username = displayNameToUsername.get(displayName)!;

        // Match @displayName with word boundaries, handling spaces
        // Pattern: @displayName followed by whitespace, end of string, or non-word character
        // This ensures we match complete names, not partial matches
        const regex = new RegExp(`@${displayName}(?=\\s|$|[^\\w\\s-])`, 'g');
        message = message.replace(regex, `@${username}`);
    }
}
// ============================================================================
// END OF DISPLAY NAME TO USERNAME CONVERSION
// ============================================================================

let post = {
    file_ids: [],
    message,  // ← Now uses converted message
    // ... rest of post
};
```

**Key Changes:**
- Added conversion logic before post creation
- Builds reverse mapping of display names to usernames
- Escapes special regex characters for safety
- Sorts by length to handle nested names
- Uses regex pattern matching for replacement

---

### Change 4: Added imports to `at_mention_provider.tsx`

**Location:** Lines 9, 14

**Added:**
```typescript
import {getTeammateNameDisplaySetting} from 'mattermost-redux/selectors/entities/preferences';
import {getSuggestionsSplitBy, getSuggestionsSplitByMultiple, displayUsername} from 'mattermost-redux/utils/user_utils';
```

**Note:** `displayUsername` was already imported, but we now use it in the modified functions.

---

### Change 5: Added imports to `create_comment.tsx`

**Location:** Lines 20, 23-24

**Added:**
```typescript
import {getTeammateNameDisplaySetting} from 'mattermost-redux/selectors/entities/preferences';
import {getCurrentUserId, getUsers} from 'mattermost-redux/selectors/entities/users';
import {displayUsername} from 'mattermost-redux/utils/user_utils';
```

**Note:** Some imports may have already existed, but we now use them in the conversion logic.

---

## How It Works

### Step-by-Step Flow

1. **User Types "@" in Text Field**
   - Autocomplete dropdown appears
   - Shows users with their display names (based on "Teammate Name Display" setting)

2. **User Selects "John Doe" from Dropdown**
   - `at_mention_provider.tsx` inserts `@John Doe` into the text field
   - User sees the friendly display name

3. **User Types More Text and Submits**
   - Example message: `"Hey @John Doe, can you review this?"`
   - User sees display name in the text field

4. **Pre-Submission Conversion (create_comment.tsx)**
   - `submitPost()` function is called
   - Conversion logic runs:
     - Gets all users from Redux state
     - Builds mapping: `{"John Doe" → "john.doe"}`
     - Escapes special characters: `"John Doe" → "John Doe"` (no special chars in this case)
     - Sorts by length (if multiple matches)
     - Replaces `@John Doe` with `@john.doe` using regex
   - Result: `"Hey @john.doe, can you review this?"`

5. **Post Sent to Server**
   - Server receives message with username: `"Hey @john.doe, can you review this?"`
   - Server parses mentions correctly
   - Notifications sent to correct user
   - Mention highlighting works properly

6. **Post Displayed**
   - Server returns post with mentions processed
   - Frontend displays post with display names (as configured)
   - User sees: `"Hey @John Doe, can you review this?"` in the post

### Edge Cases Handled

1. **Nested Names**
   - If users have "John Doe" and "John Doe Jr"
   - Sorted by length (longest first)
   - "John Doe Jr" is matched before "John Doe"

2. **Special Characters in Names**
   - Names with regex special characters (e.g., "John (Admin)")
   - Escaped before regex matching: `"John \\(Admin\\)"`

3. **Names Without Spaces**
   - Only converts names with spaces (full names)
   - Usernames that match display names are not converted

4. **Multiple Mentions**
   - Handles multiple mentions in one message
   - Each mention is converted independently

---

## Testing

### Manual Testing Scenarios

1. **Basic Mention Conversion**
   - Select user with display name "John Doe" (username: "john.doe")
   - Type message: `"Hey @John Doe"`
   - Submit post
   - Verify: Server receives `"Hey @john.doe"`

2. **Multiple Mentions**
   - Select multiple users with display names
   - Type: `"Hey @John Doe and @Jane Smith"`
   - Submit post
   - Verify: Server receives `"Hey @john.doe and @jane.smith"`

3. **Nested Names**
   - Have users "John Doe" and "John Doe Jr"
   - Mention "John Doe Jr"
   - Verify: Correctly converts to username of "John Doe Jr", not "John Doe"

4. **Special Characters**
   - User with display name "John (Admin)"
   - Mention this user
   - Verify: Correctly converts despite parentheses

5. **Mixed Content**
   - Type: `"Hey @John Doe, check this: https://example.com"`
   - Verify: Only mention is converted, URL is preserved

### Automated Testing (Recommended)

```typescript
// Example test cases to add
describe('convertMentionDisplayNamesToUsernames', () => {
    it('should convert display name to username', () => {
        const message = 'Hey @John Doe';
        const state = createMockState({
            users: {
                'user1': {id: 'user1', username: 'john.doe', first_name: 'John', last_name: 'Doe'}
            },
            preferences: {teammate_name_display: 'full_name'}
        });
        const result = convertMentionDisplayNamesToUsernames(message, state);
        expect(result).toBe('Hey @john.doe');
    });

    it('should handle multiple mentions', () => {
        // ... test case
    });

    it('should handle nested names', () => {
        // ... test case
    });

    it('should escape special characters', () => {
        // ... test case
    });
});
```

---

## Future Considerations

### Potential Improvements

1. **Performance Optimization**
   - Cache the display name → username mapping
   - Only rebuild when users change or preferences update
   - Consider memoization for large teams

2. **Edge Case Handling**
   - Handle display names that are substrings of other display names
   - Improve regex pattern for better boundary detection
   - Handle Unicode characters and emojis in names

3. **Testing**
   - Add comprehensive unit tests
   - Add integration tests
   - Add E2E tests for mention flow

4. **Documentation**
   - Add JSDoc comments to functions
   - Update developer documentation
   - Add user-facing documentation if needed

5. **Error Handling**
   - Handle cases where display name doesn't map to any username
   - Log conversion failures for debugging
   - Fallback to original message if conversion fails

### Potential Issues

1. **Performance with Large Teams**
   - Building the mapping for thousands of users may be slow
   - Consider lazy loading or caching

2. **Real-time Updates**
   - If user changes display name, mapping needs update
   - Consider listening to user update events

3. **Internationalization**
   - Ensure regex patterns work with all character sets
   - Test with non-Latin names

---

## Summary

This feature successfully implements display name support in mention autocomplete while maintaining server compatibility. Users now see friendly full names in the text field, while the server receives the correct usernames for processing. The implementation is robust, handles edge cases, and includes comprehensive documentation.

**Key Benefits:**
- ✅ Better user experience (readable names in text field)
- ✅ Server compatibility (receives usernames)
- ✅ No breaking changes (backward compatible)
- ✅ Well documented (comments and this doc)
- ✅ Handles edge cases (nested names, special chars)

**Files Changed:**
- `webapp/channels/src/components/suggestion/at_mention_provider/at_mention_provider.tsx`
- `webapp/channels/src/actions/views/create_comment.tsx`

**Lines of Code Added:** ~70 lines (including comments)

---

## Contact & Support

For questions or issues related to this feature, please refer to:
- Code comments in the modified files
- This documentation
- daakia development team

---

**Document Version:** 1.0  
**Last Updated:** November 2025  
**Author:** Development Team

