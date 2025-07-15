# Women's Mental Health & Wellness Platform - Backend API

A comprehensive Node.js/Express.js backend API with MongoDB integration for the Women's Mental Health & Wellness Platform.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Community Features**: Posts, comments, likes, real-time interactions
- **Support Groups**: Create and manage mental health support groups
- **Events Management**: Workshops, webinars, and community events
- **Resource Library**: Curated mental health resources with ratings
- **Real-time Updates**: Socket.IO for live notifications and interactions
- **Admin Dashboard**: Comprehensive admin panel for content moderation
- **Security**: Rate limiting, input validation, data sanitization
- **Scalable Architecture**: Modular design with proper error handling

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.IO
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Password Hashing**: bcryptjs

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- MongoDB 5.0 or higher (local or cloud)
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WMH/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/wmh_database
   JWT_SECRET=your_super_secret_jwt_key_here
   FRONTEND_URL=http://localhost:5173
   ADMIN_EMAIL=admin@wmh-platform.com
   ADMIN_PASSWORD=admin123
   ```

4. **Start MongoDB**
   - Local MongoDB: `mongod`
   - Or use MongoDB Atlas (cloud)

5. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `PUT /auth/profile` - Update user profile
- `PUT /auth/change-password` - Change password

### Community Endpoints
- `GET /community/posts` - Get all posts
- `POST /community/posts` - Create new post
- `GET /community/posts/:id` - Get single post
- `PUT /community/posts/:id` - Update post
- `DELETE /community/posts/:id` - Delete post
- `POST /community/posts/:id/like` - Like/unlike post
- `POST /community/posts/:id/comments` - Add comment

### Support Groups Endpoints
- `GET /support-groups` - Get all support groups
- `POST /support-groups` - Create support group (Admin/Moderator)
- `GET /support-groups/:id` - Get single support group
- `POST /support-groups/:id/join` - Join support group
- `POST /support-groups/:id/leave` - Leave support group

### Events Endpoints
- `GET /events` - Get all events
- `POST /events` - Create event (Admin/Moderator)
- `GET /events/:id` - Get single event
- `POST /events/:id/register` - Register for event
- `POST /events/:id/unregister` - Unregister from event

### Resources Endpoints
- `GET /resources` - Get all resources
- `POST /resources` - Create resource (Admin/Moderator)
- `GET /resources/:id` - Get single resource
- `POST /resources/:id/bookmark` - Bookmark/unbookmark resource
- `POST /resources/:id/reviews` - Add review

### Admin Endpoints
- `GET /admin/dashboard` - Admin dashboard stats
- `GET /admin/users` - Get all users
- `PUT /admin/users/:id` - Update user status/role
- `GET /admin/posts` - Get all posts (admin view)
- `PUT /admin/posts/:id/moderate` - Moderate post
- `GET /admin/analytics` - System analytics
- `POST /admin/notifications/broadcast` - Broadcast notification

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles
- **user**: Regular platform users
- **moderator**: Can moderate content and manage groups
- **admin**: Full access to all features and admin panel

## 🌐 Real-time Features

The backend supports real-time features using Socket.IO:

- Live community post updates
- Real-time comments and likes
- User typing indicators
- System notifications
- User status updates

### Socket Events
- `post_created` - New post created
- `comment_added` - New comment added
- `post_like_updated` - Post like/unlike
- `notification_received` - New notification
- `user_typing` - User typing indicator

## 🗄️ Database Schema

### Collections
- **users**: User accounts and profiles
- **communityposts**: Community posts and comments
- **supportgroups**: Mental health support groups
- **events**: Workshops and community events
- **resources**: Mental health resources
- **partners**: Partner organizations
- **notifications**: User notifications
- **moodentries**: User mood tracking data

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Validates all incoming data
- **Data Sanitization**: Prevents NoSQL injection and XSS
- **CORS Protection**: Configurable cross-origin requests
- **Helmet**: Security headers
- **Password Hashing**: bcrypt with salt rounds
- **JWT Security**: Secure token generation and validation

## 📊 Scripts

```bash
# Start development server
npm run dev

# Start production server
npm start

# Run tests
npm test

# Seed database with sample data
npm run seed

# Run data migration
npm run migrate

# Lint code
npm run lint
```

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wmh_database
JWT_SECRET=your_production_jwt_secret_here
FRONTEND_URL=https://your-frontend-domain.com
```

### Docker Deployment (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 API Versioning

Current API version: v1
Base URL includes version: `/api/v1/`

Future versions will be available at `/api/v2/`, etc.
