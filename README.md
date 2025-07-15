# Women's Mental Health & Wellness Platform

A comprehensive full-stack web application designed to support women's mental health and wellness through community engagement, support groups, events, and resources.

## 🌟 Features

### Frontend (React + TypeScript)
- **Modern UI/UX**: Beautiful, responsive design with Tailwind CSS and Framer Motion
- **Community Hub**: Share posts, comment, like, and engage with the community
- **Support Groups**: Join and participate in mental health support groups
- **Events Management**: Discover and register for wellness events and workshops
- **Resource Library**: Access curated mental health resources and tools
- **Real-time Updates**: Live notifications and community interactions
- **User Dashboard**: Personal mood tracking and progress monitoring
- **Admin Panel**: Content moderation and platform management

### Backend (Node.js + Express + MongoDB)
- **RESTful API**: Comprehensive API with proper error handling
- **Authentication**: JWT-based auth with role-based access control
- **Real-time Features**: Socket.IO for live updates and notifications
- **Database**: MongoDB with Mongoose ODM for data modeling
- **Security**: Rate limiting, input validation, CORS protection
- **Admin Features**: User management, content moderation, analytics
- **Scalable Architecture**: Modular design with proper separation of concerns

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0.0 or higher
- MongoDB 5.0 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WMH
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run seed  # Optional: Add sample data
   ```

3. **Setup Frontend**
   ```bash
   cd ../project
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start Development Servers**
   
   **Option 1: Use startup scripts**
   ```bash
   # Windows
   ./start-dev.bat
   
   # Linux/Mac
   chmod +x start-dev.sh
   ./start-dev.sh
   ```
   
   **Option 2: Manual startup**
   ```bash
   # Terminal 1: Start MongoDB
   mongod
   
   # Terminal 2: Start Backend
   cd backend
   npm run dev
   
   # Terminal 3: Start Frontend
   cd project
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api/v1
   - Health Check: http://localhost:5000/health

## 📁 Project Structure

```
WMH/
├── backend/                 # Node.js/Express API server
│   ├── src/
│   │   ├── config/         # Database and app configuration
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API route handlers
│   │   ├── scripts/        # Database seeding and migration
│   │   └── server.js       # Main server file
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── project/                # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API and Socket.IO services
│   │   ├── contexts/       # React contexts
│   │   ├── utils/          # Utility functions
│   │   └── main.tsx        # App entry point
│   ├── package.json
│   ├── .env.example
│   └── vite.config.ts
├── start-dev.bat           # Windows startup script
├── start-dev.sh            # Linux/Mac startup script
└── README.md               # This file
```

## 🔧 Configuration

### Backend Environment Variables (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/wmh_database
JWT_SECRET=your_super_secret_jwt_key_here
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@wmh-platform.com
ADMIN_PASSWORD=admin123
```

### Frontend Environment Variables (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=Women's Mental Health & Wellness Platform
VITE_ENABLE_REAL_TIME=true
```

## 🔐 Default Admin Account

After seeding the database, you can login with:
- **Email**: admin@wmh-platform.com
- **Password**: admin123

**⚠️ Important**: Change the admin password in production!

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/profile` - Update profile

### Community Endpoints
- `GET /api/v1/community/posts` - Get all posts
- `POST /api/v1/community/posts` - Create new post
- `POST /api/v1/community/posts/:id/like` - Like/unlike post
- `POST /api/v1/community/posts/:id/comments` - Add comment

### Support Groups Endpoints
- `GET /api/v1/support-groups` - Get all support groups
- `POST /api/v1/support-groups` - Create support group (Admin)
- `POST /api/v1/support-groups/:id/join` - Join support group

### Events Endpoints
- `GET /api/v1/events` - Get all events
- `POST /api/v1/events` - Create event (Admin)
- `POST /api/v1/events/:id/register` - Register for event

### Resources Endpoints
- `GET /api/v1/resources` - Get all resources
- `POST /api/v1/resources` - Create resource (Admin)
- `POST /api/v1/resources/:id/bookmark` - Bookmark resource

## 🔄 Real-time Features

The platform supports real-time updates using Socket.IO:

- **Live Community Updates**: New posts and comments appear instantly
- **Notifications**: Real-time notifications for likes, comments, and mentions
- **User Status**: See when users are online and active
- **Typing Indicators**: See when someone is typing a comment

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents API abuse and spam
- **Input Validation**: Validates all incoming data
- **Data Sanitization**: Prevents XSS and injection attacks
- **CORS Protection**: Configurable cross-origin requests
- **Password Hashing**: bcrypt with salt rounds
- **Role-based Access**: Admin, moderator, and user roles

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd project
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Use PM2 or similar process manager
3. Configure reverse proxy (nginx)
4. Set up SSL certificates

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy to static hosting (Vercel, Netlify, etc.)
3. Configure environment variables for production API

### Database
- Use MongoDB Atlas for cloud hosting
- Set up proper indexes for performance
- Configure backups and monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in each folder
- Review the API endpoints and examples

## 🔮 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] AI-powered mood analysis
- [ ] Video chat for support groups
- [ ] Integration with wearable devices
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Peer mentorship program
- [ ] Crisis intervention features

## 🙏 Acknowledgments

- Mental health professionals who provided guidance
- Open source community for amazing tools and libraries
- Beta testers and early adopters
- Everyone working to destigmatize mental health

---

**Remember**: This platform is designed to supplement, not replace, professional mental health care. Always consult with qualified healthcare providers for serious mental health concerns.
