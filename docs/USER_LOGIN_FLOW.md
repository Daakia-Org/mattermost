# User Login Flow - Simple Guide

## What This Document Explains

This document explains how a user logs into Mattermost using Daakia SSO (Single Sign-On). It shows every step, every check, and where the code is located.

---

## 📋 Table of Contents

1. [Simple Overview](#simple-overview)
2. [Step-by-Step Flow](#step-by-step-flow)
3. [All Checks and Validations](#all-checks-and-validations)
4. [Error Messages](#error-messages)
5. [Code Locations](#code-locations)

---

## Simple Overview

When a user tries to login:

1. **User clicks login** → Goes to Daakia SSO
2. **Daakia sends user data** → Mattermost receives it
3. **Mattermost checks the data** → Is it valid?
4. **Mattermost finds the organization** → Which org is active?
5. **Mattermost finds or creates team** → Based on organization name
6. **User joins the team** → Login successful!

---

## Step-by-Step Flow

### Step 1: User Starts Login

**What happens:**
- User clicks "Login with Daakia"
- Browser goes to Daakia SSO page
- User enters username/password
- Daakia sends user information to Mattermost

**Code Location:** This happens in the browser and Daakia backend (not in Mattermost code)

---

### Step 2: Mattermost Receives User Data

**What happens:**
- Mattermost receives user information from Daakia
- This information is called "OAuth claims"
- It includes: email, name, username, and organization data

**Code Location:** `server/channels/app/openid_provider.go` - Function `GetUserFromJSON` (Line 27)

**What the data looks like:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "username": "john.doe",
  "organization_name": [
    {
      "organization_name": "My Company",
      "user_role": "admin",
      "is_active": true
    }
  ]
}
```

---

### Step 3: Extract User Information

**What happens:**
- Mattermost reads the email, name, username from the data
- Stores them in a user object

**Code Location:** `server/channels/app/openid_provider.go` - Lines 41-69

**Checks:**
- ✅ Email exists (Line 45)
- ✅ Username exists, if not, uses email (Line 61-68)

---

### Step 4: Extract Organization Data

**What happens:**
- Mattermost reads the organization data from the claims
- Stores it in user properties (Props)

**Code Location:** `server/channels/app/openid_provider.go` - Lines 94-138

**What it does:**
- Reads `organization_name` from claims
- Converts it to JSON string
- Stores in `user.Props["organization_name"]`

---

### Step 5: Validate Required Data

**What happens:**
- Mattermost checks if important data is present
- If missing, login fails immediately

**Code Location:** `server/channels/app/openid_provider.go` - Lines 140-187

#### Check 1: Daakia Token (Line 152-156)
- **What:** Checks if `daakia_jwt_token` exists
- **If missing:** ❌ Login fails
- **Error:** `api.user.login_by_oauth.missing_token.app_error`

#### Check 2: Organization Data Exists (Line 158-163)
- **What:** Checks if `organization_name` exists and is not empty
- **If missing or empty (`[]`):** ❌ Login fails
- **Error:** `daakia.invalid_active_org.app_error`
- **Message:** "You are not part of any organization. Please contact your administrator."

#### Check 3: At Least One Valid Organization (Line 165-187)
- **What:** Checks if there is at least one valid organization in the array
- **If no valid orgs:** ❌ Login fails
- **Error:** `daakia.invalid_active_org.app_error`
- **Message:** "You are not part of any organization. Please contact your administrator."

**Why these checks are here:**
- If data is missing, we stop immediately
- No user is created
- No team is created
- Login fails fast

---

### Step 6: Create or Update User

**What happens:**
- If user doesn't exist → Create new user
- If user exists → Update user information

**Code Location:** `server/channels/app/user.go` - Function `CreateOAuthUser` (Line 352)

**After this step:**
- User exists in Mattermost database
- User has organization data stored

---

### Step 7: Add User to Team Based on Organization

**What happens:**
- Mattermost looks at the user's active organization
- Finds or creates a team with that organization's name
- Adds user to that team

**Code Location:** `server/channels/app/user.go` - Function `AddUserToTeamByOrganization` (Line 458)

**This is called from:** `server/channels/app/user.go` - Line 411

---

## All Checks and Validations

### Check 1: User Object Valid (Line 459-464)

**Location:** `server/channels/app/user.go` - Lines 459-464

**What it checks:**
- User object is not empty
- User has an ID
- User has Props (properties)

**If fails:** Returns `nil` (skips team assignment)

---

### Check 2: Organization Data in User Props (Line 465-468)

**Location:** `server/channels/app/user.go` - Lines 465-468

**What it checks:**
- `organization_name` exists in user properties
- `organization_name` is not empty

**If fails:** Returns `nil` (skips team assignment)

**Note:** This should never happen because Step 5 already checked this. This is a safety check.

---

### Check 3: Parse Organization Array (Line 470-475)

**Location:** `server/channels/app/user.go` - Lines 470-475

**What it checks:**
- Can we read the organization data as JSON?
- Is the format correct?

**If fails:** Returns `nil` (skips team assignment)

---

### Check 4: Organization Array Not Empty (Line 477-479)

**Location:** `server/channels/app/user.go` - Lines 477-479

**What it checks:**
- Are there any organizations in the array?

**If fails:** Returns `nil` (skips team assignment)

---

### Check 5: Find Active Organization (Line 500-515)

**Location:** `server/channels/app/user.go` - Lines 500-515

**What it does:**
- Loops through all organizations
- Finds which one has `is_active: true`
- Counts how many are active

**Special Check - Multiple Active Orgs (Line 507-513):**
- If finds 2 or more active orgs → ❌ **STOPS IMMEDIATELY**
- **Error:** `daakia.multiple_active_org.app_error`
- **Message:** "Something went wrong. Please contact support at support@daakia.co.in"
- **Why:** User should have only ONE active organization

---

### Check 6: No Active Organization (Line 518-533)

**Location:** `server/channels/app/user.go` - Lines 518-533

**What it checks:**
- Are there zero active organizations?

**If yes, then:**
1. **Check if user already has teams (Line 520-525):**
   - If user is already in some teams → ✅ Allow login (return nil)
   - User can use existing teams
   
2. **If user has no teams (Line 528-532):**
   - ❌ Login fails
   - **Error:** `daakia.user_not_added_to_org.app_error`
   - **Message:** "You are not added to any organization. Please contact your organization administrator."

**Why this check:**
- Existing users might not have active org selected
- But if they have teams, they can still login
- New users MUST have an active organization

---

### Check 7: Active Organization Name Valid (Line 541-546)

**Location:** `server/channels/app/user.go` - Lines 541-546

**What it checks:**
- Does the active organization have a name?
- Is `organization_name` field not empty?

**If fails:** ❌ Login fails
- **Error:** `daakia.invalid_active_org.app_error`
- **Message:** "You are not part of any organization. Please contact your administrator."

---

### Check 8: Find Team by Organization Name (Line 548-552)

**Location:** `server/channels/app/user.go` - Lines 548-552

**What it does:**
1. Takes organization name (e.g., "My Company")
2. Converts to team name (slug) (e.g., "my-company")
   - Removes spaces, converts to lowercase
   - Example: "My Company" → "my-company"
3. Searches for team with that name

**Code for conversion:** `model.CleanTeamName(activeOrgName)` (Line 549)

**Result:**
- `teamExists = true` → Team found
- `teamExists = false` → Team not found

---

### Check 9: Role-Based Logic

**Location:** `server/channels/app/user.go` - Lines 554-635

#### If Role is "admin" (Line 555-599)

**What happens:**

1. **If team doesn't exist (Line 557-579):**
   - ✅ **Create new team**
   - Team name: slug from organization name
   - Team display name: organization name (cleaned)
   - Team type: Invite only
   - Company name: organization display name

2. **Check domain restrictions (Line 582-590):**
   - Is user's email domain allowed?
   - If not → ❌ Login fails
   - **Error:** `api.team.join_user_to_team.allowed_domains.app_error`
   - **Message:** "The user cannot be added as the domain associated with the account is not permitted. Contact your Organization Administrator for additional details."

3. **Join user to team (Line 592-596):**
   - Adds user as team member
   - If already member → No error (handled by JoinUserToTeam)

4. **Success (Line 598-599):**
   - ✅ Login successful
   - User is in team

#### If Role is "guest" (Line 601-628)

**What happens:**

1. **If team doesn't exist (Line 603-609):**
   - ❌ **Login fails**
   - **Error:** `daakia.guest_workspace_not_found.app_error`
   - **Message:** "Access denied: Your organization workspace needs to be created by an administrator before you can sign in, or you have not been added to use this by your organization administrator."
   - **Why:** Guests cannot create teams, only join existing ones

2. **If team exists:**
   - Check domain restrictions (Line 612-619)
   - Join user to team (Line 621-625)
   - ✅ Login successful

#### If Role is Unknown (Line 631-635)

**What happens:**
- ❌ **Login fails**
- **Error:** `daakia.invalid_role.app_error`
- **Message:** "Something went wrong. Please contact support at support@daakia.co.in"
- **Why:** Role must be either "admin" or "guest"

---

## Error Messages

All error messages are stored in: `server/i18n/en.json`

### Error List:

1. **`daakia.guest_workspace_not_found.app_error`**
   - **When:** Guest user tries to login but team doesn't exist
   - **Message:** "Access denied: Your organization workspace needs to be created by an administrator before you can sign in, or you have not been added to use this by your organization administrator."
   - **Location:** Line 605 in `user.go`

2. **`daakia.user_not_added_to_org.app_error`**
   - **When:** New user with no active organization and no existing teams
   - **Message:** "You are not added to any organization. Please contact your organization administrator."
   - **Location:** Line 530 in `user.go`

3. **`daakia.multiple_active_org.app_error`**
   - **When:** User has 2 or more active organizations
   - **Message:** "Something went wrong. Please contact support at support@daakia.co.in"
   - **Location:** Line 510 in `user.go`

4. **`daakia.invalid_active_org.app_error`**
   - **When:** Organization data is empty or invalid
   - **Message:** "You are not part of any organization. Please contact your administrator."
   - **Location:** 
     - Line 161 in `openid_provider.go` (empty data)
     - Line 184 in `openid_provider.go` (no valid orgs)
     - Line 543 in `user.go` (active org name empty)

5. **`daakia.invalid_role.app_error`**
   - **When:** Role is not "admin" or "guest"
   - **Message:** "Something went wrong. Please contact support at support@daakia.co.in"
   - **Location:** Line 633 in `user.go`

6. **`api.team.join_user_to_team.allowed_domains.app_error`**
   - **When:** User's email domain is not allowed for the team
   - **Message:** "The user cannot be added as the domain associated with the account is not permitted. Contact your Organization Administrator for additional details."
   - **Location:** Line 585 (admin) and Line 614 (guest) in `user.go`

---

## Code Locations

### Main Files:

1. **`server/channels/app/openid_provider.go`**
   - **Function:** `GetUserFromJSON` (Line 27)
   - **What it does:** Receives user data from Daakia, validates it, creates user object
   - **Key checks:** Token exists, organization data exists

2. **`server/channels/app/user.go`**
   - **Function:** `CreateOAuthUser` (Line 352)
   - **What it does:** Creates new user in Mattermost
   - **Calls:** `AddUserToTeamByOrganization` (Line 411)
   
   - **Function:** `AddUserToTeamByOrganization` (Line 458)
   - **What it does:** Finds active org, creates/finds team, adds user to team
   - **Key checks:** Active org exists, role is valid, team exists/created

3. **`server/i18n/en.json`**
   - **What it does:** Stores all error messages
   - **Location:** Lines 4338-4356

---

## Simple Flow Diagram

```
User Clicks Login
    ↓
Daakia SSO Page
    ↓
User Enters Credentials
    ↓
Daakia Sends Data to Mattermost
    ↓
openid_provider.go - GetUserFromJSON()
    ├─ Extract user info (email, name, username)
    ├─ Extract organization data
    ├─ Check: Token exists? → If NO: ❌ Fail
    ├─ Check: Org data exists? → If NO: ❌ Fail
    └─ Check: Valid orgs? → If NO: ❌ Fail
    ↓
user.go - CreateOAuthUser()
    ├─ Create/Update user in database
    └─ Call AddUserToTeamByOrganization()
    ↓
user.go - AddUserToTeamByOrganization()
    ├─ Check: User valid? → If NO: Skip
    ├─ Check: Org data in props? → If NO: Skip
    ├─ Parse organization array
    ├─ Find active organization
    │   ├─ If 2+ active: ❌ Fail (multiple_active_org)
    │   ├─ If 0 active:
    │   │   ├─ User has teams? → ✅ Allow login
    │   │   └─ User has no teams? → ❌ Fail (user_not_added_to_org)
    │   └─ If 1 active: Continue
    ├─ Extract org name and role
    ├─ Check: Org name valid? → If NO: ❌ Fail (invalid_active_org)
    ├─ Convert org name to team name (slug)
    ├─ Find team by name
    └─ Based on role:
        ├─ If "admin":
        │   ├─ Team exists? → Join
        │   └─ Team not exists? → Create + Join
        ├─ If "guest":
        │   ├─ Team exists? → Join
        │   └─ Team not exists? → ❌ Fail (guest_workspace_not_found)
        └─ If other: ❌ Fail (invalid_role)
    ↓
Check domain restrictions
    ├─ Allowed? → ✅ Join team
    └─ Not allowed? → ❌ Fail (allowed_domains)
    ↓
✅ Login Successful!
```

---

## Important Notes

1. **Early Validation:**
   - Most checks happen in `openid_provider.go` BEFORE user is created
   - If data is invalid, login fails immediately
   - No user is created if validation fails

2. **Team Name Conversion:**
   - Organization name: "My Company (Business Account)"
   - Team name (slug): "my-company-business-account"
   - Display name: "My Company"
   - This conversion happens automatically using `CleanTeamName()`

3. **Admin vs Guest:**
   - **Admin:** Can create teams if they don't exist
   - **Guest:** Can only join existing teams, cannot create

4. **Existing Users:**
   - If user already has teams but no active org → Still allowed to login
   - They can use their existing teams

5. **Domain Restrictions:**
   - Teams can have allowed email domains
   - If user's email domain is not allowed → Cannot join team
   - This check happens AFTER team is found/created

---

## Summary

**Simple version:**
1. User logs in → Daakia sends data
2. Mattermost checks data → Is it good?
3. Mattermost finds organization → Which one is active?
4. Mattermost finds or creates team → Based on org name
5. Mattermost adds user to team → Based on role (admin/guest)
6. ✅ Login successful!

**If anything fails:** User sees an error message and login fails.

---

## Questions?

If you need to understand any part better, check the code locations mentioned above. Each check has a line number where you can find it in the code.

