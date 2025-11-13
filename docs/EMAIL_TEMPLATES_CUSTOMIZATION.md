# Email Templates Customization - Konnect by Daakia

## Overview
This document details all changes made to email templates and email-related code for "Konnect by Daakia" branding.

**Last Updated:** November 13, 2025

---

## Table of Contents
1. [Translation Files (i18n)](#translation-files-i18n)
2. [Email Code Changes](#email-code-changes)
3. [Email Template Files](#email-template-files)
4. [Summary of Changes](#summary-of-changes)

---

## Translation Files (i18n)

### File: `server/i18n/en.json`

All email-related translations have been updated from "Mattermost" to "Konnect by Daakia".

### Email Footer
**ID:** `api.templates.email_footer_v2`
```json
{
  "id": "api.templates.email_footer_v2",
  "translation": "© 2025 Konnect by Daakia"
}
```
**Location in code:** Used in all email templates footer section

---

### Invite Email Templates

#### Invite Body - Subtitle
**ID:** `api.templates.invite_body.subTitle`
```json
{
  "id": "api.templates.invite_body.subTitle",
  "translation": "Start collaborating with your team on Konnect by Daakia"
}
```

#### Invite Body - Title
**ID:** `api.templates.invite_body.title`
```json
{
  "id": "api.templates.invite_body.title",
  "translation": "{{ .SenderName }} invited you to join the {{ .TeamDisplayName }} team."
}
```

#### Invite Footer - Title
**ID:** `api.templates.invite_body_footer.title`
```json
{
  "id": "api.templates.invite_body_footer.title",
  "translation": "What is Konnect by Daakia?"
}
```

#### Invite Footer - Info
**ID:** `api.templates.invite_body_footer.info`
```json
{
  "id": "api.templates.invite_body_footer.info",
  "translation": "Konnect by Daakia is a flexible, open source messaging platform that enables secure team collaboration."
}
```

---

### Welcome Email Templates

#### Welcome Body - Info
**ID:** `api.templates.welcome_body.info`
```json
{
  "id": "api.templates.welcome_body.info",
  "translation": "This email address was used to create an account with Konnect by Daakia."
}
```

#### Welcome Body - Title
**ID:** `api.templates.welcome_body.title`
```json
{
  "id": "api.templates.welcome_body.title",
  "translation": "Welcome to the team"
}
```

---

### Email Verification Templates

#### Verify Body - Info
**ID:** `api.templates.verify_body.info`
```json
{
  "id": "api.templates.verify_body.info",
  "translation": "This email address was used to create an account with Konnect by Daakia."
}
```

#### Verify Body - Subtitle 1
**ID:** `api.templates.verify_body.subTitle1`
```json
{
  "id": "api.templates.verify_body.subTitle1",
  "translation": "Thanks for joining "
}
```

---

### License Renewal Templates

#### License Up for Renewal - Title
**ID:** `api.templates.license_up_for_renewal_title`
```json
{
  "id": "api.templates.license_up_for_renewal_title",
  "translation": "Your Konnect by Daakia subscription is up for renewal"
}
```

#### License Up for Renewal - Subtitle
**ID:** `api.templates.license_up_for_renewal_subtitle`
```json
{
  "id": "api.templates.license_up_for_renewal_subtitle",
  "translation": "{{.UserName}}, your subscription is set to expire in {{.Days}} days. We hope you're experiencing the flexible, secure team collaboration that Konnect by Daakia enables. Renew soon to ensure your team can keep enjoying these benefits."
}
```

#### Remove Expired License - Subject
**ID:** `api.templates.remove_expired_license.subject`
```json
{
  "id": "api.templates.remove_expired_license.subject",
  "translation": "Konnect by Daakia Enterprise license has been disabled."
}
```

---

### Notification Email Templates

#### Post Body - Button
**ID:** `api.templates.post_body.button`
```json
{
  "id": "api.templates.post_body.button",
  "translation": "Reply in Konnect"
}
```
**Note:** Changed from "Reply in Mattermost" to "Reply in Konnect"

---

### Cloud Welcome Email Templates

#### Cloud Welcome - Button
**ID:** `api.templates.cloud_welcome_email.button`
```json
{
  "id": "api.templates.cloud_welcome_email.button",
  "translation": "Open Konnect"
}
```

#### Cloud Welcome - Download MM Info
**ID:** `api.templates.cloud_welcome_email.download_mm_info`
```json
{
  "id": "api.templates.cloud_welcome_email.download_mm_info",
  "translation": "Download the Konnect by Daakia App"
}
```

#### Cloud Welcome - Title
**ID:** `api.templates.cloud_welcome_email.title`
```json
{
  "id": "api.templates.cloud_welcome_email.title",
  "translation": "Your workspace is ready to go!"
}
```

---

## Email Code Changes

### File: `server/channels/app/email/email.go`

#### Change 1: Support Email Address
**Lines:** 80, 926

**Before:**
```go
data.Props["SupportEmail"] = "feedback@mattermost.com"
```

**After:**
```go
data.Props["SupportEmail"] = "support@daakia.co.in"
```

**Used in:**
- Email change verification emails
- License renewal emails
- Questions footer in various emails

---

#### Change 2: App Marketplace Link
**Line:** 261

**Before:**
```go
data.Props["AppMarketPlaceLink"] = "https://integrations.mattermost.com/"
```

**After:**
```go
data.Props["AppMarketPlaceLink"] = "https://daakia.co.in/integrations"
```

**Used in:**
- Cloud welcome email template
- Shows link to app marketplace/integrations

---

#### Change 3: Download Apps Link
**Line:** 269

**Before:**
```go
data.Props["DownloadMMAppsLink"] = "https://mattermost.com/pl/download-apps"
```

**After:**
```go
data.Props["DownloadMMAppsLink"] = "https://daakia.co.in/download-apps"
```

**Used in:**
- Cloud welcome email template
- Fallback link when `NativeAppSettings.AppDownloadLink` is not configured
- Links to download desktop and mobile apps

---

## Email Template Files

### Template Structure
Email templates are located in `server/templates/` directory:

- **MJML Templates** (`.mjml`): Source templates that compile to HTML
- **HTML Templates** (`.html`): Compiled or direct HTML templates

### Key Template Files

#### 1. `invite_body.mjml`
- Uses translation variables from i18n
- Footer includes: `{{.Props.InviteFooterTitle}}` and `{{.Props.InviteFooterInfo}}`
- Link to: `https://daakia.co.in` (line 35)

#### 2. `welcome_body.mjml`
- Uses translation variables from i18n
- All text comes from translation keys

#### 3. `verify_body.mjml`
- Uses translation variables from i18n
- Verification button and messages

#### 4. `messages_notification.mjml`
- Notification emails for new messages
- Uses "Reply in Konnect" button text

#### 5. `cloud_welcome_email.html`
- Cloud workspace welcome email
- Uses all cloud welcome email translation keys
- Support email: `support@daakia.co.in` (line 135)

### Partial Templates

#### `partials/email_footer.mjml`
- Footer section used in all emails
- Displays: `{{.Props.Organization}}` and `{{.Props.FooterV2}}`
- FooterV2 shows: "© 2025 Konnect by Daakia"

#### `partials/logo.mjml`
- Logo image for emails
- Uses: `{{.Props.SiteURL}}/static/images/logo_email_dark.png`

---

## Summary of Changes

### Translation Keys Updated (15+ keys)
1. ✅ Email footer copyright
2. ✅ Invite email subtitle
3. ✅ Invite footer title and info
4. ✅ Welcome email info
5. ✅ Verify email info
6. ✅ License renewal title and subtitle
7. ✅ Remove expired license subject
8. ✅ Post body button ("Reply in Konnect")
9. ✅ Cloud welcome button
10. ✅ Cloud welcome download info
11. ✅ All other email-related translations

### Code Changes (3 locations)
1. ✅ Support email: `feedback@mattermost.com` → `support@daakia.co.in` (2 occurrences)
2. ✅ App marketplace link: `integrations.mattermost.com` → `daakia.co.in/integrations`
3. ✅ Download apps link: `mattermost.com/pl/download-apps` → `daakia.co.in/download-apps`

### Template Files
- ✅ All template files use translation variables (no hardcoded text)
- ✅ Links in templates point to `daakia.co.in` where applicable
- ✅ Support email in cloud welcome template: `support@daakia.co.in`

---

## Email Types Covered

### User Account Emails
- ✅ Welcome email
- ✅ Email verification
- ✅ Password reset
- ✅ Email change verification
- ✅ Account deactivation

### Invitation Emails
- ✅ Team invite
- ✅ Channel invite
- ✅ Guest invite
- ✅ Team and channel invite

### Notification Emails
- ✅ New message notifications
- ✅ Direct message notifications
- ✅ Group message notifications

### System Emails
- ✅ License renewal
- ✅ License expired
- ✅ IP filters changed
- ✅ MFA changes
- ✅ Password changes
- ✅ Username changes
- ✅ Sign-in method changes

### Cloud-Specific Emails
- ✅ Cloud welcome email
- ✅ Cloud upgrade confirmation
- ✅ Cloud renewal notifications
- ✅ Cloud arrears notifications (7, 14, 30, 45, 90 days)

---

## Testing Checklist

After making these changes, test the following emails:

- [ ] Welcome email shows "Konnect by Daakia" branding
- [ ] Invite email shows "Konnect by Daakia" in footer
- [ ] Email verification mentions "Konnect by Daakia"
- [ ] Notification emails show "Reply in Konnect" button
- [ ] Cloud welcome email shows correct branding
- [ ] Support email links point to `support@daakia.co.in`
- [ ] App marketplace link points to `daakia.co.in/integrations`
- [ ] Download apps link points to `daakia.co.in/download-apps`
- [ ] License renewal emails show "Konnect by Daakia" branding
- [ ] Email footer shows "© 2025 Konnect by Daakia"

---

## How to Rebuild Email Templates

If you modify MJML templates, rebuild them:

```bash
cd server/templates
make build
```

This compiles all `.mjml` files to `.html` files.

---

## Files Modified

### Translation Files:
1. `server/i18n/en.json` - All email-related translation keys

### Code Files:
2. `server/channels/app/email/email.go` - Hardcoded URLs and email addresses

### Template Files (No direct changes needed):
- All templates use translation variables, so changes are in i18n files
- `server/templates/invite_body.mjml` - Contains link to `daakia.co.in`
- `server/templates/cloud_welcome_email.html` - Contains support email

---

## Notes

1. **Translation Variables**: All user-facing text in emails comes from translation files, making it easy to update branding across all languages.

2. **Hardcoded URLs**: Some URLs are hardcoded in `email.go` and need to be changed there (already done).

3. **Multi-language Support**: Only English (`en.json`) has been updated. Other language files may still contain "Mattermost" references if you support multiple languages.

4. **Logo Images**: Email templates reference logo images at `{{.Props.SiteURL}}/static/images/logo_email_dark.png`. Ensure your logo files are properly branded.

5. **Support Email**: The support email `support@daakia.co.in` is used in:
   - Email change verification
   - License renewal emails
   - Cloud welcome email
   - Questions footer

---

## Future Considerations

1. **Other Languages**: Update other language files (`de.json`, `fr.json`, etc.) if you support multiple languages.

2. **Logo Files**: Replace logo images in `webapp/channels/src/static/images/` with Konnect by Daakia logos.

3. **Custom Domains**: If you have custom domains for integrations or downloads, update those URLs accordingly.

4. **Email Styling**: Consider customizing email template colors and styling to match Konnect by Daakia branding.

---

## Contact

For questions about email template customizations:
- Project: Konnect by Daakia
- Support Email: support@daakia.co.in
- Website: https://daakia.co.in

---

**END OF EMAIL TEMPLATES DOCUMENTATION**

