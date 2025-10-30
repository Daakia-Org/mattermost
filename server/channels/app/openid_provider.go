// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

package app

// NOTE: Changed in branch feat/openid (marker for review visibility)

import (
    "encoding/json"
    "io"
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

 