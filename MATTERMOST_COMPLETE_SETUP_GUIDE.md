# Mattermost Complete Setup & Build Guide

## 🎯 Overview
This guide covers the complete process of setting up, building, and customizing Mattermost from source code.

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

## 🔧 Customization: Replace Mattermost Logo with Daakia

### **Step 9: Find Logo Files**
The Mattermost logo appears in several places:
```bash
# Main logo files
find . -name "*.png" -o -name "*.svg" | grep -i logo
find . -name "*.png" -o -name "*.svg" | grep -i mattermost
```

### **Step 10: Replace Logos**
1. **Prepare your Daakia logo** (PNG/SVG format)
2. **Replace files** in these locations:
   - `webapp/channels/src/images/` - Main app logos
   - `webapp/channels/src/components/` - Component logos
   - `server/templates/` - Email templates
   - `server/fonts/` - Brand fonts

### **Step 11: Rebuild After Logo Changes**
```bash
# Rebuild webapp
cd webapp/channels
npm run build

# Rebuild server
cd ../../server
make build

# Create new package
make package
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

## 🔄 Development Workflow

1. **Make changes** to code/logos
2. **Rebuild webapp** if frontend changes
3. **Rebuild server** if backend changes
4. **Test changes** in browser
5. **Create package** when ready to deploy

---

**Happy Mattermost-ing! 🚀**
