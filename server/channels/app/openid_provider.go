// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

package app

// NOTE: Changed in branch feat/openid (marker for review visibility)

import (
    "encoding/json"
    "io"
    "net/http"
    "strings"

    "github.com/mattermost/mattermost/server/public/model"
    "github.com/mattermost/mattermost/server/public/shared/request"
    "github.com/mattermost/mattermost/server/v8/einterfaces"
)

type OpenIDProvider struct{}

// RegisterOpenIDProvider registers the OpenID OAuth provider
func RegisterOpenIDProvider() {
  provider := &OpenIDProvider{}
  einterfaces.RegisterOAuthProvider(model.ServiceOpenid, provider)
}

func (o *OpenIDProvider) GetUserFromJSON(rctx request.CTX, data io.Reader, tokenUser *model.User) (*model.User, error) {
  // If tokenUser is already provided from ID token, we still need to parse the userinfo
  // to ensure all fields (especially AuthData) are properly set

  // Decode the JSON response into OpenID Connect claims
  var claims map[string]interface{}
  decoder := json.NewDecoder(data)
  if err := decoder.Decode(&claims); err != nil {
    return nil, err
  }

  // Create new user and map OpenID Connect standard claims to Mattermost user
  user := &model.User{}

  if sub, ok := claims["sub"].(string); ok && sub != "" {
    user.AuthData = &sub
  }

  if email, ok := claims["email"].(string); ok && email != "" {
    user.Email = strings.ToLower(email)
  }

  if name, ok := claims["name"].(string); ok && name != "" {
    nameParts := strings.Split(name, " ")
    if len(nameParts) > 0 {
      user.FirstName = nameParts[0]
    }
    if len(nameParts) > 1 {
      user.LastName = strings.Join(nameParts[1:], " ")
    }
  }


  // take user name from token using the claims 
  if username, ok := claims["username"].(string); ok && username != "" {
	user.Username = username
  } 


  // Fallback: use email as username if no username provided
  if user.Username == "" && user.Email != "" {
    user.Username = strings.Split(user.Email, "@")[0]
  }

  // Ensure AuthData is NEVER nil (required for OAuth)
  // Use sub first, fall back to email
  if user.AuthData == nil || *user.AuthData == "" {
    if user.Email != "" {
      user.AuthData = &user.Email
    } else {
      // Last resort: use a generated ID
      fallbackAuth := "openid_user_" + strings.TrimSpace(user.Username)
      user.AuthData = &fallbackAuth
    }
  }

  // Extract daakia_jwt_token from claims and store in Props
  // This token is passed from the OIDC provider in the userinfo endpoint response
  if daakiaToken, ok := claims["daakia_jwt_token"].(string); ok && daakiaToken != "" {
    // Initialize Props map if nil
    if user.Props == nil {
      user.Props = make(map[string]string)
    }
    // Store the token in Props for persistence across sessions
    user.Props["daakia_jwt_token"] = daakiaToken
  }

  // Extract organization_name from claims and store in Props.
  // The provider sends an array of organization objects with:
  // - organization_name: string (required)
  // - user_role: "admin" | "guest"
  // - is_active: boolean
  if raw, ok := claims["organization_name"]; ok {
    var value string

    switch v := raw.(type) {
    case string:
      // Legacy format: plain string (for backward compatibility)
      value = v
    case []interface{}:
      // New format: array of organization objects
      orgs := make([]map[string]interface{}, 0, len(v))
      for _, item := range v {
        if orgObj, ok := item.(map[string]interface{}); ok {
          // Validate required field exists (organization_name only)
          if orgName, hasName := orgObj["organization_name"]; hasName && orgName != nil {
            // Valid organization object - add to array
            orgs = append(orgs, orgObj)
          }
        } else if s, ok := item.(string); ok && s != "" {
          // Legacy format: array of strings (for backward compatibility)
          orgs = append(orgs, map[string]interface{}{
            "organization_name": s,
          })
        }
      }
      
      // Marshal the array of organization objects to JSON string
      if len(orgs) > 0 {
        if b, err := json.Marshal(orgs); err == nil {
        value = string(b)
        }
      }
    }

    if value != "" {
      if user.Props == nil {
        user.Props = make(map[string]string)
      }
      user.Props["organization_name"] = value
    }
  }

  // VALIDATION: Check if required fields are present and not empty
  // This fails early for both new user signups and existing user logins
  daakiaToken := ""
  if user.Props != nil {
    daakiaToken = user.Props["daakia_jwt_token"]
  }
  
  orgName := ""
  if user.Props != nil {
    orgName = user.Props["organization_name"]
  }

  // Fail if daakia_jwt_token is missing or empty
  if daakiaToken == "" {
    return nil, model.NewAppError("GetUserFromJSON", "api.user.login_by_oauth.missing_token.app_error",
      map[string]any{"Field": "daakia_jwt_token"}, "daakia_jwt_token is required for SSO login", http.StatusBadRequest)
  }

  // Fail if organization_name is missing or empty
  // Check for empty string or empty JSON array "[]"
  if orgName == "" || orgName == "[]" {
    return nil, model.NewAppError("GetUserFromJSON", "api.user.login_by_oauth.missing_org.app_error",
      map[string]any{"Field": "organization_name"}, "organization_name is required for SSO login", http.StatusBadRequest)
  }

  // Validate that organization_name contains at least one valid organization object
  // Try to parse as JSON array to ensure it's valid
  var orgsArray []interface{}
  if err := json.Unmarshal([]byte(orgName), &orgsArray); err == nil {
    // Valid JSON array - check if it has at least one valid organization
    validOrgCount := 0
    for _, item := range orgsArray {
      if orgObj, ok := item.(map[string]interface{}); ok {
        // Check for required field: organization_name only
        if orgName, hasName := orgObj["organization_name"]; hasName && orgName != nil {
          validOrgCount++
        }
      } else if s, ok := item.(string); ok && s != "" {
        // Legacy format: string is valid
        validOrgCount++
      }
    }
    
    if validOrgCount == 0 {
      return nil, model.NewAppError("GetUserFromJSON", "api.user.login_by_oauth.invalid_org.app_error",
        map[string]any{"Field": "organization_name"}, "organization_name must contain at least one valid organization", http.StatusBadRequest)
    }
  }

  return user, nil
}

func (o *OpenIDProvider) GetSSOSettings(rctx request.CTX, config *model.Config, service string) (*model.SSOSettings, error) {
  return &config.OpenIdSettings, nil
}

func (o *OpenIDProvider) GetUserFromIdToken(rctx request.CTX, idToken string) (*model.User, error) {
  // Basic implementation - in production you'd validate and decode the JWT
  return &model.User{}, nil
}

func (o *OpenIDProvider) IsSameUser(rctx request.CTX, dbUser, oAuthUser *model.User) bool {
  if dbUser.AuthData == nil || oAuthUser.AuthData == nil {
    return false
  }
  return *dbUser.AuthData == *oAuthUser.AuthData
}

 