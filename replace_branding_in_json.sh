#!/bin/bash

# Script to replace branding text with "Konnect" in JSON language files only
# Replaces: Mattermost, mattermost, Daakia, daakia, daakia chats, Daakia Chats
# Excludes: technical tokens, URLs, build files

NEW_NAME="Konnect"

echo "=========================================="
echo "Replace Branding with Konnect in JSON Language Files"
echo "=========================================="
echo ""
echo "Replacing in JSON language files only:"
echo "  'Mattermost' -> '$NEW_NAME'"
echo "  'mattermost' -> '$NEW_NAME'"
echo "  'Daakia' -> '$NEW_NAME'"
echo "  'daakia' -> '$NEW_NAME'"
echo "  'daakia chats' -> '$NEW_NAME'"
echo "  'Daakia Chats' -> '$NEW_NAME'"
echo ""
echo "This will EXCLUDE:"
echo "  - daakia_jwt_token (technical token)"
echo "  - daakiaToken (variable names)"
echo "  - URLs (daakia.co.in, mattermost.com, etc.)"
echo "  - Build directories (node_modules, vendor, dist, build, etc.)"
echo ""
# Check if --yes flag is provided
if [[ "$1" == "--yes" ]] || [[ "$1" == "-y" ]]; then
    echo "Auto-confirming (--yes flag provided)..."
    REPLY="y"
else
    read -p "Continue? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cancelled."
        exit 1
    fi
fi

# Function to check if file should be excluded
should_exclude_file() {
    local file="$1"
    # Exclude build directories
    if [[ "$file" =~ /node_modules/ ]] || \
       [[ "$file" =~ /vendor/ ]] || \
       [[ "$file" =~ /dist/ ]] || \
       [[ "$file" =~ /build/ ]] || \
       [[ "$file" =~ /.build/ ]] || \
       [[ "$file" =~ /bin/ ]] || \
       [[ "$file" =~ /.git/ ]] || \
       [[ "$file" =~ /coverage/ ]] || \
       [[ "$file" =~ /.nyc_output/ ]] || \
       [[ "$file" =~ /target/ ]] || \
       [[ "$file" =~ /out/ ]] || \
       [[ "$file" =~ /tmp/ ]] || \
       [[ "$file" =~ /temp/ ]] || \
       [[ "$file" =~ /__pycache__/ ]] || \
       [[ "$file" =~ /.next/ ]] || \
       [[ "$file" =~ /.cache/ ]] || \
       [[ "$file" =~ /packages/ ]] || \
       [[ "$file" =~ /bower_components/ ]]; then
        return 0  # Exclude
    fi
    return 1  # Don't exclude
}

# Counter for replacements
REPLACEMENTS=0

# Find and replace in JSON language files (i18n files)
echo "Processing JSON language files..."
find server/i18n/ webapp/channels/src/i18n/ -type f -name "*.json" 2>/dev/null | while read file; do
    if should_exclude_file "$file"; then
        continue
    fi
    
    # Check if file contains mattermost or daakia (case-insensitive)
    if grep -qi "mattermost\|daakia" "$file" 2>/dev/null; then
        # Create backup
        cp "$file" "${file}.bak" 2>/dev/null
        
        # Replace "Daakia Chats" first (longest match first)
        sed -i.tmp "s/Daakia Chats/$NEW_NAME/g" "$file" 2>/dev/null
        
        # Replace "daakia chats" 
        sed -i.tmp "s/daakia chats/$NEW_NAME/g" "$file" 2>/dev/null
        
        # Replace "Mattermost" (capitalized)
        sed -i.tmp "s/Mattermost/$NEW_NAME/g" "$file" 2>/dev/null
        
        # Replace "Daakia" (capitalized) but not in URLs
        sed -i.tmp "s/Daakia/$NEW_NAME/g" "$file" 2>/dev/null
        
        # Replace "mattermost" (lowercase) but exclude tokens and URLs
        # Handle all cases: standalone, in sentences, etc.
        sed -i.tmp "s/mattermost/$NEW_NAME/gi" "$file" 2>/dev/null
        
        # Replace "daakia" (lowercase) but exclude tokens and URLs  
        # Handle all cases: standalone, in sentences, etc.
        sed -i.tmp "s/daakia/$NEW_NAME/gi" "$file" 2>/dev/null
        
        # Restore technical tokens (must be exact matches)
        sed -i.tmp "s/${NEW_NAME}_jwt_token/daakia_jwt_token/g" "$file" 2>/dev/null
        sed -i.tmp "s/${NEW_NAME}Token/daakiaToken/g" "$file" 2>/dev/null
        
        # Restore error IDs that contain daakia. prefix (keep the prefix) - only for error IDs
        # Match patterns like "daakia.something.app_error" or "daakia.something"
        sed -i.tmp "s/${NEW_NAME}\.\([a-z_]*\)\.app_error/daakia.\1.app_error/g" "$file" 2>/dev/null
        sed -i.tmp "s/${NEW_NAME}\.\([a-z_]*\)\./daakia.\1./g" "$file" 2>/dev/null
        
        # Restore URLs (keep original domains) - be more specific to avoid false matches
        sed -i.tmp "s|${NEW_NAME}\.co\.in|daakia.co.in|g" "$file" 2>/dev/null
        sed -i.tmp "s|www\.${NEW_NAME}|www.daakia|g" "$file" 2>/dev/null
        sed -i.tmp "s|https://.*${NEW_NAME}\.co|https://daakia.co|g" "$file" 2>/dev/null
        sed -i.tmp "s|http://.*${NEW_NAME}\.co|http://daakia.co|g" "$file" 2>/dev/null
        sed -i.tmp "s|${NEW_NAME}\.com|mattermost.com|g" "$file" 2>/dev/null
        sed -i.tmp "s|www\.${NEW_NAME}|www.mattermost|g" "$file" 2>/dev/null
        sed -i.tmp "s|https://.*${NEW_NAME}\.com|https://mattermost.com|g" "$file" 2>/dev/null
        sed -i.tmp "s|http://.*${NEW_NAME}\.com|http://mattermost.com|g" "$file" 2>/dev/null
        # Restore email addresses
        sed -i.tmp "s|@${NEW_NAME}\.co|@daakia.co|g" "$file" 2>/dev/null
        sed -i.tmp "s|@${NEW_NAME}\.com|@mattermost.com|g" "$file" 2>/dev/null
        
        # Remove temp file
        rm -f "${file}.tmp" 2>/dev/null
        
        # Check if file was actually modified
        if ! diff -q "$file" "${file}.bak" > /dev/null 2>&1; then
            REPLACEMENTS=$((REPLACEMENTS + 1))
            echo "  ✓ Modified: $file"
        fi
        
        # Remove backup
        rm -f "${file}.bak" 2>/dev/null
    fi
done

echo ""
echo "=========================================="
echo "Replacement complete!"
echo "=========================================="
echo ""
echo "Files processed from:"
echo "  - server/i18n/"
echo "  - webapp/channels/src/i18n/"
echo ""
echo "Please review the changes:"
echo "  git diff server/i18n/ webapp/channels/src/i18n/"
echo ""
echo "To undo changes, run:"
echo "  git checkout server/i18n/ webapp/channels/src/i18n/"
echo ""

