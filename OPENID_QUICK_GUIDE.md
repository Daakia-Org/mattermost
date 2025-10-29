# OpenID Connect Quick Reference Guide

## 🚀 What Was Done

Enabled **OpenID Connect SSO** in Mattermost open-source edition by:
1. ✅ Creating custom OIDC provider (`openid_provider.go`)
2. ✅ Bypassing enterprise license checks via developer mode
3. ✅ Fixing OAuth cookie issues for localhost
4. ✅ Adding comprehensive logging

## 📁 Files Changed

### Created:
- `server/channels/app/openid_provider.go` (121 lines) - **NEW FILE**

### Modified:
- `server/channels/app/channels.go` - Added provider registration
- `server/config/client.go` - Added license bypass logic
- `server/channels/app/oauth.go` - Fixed cookies & added logging
- `server/config/config.json` - Enabled developer mode & OIDC settings

## ⚙️ Configuration

### Required Settings in `config.json`:

```json
{
  "ServiceSettings": {
    "EnableDeveloper": true,  // ← License bypass
    "EnableTesting": true     // ← License bypass
  },
  "OpenIdSettings": {
    "Enable": true,
    "ButtonText": "Daakia Connect",
    "ButtonColor": "#fff",
    "AuthEndpoint": "http://localhost:3001/oidc/auth",
    "TokenEndpoint": "http://localhost:3001/oidc/token",
    "UserAPIEndpoint": "http://localhost:3001/oidc/me"
  }
}
```

## 🔑 Key Concepts

### License Bypass
- Developer mode = `EnableDeveloper: true` + `EnableTesting: true`
- Allows enterprise features without license
- **For development only!**

### Provider Registration
- Custom provider registers in `channels.go:NewChannels()`
- Uses Mattermost's `einterfaces` provider system
- Registered as service type `"openid"`

### OIDC Claims Mapping
- `sub` → `AuthData` (unique ID)
- `email` → `Email`
- `preferred_username` → `Username`
- `given_name` / `family_name` → `FirstName` / `LastName`

## 🧪 Test It

```bash
# 1. Start OIDC server
cd /path/to/auth && node server.js

# 2. Start Mattermost
cd server && make run-server

# 3. Visit http://localhost:8065/login
# 4. Click "Daakia Connect"
# 5. Login with user1
```

## 📊 Flow Diagram

```
User clicks "Daakia Connect"
  ↓
GET /oauth/openid/login
  ↓
Redirect to OIDC server (localhost:3001/oidc/auth)
  ↓
User logs in → OIDC redirects back with code
  ↓
GET /signup/openid/complete?code=xxx
  ↓
Exchange code for token
  ↓
Fetch userinfo from /oidc/me
  ↓
openid_provider.go maps claims → Mattermost user
  ↓
Create/update user in database
  ↓
✅ User logged in!
```

## 🔍 Troubleshooting

**Button not showing?**
- Check `EnableDeveloper` and `EnableTesting` are both `true`
- Clear browser cache
- Check `/api/v4/config/client` response for `EnableSignUpWithOpenId: "true"`

**"Invalid state token" error?**
- Cookie SameSite fix applied automatically for localhost
- Ensure browser allows cookies for `localhost:8065`

**Provider not registered?**
- Look for `"✅ OpenID OAuth provider registered successfully"` in logs
- Check `channels.go:NewChannels()` calls `RegisterOpenIDProvider()`

## 📖 Full Documentation

See `OPENID_IMPLEMENTATION_DOC.md` for complete details.

---

**Status**: ✅ Working  
**Last Updated**: October 29, 2025

