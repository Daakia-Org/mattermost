# Quote Reply Feature Documentation

## Overview

The Quote Reply feature allows users to reply to specific posts by quoting them, similar to how users can quote messages in other messaging platforms. When a user quotes a post, the quoted message is displayed in a preview above the text input, and when the reply is submitted, it includes a reference to the quoted post.

## Table of Contents

1. [Backend Implementation](#backend-implementation)
2. [Frontend Implementation](#frontend-implementation)
3. [How It Works](#how-it-works)
4. [Data Flow](#data-flow)
5. [Storage Mechanism](#storage-mechanism)
6. [Component Architecture](#component-architecture)
7. [API Integration](#api-integration)

---

## Backend Implementation

### Changes Made

#### 1. Post Type Constant (`server/public/model/post.go`)

**Location:** `server/public/model/post.go`

**Changes:**
- Added a new post type constant `PostTypeQuoteReply` with value `"quote_reply"`
- Added validation support for quote reply posts in the `IsValid()` method

**Code:**

```go
// Line 57: Added new post type constant
PostTypeQuoteReply = "quote_reply"

// Line 504: Added to valid post types in IsValid() method
PostTypeQuoteReply,
```

**Purpose:**
- Defines a new post type that distinguishes quote reply posts from regular posts
- Allows the backend to validate and accept posts with this type

### Backend Validation

The backend validates quote reply posts through the `Post.IsValid()` method in `post.go`. When a post with type `"quote_reply"` is submitted, it passes validation just like other system post types.

**Supported Post Types:**
- Regular posts (empty type)
- System posts
- **Quote Reply posts** (`quote_reply`) ← New addition

---

## Frontend Implementation

### Components Created/Modified

#### 1. Quoted Message Preview Component

**Location:** `webapp/channels/src/components/quoted_message_preview/quoted_message_preview.tsx`

**Purpose:** Displays a preview of the quoted message above the text input box when a user selects a post to quote.

**Features:**
- Shows the quoted message content (truncated to 80 characters)
- Displays the author name (if not the current user)
- Shows attachment previews (images, videos, files)
- Close button to remove the quote preview
- Automatically updates when localStorage changes

**Key Functionality:**
- Listens to `quotedPostChanged` custom events
- Monitors localStorage for quote data
- Retrieves post and user data from Redux store
- Handles attachment display

**Props:**
```typescript
type Props = {
    channelId: string;
    onClose: () => void;
};
```

**State Management:**
- Reads quoted post data from localStorage
- Uses Redux selectors to get post, user, and file information
- Reacts to storage events and custom events

#### 2. Quoted Message Display Component

**Location:** `webapp/channels/src/components/quoted_message_display/quoted_message_display.tsx`

**Purpose:** Displays the quoted message within an actual post that was created as a quote reply.

**Features:**
- Shows the quoted post content in a styled box
- Displays author information
- Shows attachments from the quoted post
- Links to the original quoted post

#### 3. Advanced Text Editor Integration

**Location:** `webapp/channels/src/components/advanced_text_editor/advanced_text_editor.tsx`

**Changes:**
- Added `QuotedMessagePreview` component above the text input
- Implemented close handler that:
  - Removes quote data from localStorage
  - Dispatches custom event to trigger re-render
  - Updates draft state

**Code:**
```typescript
{!isInEditMode && (
    <QuotedMessagePreview
        channelId={channelId}
        onClose={() => {
            const storageKey = `${StoragePrefixes.QUOTED_POST}${channelId}`;
            localStorage.removeItem(storageKey);
            // Dispatch custom event to trigger re-render of quote preview
            window.dispatchEvent(new CustomEvent('quotedPostChanged', {
                detail: {channelId},
            }));
            handleDraftChange(draft, {instant: true});
        }}
    />
)}
```

#### 4. Post Submission Logic

**Location:** `webapp/channels/src/actions/views/create_comment.tsx`

**Changes:**
- Modified `submitPost` function to check for quoted posts
- Sets post type to `QUOTE_REPLY` when `quoted_post_id` is present in draft props

**Code:**
```typescript
// Check if this is a quote reply post
const isQuoteReply = draft.props?.quoted_post_id;

let post = {
    // ... other post properties
    type: isQuoteReply ? PostTypes.QUOTE_REPLY : '',
    props: {
        ...draft.props,
        // quoted_post_id is included in props if present
    },
} as unknown as Post;
```

#### 5. Dot Menu Integration

**Location:** `webapp/channels/src/components/dot_menu/dot_menu.tsx`

**Changes:**
- Added "Quote Reply" menu item handler
- Stores quoted post data in localStorage
- Dispatches custom event to trigger preview update
- Focuses the textbox after selection

**Code:**
```typescript
handleQuoteReplyMenuItemActivated = (): void => {
    this.props.handleDropdownOpened?.(false);

    const {post} = this.props;
    const quotedPostData = {
        postId: post.id,
        message: post.message,
        channelId: post.channel_id,
        channelType: this.props.channelType || 'unknown',
        userId: post.user_id,
    };

    // Store in localStorage (following Mattermost draft pattern)
    const storageKey = `${StoragePrefixes.QUOTED_POST}${post.channel_id}`;
    localStorage.setItem(storageKey, JSON.stringify(quotedPostData));

    // Dispatch custom event to trigger re-render of quote preview
    window.dispatchEvent(new CustomEvent('quotedPostChanged', {
        detail: {channelId: post.channel_id},
    }));

    // Focus the textbox
    const textbox = document.getElementById('post_textbox') || document.getElementById('reply_textbox');
    if (textbox) {
        textbox.focus();
    }
};
```

#### 6. Constants

**Location:** `webapp/channels/src/utils/constants.tsx`

**Added:**
```typescript
QUOTED_POST: 'quoted_post_',
```

**Usage:** Used as a prefix for localStorage keys to store quoted post data per channel.

#### 7. Post Types Constant

**Location:** `webapp/channels/src/utils/constants.tsx`

**Added:**
```typescript
QUOTE_REPLY: 'quote_reply',
```

**Usage:** Used when creating posts to identify them as quote replies.

---

## How It Works

### User Flow

1. **User selects a post to quote:**
   - User clicks on the three-dot menu (⋯) on a post
   - Selects "Quote Reply" option
   - The quoted post data is stored in localStorage
   - A custom event is dispatched
   - The text input is focused

2. **Quote preview appears:**
   - `QuotedMessagePreview` component detects the localStorage change
   - Component fetches post, user, and file data from Redux store
   - Preview box appears above the text input showing:
     - Author name (if not own message)
     - Truncated message content
     - Attachment previews (if any)

3. **User types reply:**
   - User types their reply message
   - The quote preview remains visible above the input
   - User can click the close (×) button to cancel the quote

4. **User submits reply:**
   - When user submits the post:
     - The `quoted_post_id` is included in the post props
     - Post type is set to `QUOTE_REPLY`
     - Post is sent to the backend
     - Quote data is cleared from localStorage

5. **Post is displayed:**
   - The reply appears with the quoted message displayed inline
   - `QuotedMessageDisplay` component renders the quoted content
   - Users can click on the quoted message to navigate to the original post

### Technical Flow

```
User Action
    ↓
Dot Menu → "Quote Reply"
    ↓
Store in localStorage (key: `quoted_post_${channelId}`)
    ↓
Dispatch CustomEvent 'quotedPostChanged'
    ↓
QuotedMessagePreview listens to event
    ↓
Component reads from localStorage
    ↓
Fetches post/user/file data from Redux
    ↓
Displays preview above text input
    ↓
User types and submits
    ↓
Post created with type: 'quote_reply' and props.quoted_post_id
    ↓
Backend validates and stores post
    ↓
Post displayed with QuotedMessageDisplay component
```

---

## Data Flow

### 1. Storing Quote Data

**Storage Location:** `localStorage`

**Key Format:** `${StoragePrefixes.QUOTED_POST}${channelId}` = `quoted_post_${channelId}`

**Data Structure:**
```typescript
{
    postId: string;        // ID of the post being quoted
    message: string;        // Message content of the quoted post
    channelId: string;     // Channel ID where the post exists
    channelType: string;   // Type of channel (public, private, DM, etc.)
    userId: string;        // ID of the user who created the quoted post
}
```

### 2. Post Creation

**Post Structure:**
```typescript
{
    channel_id: string;
    message: string;       // User's reply message
    root_id?: string;      // Thread root ID (if replying to thread)
    type: 'quote_reply';   // Post type
    props: {
        quoted_post_id: string;  // ID of the quoted post
        // ... other props
    }
}
```

### 3. Event System

**Custom Events:**
- `quotedPostChanged`: Dispatched when quote data is added, removed, or updated
  - `detail.channelId`: The channel ID for which the quote changed

**Storage Events:**
- Native `storage` event: Triggered when localStorage is modified (for cross-tab sync)

---

## Storage Mechanism

### localStorage Pattern

The feature uses localStorage to persist quote data temporarily (similar to Mattermost's draft post pattern).

**Advantages:**
- Persists across page refreshes
- Per-channel storage (different quotes for different channels)
- Easy to clear when post is submitted or cancelled
- Works with Redux state management

**Storage Key:**
```
quoted_post_${channelId}
```

**Example:**
- Channel ID: `abc123`
- Storage Key: `quoted_post_abc123`

### Data Persistence

**When data is stored:**
- User selects "Quote Reply" from dot menu

**When data is cleared:**
- User clicks close button on preview
- User submits the post
- User navigates away (handled by component cleanup)

---

## Component Architecture

### Component Hierarchy

```
AdvancedTextEditor
    ├── QuotedMessagePreview (when quote exists)
    │   ├── QuotedMessagePreview__content
    │   │   ├── QuotedMessagePreview__border
    │   │   └── QuotedMessagePreview__text
    │   │       ├── QuotedMessagePreview__author
    │   │       ├── QuotedMessagePreview__message
    │   │       └── QuotedMessagePreview__attachments
    │   └── QuotedMessagePreview__close (button)
    └── Textbox
        └── ... (other editor components)

PostMessageView
    └── QuotedMessageDisplay (when post.type === 'quote_reply')
        ├── QuotedMessageDisplay__content
        └── ... (quoted post display)
```

### State Management

**Redux Store Usage:**
- `getPost(state, postId)`: Gets the quoted post data
- `getUser(state, userId)`: Gets the author of the quoted post
- `getFilesForPost(state, postId)`: Gets attachments from quoted post
- `getCurrentUserId(state)`: Gets current user ID

**Local State:**
- `quotedPostData`: Local state in `QuotedMessagePreview` component
  - Read from localStorage
  - Updated via event listeners

---

## API Integration

### Post Creation API

**Endpoint:** `POST /api/v4/posts`

**Request Body:**
```json
{
    "channel_id": "channel_id_here",
    "message": "User's reply message",
    "root_id": "thread_root_id",  // Optional
    "type": "quote_reply",
    "props": {
        "quoted_post_id": "quoted_post_id_here"
    }
}
```

**Backend Processing:**
1. Backend receives post with `type: "quote_reply"`
2. `Post.IsValid()` validates the post type (checks against valid types including `PostTypeQuoteReply`)
3. Post is stored in database with type and props
4. Post is returned to frontend

**Response:**
- Standard post object with `type: "quote_reply"` and `props.quoted_post_id`

---

## Styling

### Quoted Message Preview Styles

**Location:** `webapp/channels/src/components/quoted_message_preview/quoted_message_preview.scss`

**Key Styles:**
- Background: Light gray with colored left border
- Close button: Positioned absolutely in top-left corner
- Message truncation: 2 lines with ellipsis
- Responsive padding and spacing

**Close Button Position:**
- `position: absolute`
- `top: 6px`
- `left: 12px`
- Prevents overlap with eye icon (show formatting button) on the right

---

## Event Handling

### Custom Events

**Event Name:** `quotedPostChanged`

**When Dispatched:**
1. User selects "Quote Reply" from dot menu
2. User clicks close button on preview

**Event Detail:**
```typescript
{
    detail: {
        channelId: string;
    }
}
```

**Listeners:**
- `QuotedMessagePreview` component listens for this event
- Updates local state when event is received
- Re-checks localStorage for quote data

### Storage Events

**Native Browser Event:** `storage`

**When Triggered:**
- localStorage is modified (including cross-tab changes)

**Usage:**
- `QuotedMessagePreview` listens for storage events
- Syncs quote preview across browser tabs

---

## File Structure

```
webapp/channels/src/
├── components/
│   ├── quoted_message_preview/
│   │   ├── quoted_message_preview.tsx
│   │   ├── quoted_message_preview.scss
│   │   └── index.ts
│   ├── quoted_message_display/
│   │   ├── quoted_message_display.tsx
│   │   ├── quoted_message_display.scss
│   │   └── index.ts
│   ├── advanced_text_editor/
│   │   └── advanced_text_editor.tsx (modified)
│   └── dot_menu/
│       └── dot_menu.tsx (modified)
├── actions/views/
│   └── create_comment.tsx (modified)
└── utils/
    └── constants.tsx (modified)

server/
└── public/model/
    └── post.go (modified)
```

---

## Testing Considerations

### Test Cases to Consider

1. **Quote Selection:**
   - Select quote from dot menu
   - Verify preview appears
   - Verify data stored in localStorage

2. **Preview Display:**
   - Verify author name shows correctly
   - Verify message truncation works
   - Verify attachments display correctly
   - Verify own messages don't show author

3. **Close Functionality:**
   - Click close button
   - Verify preview disappears
   - Verify localStorage cleared
   - Verify event dispatched

4. **Post Submission:**
   - Submit post with quote
   - Verify post type is `quote_reply`
   - Verify `quoted_post_id` in props
   - Verify quote preview cleared

5. **Display:**
   - Verify quoted message displays in post
   - Verify link to original post works
   - Verify attachments in quoted message

6. **Edge Cases:**
   - Quote deleted post
   - Quote from different channel
   - Multiple quotes in different channels
   - Cross-tab synchronization

---

## Future Enhancements

Potential improvements for the quote reply feature:

1. **Quote Multiple Posts:** Allow users to quote multiple posts in a single reply
2. **Nested Quotes:** Support quoting posts that themselves contain quotes
3. **Quote Editing:** Allow editing the quoted content before posting
4. **Quote Permissions:** Add permission checks for quoting posts
5. **Quote Notifications:** Notify users when their posts are quoted
6. **Quote Analytics:** Track quote usage and engagement

---

## Troubleshooting

### Common Issues

1. **Preview not appearing:**
   - Check localStorage for quote data
   - Verify event listeners are registered
   - Check Redux store for post/user data

2. **Close button not working:**
   - Verify event is dispatched
   - Check localStorage is cleared
   - Verify component re-renders

3. **Post type not set:**
   - Verify `draft.props.quoted_post_id` exists
   - Check post creation logic
   - Verify backend validation

4. **Quote not displaying:**
   - Verify post type is `quote_reply`
   - Check `props.quoted_post_id` exists
   - Verify `QuotedMessageDisplay` component renders

---

## Summary

The Quote Reply feature enables users to reference and reply to specific posts in a conversation. The implementation uses:

- **Backend:** New post type constant and validation
- **Frontend:** Preview component, display component, and integration with editor
- **Storage:** localStorage for temporary quote data
- **Events:** Custom events for real-time updates
- **State:** Redux for post, user, and file data

The feature follows Mattermost's existing patterns for draft management and component architecture, making it consistent with the rest of the codebase.

---

## Author Notes

- Feature implemented in commit: `4cb0955934`
- Branch: `feat/text_reply`
- Date: November 2025

