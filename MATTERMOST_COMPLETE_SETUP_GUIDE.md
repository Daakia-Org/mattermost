# Mattermost Complete Setup & Build Guide

## 🎯 Overview
This guide covers the complete process of setting up, building, and customizing Mattermost from source code, including custom navigation and home section implementation.

## 📋 Prerequisites
- macOS (Apple Silicon or Intel)
- Docker Desktop installed
- Go 1.21+ installed
- Node.js 18+ installed
- Git

## 🚀 Step-by-Step Setup

### **Step 1: Clone and Setup**
```bash
git clone https://github.com/mattermost/mattermost.git
cd mattermost
```

### **Step 2: Start Development Environment**
```bash
cd server
make run-server
```
**What this does:**
- ✅ Detects Apple Silicon and applies elasticsearch override
- ✅ Creates go.work file
- ✅ Starts Docker containers (postgres, redis, minio, inbucket)
- ✅ Starts Mattermost server in background

### **Step 3: Verify Server is Running**
```bash
# Check if server process is running
ps aux | grep mattermost

# Check if server responds
curl -s -o /dev/null -w "%{http_code}" http://localhost:8065

# Check Docker containers
docker ps
```

### **Step 4: Create Admin User (First Time Setup)**
Since this is a fresh installation, you need to create the first admin user:

```bash
# Create user via API
curl -X POST http://localhost:8065/api/v4/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@localhost",
    "username": "admin",
    "password": "admin123",
    "nickname": "Admin User"
  }'

# Make user admin via database
docker exec -it mattermost-postgres psql -U mmuser -d mattermost_test \
  -c "UPDATE users SET roles = 'system_admin system_user' WHERE username = 'admin';"
```

**Admin Credentials:**
- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@localhost`

### **Step 5: Build Webapp (Channels)**
```bash
cd webapp/channels
npm install
npm run build
```
**Expected Output:** "webpack compiled successfully" with warnings (normal)

### **Step 6: Build Complete Webapp**
```bash
cd ../..
npm run build
```
**What this does:**
- Builds platform components (shared utilities)
- Builds channels (main app)
- Creates complete webapp package

### **Step 7: Build Server**
```bash
cd server
make build
```
**What this does:**
- Compiles Go server binaries
- Includes built webapp
- Creates binaries for multiple platforms

### **Step 8: Create Distribution Package**
```bash
make package
```
**Output Location:** `server/dist/mattermost-*.tar.gz`

## 🏠 Custom Home Section Architecture

### **What is the Home Section?**
The Home section is a custom navigation area that replaces standard Mattermost team switching with organized workspace sections:

- **Home**: Dashboard, Analytics, Reports, Teams, Settings
- **Organization**: Standard Mattermost channels and messaging
- **Calendar**: (Planned) Calendar integration
- **Meetings**: (Planned) Video conferencing
- **Tasks**: (Planned) Task management
- **Files**: (Planned) File management
- **Bhashika**: (Planned) Voice features

### **Why Home Section Was Created**
1. **Better Organization**: Separate workspace functions from communication
2. **User Experience**: Intuitive navigation similar to modern apps
3. **Scalability**: Easy to add new features without cluttering
4. **Memory**: Remembers last visited page like Mattermost channels

### **How Home Navigation Works**

**Smart Memory System:**
```typescript
// Same pattern as Mattermost channels
getLastVisitedHomePage(userId, teamName)  // Get last page
setLastVisitedHomePage(userId, teamName, page)  // Store page
```

**Navigation Flow:**
1. Click **Home** → Checks localStorage → Redirects to last visited page
2. Click **Organization** → Uses Mattermost's system → Redirects to last channel
3. Navigate within Home → Automatically updates localStorage

**Key Files:**
- `utils/home_storage.ts` - Memory management
- `components/home_controller/` - Route handling
- `components/home_redirect/` - Smart redirects
- `components/team_sidebar/` - Custom navigation

### **Current Home Routes (Active)**
```
/{team}/home/dashboard    ✅ Dashboard page
/{team}/home/analytics    ✅ Analytics page  
/{team}/home/reports      ✅ Reports page
/{team}/home              ✅ Smart redirect to last visited
```

### **Planned Home Routes (Disabled)**
```
/{team}/home/teams        🚧 Team management
/{team}/home/settings     🚧 Workspace settings
/{team}/calendar          🚧 Calendar integration
/{team}/meetings          🚧 Video meetings
/{team}/tasks             🚧 Task manager
/{team}/files             🚧 File management
/{team}/bhashika          🚧 Voice features
```

### **Step 9: Enable Additional Home Routes**
To activate planned features:

1. **Add route to HomeController:**
```typescript
<Route
    path={`/:team(${TEAM_NAME_PATH_PATTERN})/home/teams`}
    component={TeamsManager}
/>
```

2. **Create component:**
```bash
mkdir webapp/channels/src/components/teams_manager
# Create component files
```

3. **Update navigation:**
```typescript
// In team_sidebar.tsx - remove disabled: true
{
    id: 'teams',
    icon: 'icon-account-multiple',
    tooltip: 'Teams',
    active: false,
    disabled: false,  // Enable this
}
```

## 🔧 Customization: Replace Mattermost Logo with Daakia

### **Step 10: Find Logo Files**
```bash
find . -name "*.png" -o -name "*.svg" | grep -i logo
find . -name "*.png" -o -name "*.svg" | grep -i mattermost
```

### **Step 11: Replace Logos**
1. **Prepare your Daakia logo** (PNG/SVG format)
2. **Replace files** in these locations:
   - `webapp/channels/src/images/` - Main app logos
   - `webapp/channels/src/components/` - Component logos
   - `server/templates/` - Email templates

### **Step 12: Rebuild After Changes**
```bash
cd webapp/channels && npm run build
cd ../../server && make build && make package
```

## 📁 File Locations

### **Build Outputs:**
- **Webapp**: `webapp/channels/dist/`
- **Server Binaries**: `server/bin/linux_amd64/`, `server/bin/linux_arm64/`
- **Final Packages**: `server/dist/mattermost-*.tar.gz`

### **Logo Locations:**
- **Main App**: `webapp/channels/src/images/`
- **Email Templates**: `server/templates/`
- **Favicon**: `webapp/channels/src/images/favicon/`

### **Home System Files:**
- **Storage**: `webapp/channels/src/utils/home_storage.ts`
- **Controller**: `webapp/channels/src/components/home_controller/`
- **Redirect**: `webapp/channels/src/components/home_redirect/`
- **Navigation**: `webapp/channels/src/components/team_sidebar/`

## 🚨 Troubleshooting

### **Common Issues:**
1. **"Invalid or expired session"** → Clear browser cache/cookies
2. **CSRF token errors** → Restart server and clear browser data
3. **Build failures** → Check Node.js and Go versions
4. **Docker issues** → Restart Docker Desktop

### **Useful Commands:**
```bash
# Stop server
pkill -f mattermost

# Stop webapp
pkill -f "tsc|rollup|webpack"

# Check logs
tail -f mattermost.log

# Restart everything
make run-server
cd ../webapp/channels && npm run build:watch
```

## 🎉 Success Indicators

✅ **Server running** on localhost:8065  
✅ **Admin user created** and can login  
✅ **Webapp built** without errors  
✅ **Server compiled** for target platforms  
✅ **Tar package created** in server/dist/  
✅ **Custom logos** replaced throughout  
✅ **Home navigation** working with memory  
✅ **Smart redirects** functioning properly  

## 🔄 Development Workflow

### **For Home Section Changes:**
1. **Add new routes** in `home_controller.tsx`
2. **Create components** for new features
3. **Update navigation** in `team_sidebar.tsx`
4. **Test memory system** works correctly
5. **Rebuild webapp** and test

### **For General Changes:**
1. **Make changes** to code/logos
2. **Rebuild webapp** if frontend changes
3. **Rebuild server** if backend changes
4. **Test changes** in browser
5. **Create package** when ready to deploy

## 🧠 Home Memory System Details

**How It Works:**
- Uses localStorage with keys: `home_last_visited_{userId}_{teamName}`
- Automatically tracks navigation within home sections
- Falls back to dashboard if no history exists
- Scoped per user and team (no conflicts)

**Same Pattern as Mattermost:**
- Organization button uses Mattermost's channel memory
- Home button uses identical localStorage pattern
- Both remember last visited location
- Both have smart fallbacks

---

**Happy Mattermost-ing! 🚀**
