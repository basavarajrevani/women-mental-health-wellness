# Complete MongoDB Database Setup Guide

This guide will help you set up a comprehensive MongoDB database for the Women's Mental Health & Wellness Platform with complete user authentication and admin features.

## 🗄️ Database Features

### ✅ **Complete User Management**
- **Comprehensive user profiles** with personal information, demographics, and preferences
- **Advanced authentication** with JWT, email verification, and security tracking
- **Role-based access control** (user, moderator, admin, super-admin)
- **Mental health tracking** with goals, conditions, medications, and therapy info
- **Privacy controls** and notification preferences
- **Activity tracking** and engagement metrics

### ✅ **Admin Features**
- **User management** (view, edit, suspend, delete users)
- **Content moderation** with automated flagging and reporting
- **System settings** configuration and feature flags
- **Admin activity logs** with detailed audit trails
- **Analytics dashboard** with user engagement metrics
- **Notification broadcasting** system

### ✅ **Platform Data**
- **Community posts** with comments, likes, and moderation
- **Support groups** with membership management
- **Events** with registration and attendance tracking
- **Resources** with ratings and verification
- **Real-time notifications** system
- **Partner organizations** management

## 🚀 Setup Options

### Option 1: MongoDB Atlas (Cloud) - Recommended

1. **Configure MongoDB Atlas**
   ```bash
   # Your current configuration in .env
   MONGODB_URI=mongodb+srv://bassuprojects:KQBHjk5Ni2sllE4p@cluster0.gjdbtub.mongodb.net/wmh_platform?retryWrites=true&w=majority&appName=Cluster0
   ```

2. **Fix Network Issues** (if connection fails)
   - Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com)
   - Navigate to **Network Access**
   - Click **Add IP Address**
   - Add your current IP or `0.0.0.0/0` (for testing only)
   - Ensure your cluster is **not paused**

3. **Test Connection**
   ```bash
   npm run test-db
   ```

4. **Setup Database**
   ```bash
   npm run setup-db
   ```

### Option 2: Local MongoDB

1. **Install MongoDB Locally**
   - **Windows**: Download from [MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - **macOS**: `brew install mongodb-community`
   - **Linux**: Follow [official installation guide](https://docs.mongodb.com/manual/administration/install-on-linux/)

2. **Start MongoDB**
   ```bash
   # Windows
   mongod --dbpath C:\data\db
   
   # macOS/Linux
   mongod
   ```

3. **Configure Local Environment**
   ```bash
   # Copy local configuration
   cp .env.local .env
   
   # Or manually set in .env:
   MONGODB_URI=mongodb://localhost:27017/wmh_platform
   ```

4. **Setup Database**
   ```bash
   npm run setup-db
   ```

## 🔧 Database Commands

```bash
# Test database connection
npm run test-db

# Complete database setup (recommended)
npm run setup-db

# Seed with sample data
npm run seed

# Start development server
npm run dev
```

## 📊 Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'user' | 'moderator' | 'admin',
  profile: {
    personalInfo: {
      firstName, lastName, dateOfBirth, age, gender, pronouns, phoneNumber
    },
    location: {
      street, city, state, country, zipCode, timezone, coordinates
    },
    demographics: {
      ethnicity, languages, education, occupation, income, relationshipStatus
    },
    mentalHealth: {
      conditions: [{ name, diagnosedBy, severity, currentlyTreated }],
      goals: [{ title, description, category, progress, status }],
      triggers: [String],
      copingStrategies: [String]
    },
    preferences: {
      privacy: { profileVisibility, showRealName, allowDirectMessages },
      notifications: { email, push, inApp settings },
      accessibility: { fontSize, highContrast, screenReader }
    }
  },
  verification: { isEmailVerified, emailVerificationToken },
  security: { loginAttempts, lastLogin, ipAddresses, suspensionInfo },
  stats: { postsCount, commentsCount, likesReceived, streakDays }
}
```

### System Settings Collection
```javascript
{
  platform: { name, version, description, colors, maintenanceMode },
  userManagement: { registration, authentication, profiles },
  contentModeration: { posts, comments, reporting },
  communication: { email, notifications },
  security: { rateLimit, cors, encryption },
  features: { community, supportGroups, events, resources },
  analytics: { enabled, provider, dataRetention },
  backup: { enabled, frequency, retention }
}
```

### Admin Logs Collection
```javascript
{
  admin: ObjectId (User),
  action: String (enum of admin actions),
  target: { model, id, name },
  details: { description, oldValues, newValues, reason, notes },
  metadata: { ipAddress, userAgent, location, sessionId },
  severity: 'low' | 'medium' | 'high' | 'critical',
  category: 'user_management' | 'content_moderation' | 'system_admin',
  affectedUsers: [ObjectId],
  tags: [String],
  isReversible: Boolean
}
```

## 🔐 Default Accounts

After setup, you can login with:

### Admin Account
- **Email**: admin@wmh-platform.com
- **Password**: admin123
- **Role**: admin
- **Access**: Full platform administration

### Test Users (after seeding)
- **Email**: sarah@example.com / **Password**: password123
- **Email**: emily@example.com / **Password**: password123
- **Email**: maria@example.com / **Password**: password123 (moderator)

## 🌐 Access URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api/v1
- **Health Check**: http://localhost:5000/health
- **Database Health**: http://localhost:5000/api/v1/health/db
- **Admin Dashboard**: http://localhost:5173/admin

## 🔍 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/profile` - Update profile

### Admin Management
- `GET /api/v1/admin/dashboard` - Admin dashboard stats
- `GET /api/v1/admin/users` - Get all users
- `PUT /api/v1/admin/users/:id` - Update user
- `POST /api/v1/admin/users/:id/suspend` - Suspend user
- `GET /api/v1/admin/logs` - Get admin logs
- `GET /api/v1/admin/settings` - Get system settings
- `PUT /api/v1/admin/settings` - Update system settings

### Community
- `GET /api/v1/community/posts` - Get all posts
- `POST /api/v1/community/posts` - Create post
- `POST /api/v1/community/posts/:id/like` - Like post
- `POST /api/v1/community/posts/:id/comments` - Add comment

## 🛠️ Troubleshooting

### MongoDB Atlas Connection Issues

1. **DNS/Network Error**
   ```
   Error: querySrv ENOTFOUND _mongodb._tcp.cluster0.gjdbtub.mongodb.net
   ```
   **Solution**: Add your IP to MongoDB Atlas whitelist

2. **Authentication Failed**
   ```
   Error: Authentication failed
   ```
   **Solution**: Check username/password in connection string

3. **Timeout Error**
   ```
   Error: Server selection timed out
   ```
   **Solution**: Check internet connection and firewall settings

### Quick Fixes

1. **Add IP to Whitelist**
   - Go to MongoDB Atlas → Network Access
   - Add current IP or `0.0.0.0/0` for testing

2. **Check Cluster Status**
   - Ensure cluster is not paused in Atlas dashboard

3. **Use Local MongoDB**
   ```bash
   cp .env.local .env
   npm run setup-db
   ```

## 📈 Performance Optimization

The database includes optimized indexes for:
- User email lookups (unique)
- User status and role filtering
- Activity date sorting
- Admin log searching
- Content moderation queries

## 🔒 Security Features

- **Password hashing** with bcrypt
- **JWT token** authentication
- **Rate limiting** on API endpoints
- **Input validation** and sanitization
- **Admin activity logging**
- **IP address tracking**
- **Account lockout** after failed attempts

## 🎯 Next Steps

1. **Complete database setup**: `npm run setup-db`
2. **Start the backend**: `npm run dev`
3. **Start the frontend**: `cd ../project && npm run dev`
4. **Access admin dashboard**: Login with admin credentials
5. **Create content**: Add support groups, events, and resources
6. **Test features**: Register users, create posts, join groups

Your comprehensive MongoDB database with full user authentication and admin features is now ready! 🚀
