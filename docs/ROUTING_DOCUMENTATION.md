# Mattermost Custom Routing Implementation Guide

> **⚠️ IMPORTANT**: All content routes MUST go through ChannelController to maintain proper CSS layout. Never add routes directly to TeamController!

## Overview
This document explains how to add new routes to Mattermost following the existing architecture patterns. We implemented a **Home** section as an example.

## Current Route Structure

```
/:team/channels/:channelName  → TeamController → ChannelController → CenterChannel → ChannelView
/:team/threads/:threadId?     → TeamController → ChannelController → CenterChannel → GlobalThreads
/:team/drafts                 → TeamController → ChannelController → CenterChannel → Drafts
/:team/home/:homeSection?     → TeamController → ChannelController → CenterChannel → HomeController
```

## ⚠️ CRITICAL: Routing Architecture Rule

**ALL content routes MUST go through ChannelController to maintain proper CSS layout!**

### ❌ WRONG (Breaks CSS Layout):
```tsx
// In TeamController - DON'T DO THIS
<Route path="/:team/home" component={HomeController} />
<ChannelController />
```

### ✅ CORRECT (Maintains Layout):
```tsx
// In TeamController - Let ChannelController handle all routes
<ChannelController />

// In CenterChannel - Add your route here
<Route path="/:team/home/:homeSection?" component={HomeController} />
```

## Implementation Steps

### 1. Create Route Controller Component

**Location**: `/components/[route_name]_controller/`

```tsx
// home_controller.tsx
import React from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import {TEAM_NAME_PATH_PATTERN} from 'utils/path';

const Dashboard = () => <div className='app__content'><h1>Dashboard</h1></div>;
const Analytics = () => <div className='app__content'><h1>Analytics</h1></div>;

export default function HomeController() {
    return (
        <div className='app__content'>
            <Switch>
                <Route path={`/:team(${TEAM_NAME_PATH_PATTERN})/home/dashboard`} component={Dashboard} />
                <Route path={`/:team(${TEAM_NAME_PATH_PATTERN})/home/analytics`} component={Analytics} />
                <Redirect to={window.location.pathname.replace('/home', '/home/dashboard')} />
            </Switch>
        </div>
    );
}
```

### 2. Add Route to CenterChannel (REQUIRED)

**File**: `/components/channel_layout/center_channel/center_channel.tsx`

⚠️ **This step is MANDATORY - never add routes directly to TeamController!**

```tsx
// Import the controller
const HomeController = makeAsyncComponent('HomeController', lazy(() => import('components/home_controller')));

// Add route in Switch - this maintains proper CSS layout
<Route
    path={`/:team(${TEAM_NAME_PATH_PATTERN})/home/:homeSection?`}
    component={HomeController}
/>
```

**Why this matters:**
- `ChannelController` provides essential CSS classes and layout structure
- Direct routing in `TeamController` bypasses this and breaks styling
- All Mattermost content routes follow this pattern

### 3. Create Navigation Component

**Location**: `/components/[route_name]_navigator/`

```tsx
// home_navigator.tsx
import React from 'react';
import {useHistory, useParams} from 'react-router-dom';

export default function HomeNavigator() {
    const history = useHistory();
    const {team} = useParams<{team: string}>();
    const currentPath = window.location.pathname;

    const homeItems = [
        {id: 'dashboard', name: 'Dashboard', path: `/${team}/home/dashboard`},
        {id: 'analytics', name: 'Analytics', path: `/${team}/home/analytics`},
    ];

    return (
        <div className='SidebarChannelGroup'>
            <div className='SidebarChannelGroupHeader'>
                <span className='SidebarChannelGroupHeader_text'>HOME</span>
            </div>
            <div className='SidebarChannelGroup_content'>
                {homeItems.map((item) => (
                    <div
                        key={item.id}
                        className={`SidebarChannel ${currentPath === item.path ? 'active' : ''}`}
                        onClick={() => history.push(item.path)}
                    >
                        <div className='SidebarChannel_link'>
                            <span className='SidebarChannelLinkLabel'>{item.name}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
```

### 4. Update Main Sidebar

**File**: `/components/sidebar/sidebar.tsx`

```tsx
// Import navigator
import HomeNavigator from 'components/home_navigator';

// Conditional rendering in lhsNavigator
{window.location.pathname.includes('/home') ? <HomeNavigator/> : <ChannelNavigator/>}

// Hide SidebarList for new routes
{!window.location.pathname.includes('/home') && (
    <SidebarList ... />
)}
```

### 5. Add Team Sidebar Button

**File**: `/components/team_sidebar/team_sidebar.tsx`

```tsx
// Add button logic
const isHomeActive = this.props.location.pathname.includes('/home');
const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentTeam) {
        this.props.actions.switchTeam(`/${currentTeam.name}/home`);
    }
};

// Add to sidebarButtons array
{
    id: 'home',
    icon: 'fa-home',
    tooltip: 'Home',
    active: isHomeActive,
    onClick: handleHomeClick,
},
```

### 6. Update Team Switcher

**File**: `/components/daakia-team-switcher/daakia_team_switcher.tsx`

```tsx
const handleTeamClick = useCallback((teamName: string) => {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/home')) {
        history.push(`/${teamName}/home`);
    } else if (currentPath.includes('/threads')) {
        history.push(`/${teamName}/threads`);
    } else {
        history.push(`/${teamName}`);
    }
}, [history]);
```

### 7. Add Page Title Support

**File**: `/components/unreads_status_handler/unreads_status_handler.tsx`

```tsx
// Add props
type Props = {
    // ... existing props
    inHome: boolean;
    homeSection?: string;
};

// Add title logic
} else if (currentTeam && this.props.inHome) {
    const sectionName = this.props.homeSection || 'Dashboard';
    document.title = `${mentionTitle}${unreadTitle}${sectionName} - ${currentTeam.display_name} ${currentSiteName}`;
```

**File**: `/components/unreads_status_handler/index.ts`

```tsx
// Add route detection
inHome: matchPath(pathname, {path: '/:team/home/:homeSection?'}) != null,
homeSection: matchPath(pathname, {path: '/:team/home/:homeSection?'})?.params?.homeSection,
```

## How to Create a New Route

### Example: Adding "Projects" Route

1. **Create Controller**: `/components/projects_controller/projects_controller.tsx`
2. **⚠️ CRITICAL - Add Route**: In `center_channel.tsx` add `/:team/projects/:projectSection?` (NEVER in TeamController!)
3. **Create Navigator**: `/components/projects_navigator/projects_navigator.tsx`
4. **Update Sidebar**: Add conditional rendering for `/projects`
5. **Add Button**: In `team_sidebar.tsx` add projects button
6. **Update Switcher**: Add projects path preservation
7. **Add Title**: In `unreads_status_handler` add projects title logic

### ⚠️ Common Mistake to Avoid

**DON'T add routes to TeamController:**
```tsx
// ❌ This breaks CSS layout
<Route path="/:team/projects" component={ProjectsController} />
```

**DO add routes to CenterChannel:**
```tsx
// ✅ This maintains proper layout
<Route path="/:team/projects/:section?" component={ProjectsController} />
```

### Quick Template

```tsx
// 1. Controller
export default function ProjectsController() {
    return (
        <Switch>
            <Route path="/:team/projects/list" component={ProjectList} />
            <Route path="/:team/projects/create" component={CreateProject} />
            <Redirect to={pathname.replace('/projects', '/projects/list')} />
        </Switch>
    );
}

// 2. Navigator
const projectItems = [
    {id: 'list', name: 'Project List', path: `/${team}/projects/list`},
    {id: 'create', name: 'Create Project', path: `/${team}/projects/create`},
];

// 3. Sidebar Button
{
    id: 'projects',
    icon: 'fa-project-diagram',
    tooltip: 'Projects',
    active: location.pathname.includes('/projects'),
    onClick: () => switchTeam(`/${currentTeam.name}/projects`),
}
```

## Key Patterns

1. **Route Structure**: Always use `/:team/[section]/[subsection]?` pattern
2. **⚠️ ROUTING ARCHITECTURE**: ALL content routes MUST go through ChannelController → CenterChannel
3. **Controllers**: Handle sub-routing with Switch/Route
4. **Navigators**: Show section-specific navigation
5. **Conditional Rendering**: Sidebar changes based on route
6. **Team Preservation**: Maintain route type when switching teams
7. **Page Titles**: Update document.title for each section
8. **Active States**: Highlight current section/subsection

## Troubleshooting

### CSS/Layout Issues
**Problem**: Layout breaks when navigating to new route
**Cause**: Route added directly to TeamController instead of CenterChannel
**Solution**: Move route from TeamController to CenterChannel

### Route Not Working
**Problem**: Route doesn't load or shows 404
**Cause**: Missing route in CenterChannel or incorrect path pattern
**Solution**: Ensure route exists in CenterChannel with correct TEAM_NAME_PATH_PATTERN

## Files Modified for New Routes

### Required Files (Core Functionality):
- `/components/[route]_controller/` (new) - Route logic
- `/components/[route]_navigator/` (new) - Sidebar navigation
- `/components/channel_layout/center_channel/center_channel.tsx` ⚠️ **CRITICAL**
- `/components/sidebar/sidebar.tsx` - Conditional navigator rendering

### Optional Files (Enhanced UX):
- `/components/team_sidebar/team_sidebar.tsx` - Add button
- `/components/daakia-team-switcher/daakia_team_switcher.tsx` - Preserve routes
- `/components/unreads_status_handler/unreads_status_handler.tsx` - Page titles
- `/components/unreads_status_handler/index.ts` - Route detection

## Architecture Summary

```
TeamController (handles team-level routes like /integrations, /emoji)
    ↓
ChannelController (provides layout structure)
    ↓  
CenterChannel (routes to specific content)
    ↓
YourController (your custom content)
```

**Remember**: Never bypass ChannelController - it's essential for proper CSS layout!

This architecture ensures consistency with Mattermost's existing patterns while allowing flexible route expansion.