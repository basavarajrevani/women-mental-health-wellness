# Women's Mental Health Platform 🌸

![React](https://img.shields.io/badge/React-18.0+-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0+-blue.svg)
![License](https://img.shields.io/badge/License-Mental%20Health%20Support-green.svg)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen.svg)

A comprehensive mental health support platform designed specifically for women, featuring AI-powered chat support, progress tracking, community features, and administrative tools.

## 🎯 Platform Overview

This platform provides a safe, supportive environment for women to:
- **Access 24/7 AI mental health support** with crisis intervention
- **Track their mental wellness journey** with comprehensive analytics
- **Connect with community** and share experiences safely
- **Find professional resources** including therapists and support organizations
- **Receive immediate help** during mental health crises

**🚨 Important**: This platform includes crisis detection and emergency resource provision for user safety.

## 🌟 Features

### 👥 User Management
- **Dual User System**: Regular users and administrators with distinct capabilities
- **Secure Authentication**: Login/signup with role-based access control
- **Real-time User Tracking**: Admin can monitor user activity and login status
- **Profile Management**: Personalized user profiles with progress tracking

### 🤖 AI Chat Support
- **Intelligent Mental Health Assistant**: AI-powered chat with specialized mental health responses
- **Crisis Detection**: Automatic detection of emergency situations with immediate resource provision
- **Topic Recognition**: Identifies anxiety, depression, stress, and panic-related conversations
- **Emergency Resources**: Instant access to crisis hotlines and professional help
- **24/7 Availability**: Always-available support through sidebar navigation

### 📊 Health & Progress Tracking
- **Mood Tracking**: Daily mood entries with visual progress charts
- **Wellness Metrics**: Comprehensive health and wellness monitoring
- **Progress Visualization**: Real-time charts and analytics
- **Data Export**: Download personal health data
- **Achievement System**: Progress milestones and achievements

### 🏥 Community & Resources
- **Community Posts**: Share experiences and support each other
- **Resource Library**: Curated mental health resources and articles
- **Partner Organizations**: Healthcare providers and support organizations
- **NGO Directory**: Non-profit organizations focused on women's mental health
- **Medical Support**: Professional healthcare provider listings

### 🔧 Admin Dashboard
- **User Management**: Monitor all registered users and their activity
- **Content Management**: Add/edit resources, partners, and NGO information
- **Community Moderation**: Manage community posts and interactions
- **Real-time Analytics**: Live user statistics and platform metrics
- **Debug Tools**: Storage analysis and data refresh capabilities

### 🔔 Real-time Features
- **Live Notifications**: Instant updates for community activity
- **Real-time Sync**: All data updates immediately across the platform
- **Activity Monitoring**: Live user activity tracking
- **Instant Updates**: Admin changes reflect immediately to all users

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WMH/project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## ⚡ Quick Start Guide

### 🚀 5-Minute Setup
1. **Download/Clone** the project
2. **Run** `npm install && npm run dev`
3. **Open** `http://localhost:5173`
4. **Click** "Get Started" on landing page
5. **Register** a new user account
6. **Explore** the dashboard and features

### 🎯 First-Time User Journey
1. **Landing Page** → Professional introduction to the platform
2. **Registration** → Create account with name, email, password
3. **Dashboard** → Overview of all features and quick actions
4. **Chat Support** → Try the AI assistant with "I'm feeling anxious"
5. **Health Tracker** → Log your first mood entry
6. **Community** → See posts from other users
7. **Resources** → Browse mental health articles and tools

### 👨‍💼 Admin Demo
1. **Login** with admin credentials: `basavarajrevani123@gmail.com` / `Basu@15032002`
2. **Select** "Admin" role during login
3. **Explore** admin dashboard with user management
4. **Add** new resources, partners, or NGOs
5. **Monitor** real-time user activity
6. **Use** debug panel to check system status

## 🌐 Deployment

### Production Build
```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy dist/ folder to your hosting service
```

### Hosting Options
- **Netlify**: Drag and drop `dist/` folder
- **Vercel**: Connect GitHub repository
- **GitHub Pages**: Use GitHub Actions for deployment
- **Traditional Hosting**: Upload `dist/` contents to web server

### Environment Configuration
No environment variables needed - the platform runs entirely client-side with localStorage.

## 📋 Detailed Feature Guide

### 🤖 AI Chat Support Features

#### Intelligent Conversation
- **Natural Language Processing**: Understands mental health terminology
- **Context Awareness**: Maintains conversation context throughout session
- **Emotional Recognition**: Identifies emotional states and responds appropriately
- **Personalized Responses**: Uses user's name and adapts to their communication style

#### Crisis Detection & Response
```
Trigger Keywords: "suicide", "kill myself", "hurt myself", "end it all", "no point living"
Response: Immediate crisis resources and emergency contact information
Action: Emergency modal with hotlines and professional help options
```

#### Topic-Specific Support
- **Anxiety**: Breathing exercises, grounding techniques, coping strategies
- **Depression**: Encouragement, professional resources, activity suggestions
- **Stress**: Time management, relaxation techniques, stress reduction tips
- **Panic Attacks**: Immediate calming techniques, reality grounding exercises

### 📊 Progress Tracking System

#### Health Tracker Features
- **Mood Logging**: Daily mood entries with 1-10 scale
- **Symptom Tracking**: Monitor anxiety, depression, stress levels
- **Medication Reminders**: Track medication adherence
- **Sleep Patterns**: Monitor sleep quality and duration
- **Exercise Logging**: Track physical activity and wellness

#### Progress Analytics
- **Visual Charts**: Line graphs, bar charts, trend analysis
- **Weekly/Monthly Reports**: Comprehensive progress summaries
- **Goal Setting**: Personal wellness goals and milestones
- **Achievement Badges**: Motivation through progress recognition

### 🏥 Resource Management

#### Healthcare Providers
- **Therapists**: Licensed mental health professionals
- **Psychiatrists**: Medical doctors specializing in mental health
- **Support Groups**: Local and online support communities
- **Crisis Centers**: Emergency mental health facilities

#### Educational Resources
- **Articles**: Evidence-based mental health information
- **Videos**: Guided meditation and therapy techniques
- **Worksheets**: CBT exercises and self-help tools
- **Books**: Recommended reading for mental wellness

## 🎯 How to Use

### For Users

#### 1. **Getting Started**
- Visit the landing page
- Click "Get Started" to access login/signup
- Create a new account or login with existing credentials
- Access the dashboard to explore features

#### 2. **Using Chat Support**
- Click "Support Chat" in the sidebar navigation
- Start typing your concerns or use quick response buttons
- The AI will provide contextual mental health support
- Emergency button available for crisis situations

#### 3. **Tracking Progress**
- Navigate to "Health Tracker" for mood and wellness tracking
- Use "Progress" page to view achievements and analytics
- Download your data using export buttons
- Reset progress if needed

#### 4. **Community Engagement**
- Visit "Community" to see posts from other users
- Share your experiences and support others
- Real-time updates show new posts immediately

#### 5. **Finding Resources**
- Browse "Resources" for mental health articles and tools
- Check "Partners" for healthcare providers
- Explore "NGOs" for non-profit support organizations

### 💬 Chat Support Usage Examples

#### Example 1: Anxiety Support
```
User: "I'm having a panic attack and can't breathe"
AI: "I understand you're experiencing a panic attack. Focus on your breathing - breathe slowly and deeply. Remember that panic attacks are frightening but not dangerous, and this will pass. Try the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste."

Suggestions provided:
💡 Focus on slow, deep breathing
💡 Use the 5-4-3-2-1 grounding technique
💡 Find a safe, quiet space

Resources provided:
📱 Headspace - Meditation & mindfulness
📱 Calm - Sleep stories & relaxation
```

#### Example 2: Depression Support
```
User: "I've been feeling really down lately and don't see the point"
AI: "I hear that you're struggling with difficult feelings. Depression is a real medical condition, and seeking help is a sign of strength, not weakness. It's important to know that depression is treatable. Small steps like getting sunlight, gentle exercise, or connecting with a friend can help alongside professional support."

Suggestions provided:
💡 Reach out to a mental health professional
💡 Connect with supportive friends or family
💡 Consider therapy or counseling

Resources provided:
💬 BetterHelp - Professional counseling
💬 Psychology Today - Find therapists
```

#### Example 3: Crisis Detection
```
User: "I don't want to be here anymore"
AI: "🆘 I'm very concerned about your safety. Please reach out for immediate help. You don't have to go through this alone. Your life has value and meaning."

Emergency Resources Displayed:
🆘 National Suicide Prevention Lifeline: 988
🆘 Crisis Text Line: Text HOME to 741741
🆘 Emergency Services: 911
🆘 If you're in immediate danger, please call emergency services
```

### For Administrators

#### 1. **Admin Access**
- Use admin credentials: `basavarajrevani123@gmail.com` / `Basu@15032002`
- Select "Admin" role during login
- Access comprehensive admin dashboard

#### 2. **User Management**
- Monitor all registered users in "Users" tab
- View real-time login activity and user statistics
- Track user engagement and platform usage

#### 3. **Content Management**
- Add/edit resources in "Resources" tab
- Manage partner organizations in "Partners" tab
- Update NGO listings in "NGOs" tab
- Moderate community posts in "Community" tab

#### 4. **System Administration**
- Use "Debug Panel" to check data storage and refresh content
- Monitor real-time sync indicators
- Update admin profile and contact information
- Change admin credentials in "Settings"

## 🛠️ Technical Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **Recharts** for data visualization

### State Management
- **React Context API** for global state
- **localStorage** for data persistence
- **Real-time updates** across components

### AI & Chat
- **Custom AI Service** with mental health specialization
- **Crisis detection algorithms**
- **Contextual response generation**
- **Emergency resource integration**

## 📁 Project Structure

```
WMH/project/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── admin/          # Admin-specific components
│   │   ├── chat/           # Chat support components
│   │   ├── dashboard/      # Dashboard widgets
│   │   └── layout/         # Layout components
│   ├── context/            # React Context providers
│   ├── pages/              # Main application pages
│   ├── services/           # API and external services
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── public/                 # Static assets
└── package.json           # Dependencies and scripts
```

## 🔐 Default Credentials

### Admin Account
- **Email**: `basavarajrevani123@gmail.com`
- **Password**: `Basu@15032002`
- **Role**: Administrator

### Test User Account
- Create your own account through the signup process
- Or use any email/password combination for testing

## 🆘 Emergency Resources

The platform includes immediate access to:
- **National Suicide Prevention Lifeline**: 988
- **Crisis Text Line**: Text HOME to 741741
- **Emergency Services**: 911
- **International Crisis Centers**: Available through the platform

## 🎨 Key Features Highlights

### 🤖 AI Chat Support
- Intelligent mental health conversations
- Crisis detection and intervention
- Emergency resource provision
- 24/7 availability through sidebar

### 📊 Real-time Analytics
- Live user activity monitoring
- Instant data synchronization
- Real-time progress tracking
- Dynamic content updates

### 🔧 Admin Tools
- Comprehensive user management
- Content management system
- Debug and monitoring tools
- Real-time platform analytics

### 💙 Mental Health Focus
- Specialized for women's mental health
- Evidence-based support responses
- Professional resource integration
- Crisis intervention capabilities

## 🚀 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding Features
1. Create components in appropriate directories
2. Update routing in `App.tsx`
3. Add navigation items in `Navigation.tsx`
4. Implement admin controls if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support & Contact

### Technical Support
- **In-App Chat**: Use the AI chat support for immediate help
- **Admin Tools**: Use debug panel for system diagnostics
- **Documentation**: Refer to this README for comprehensive guidance

### Mental Health Resources
- **Crisis Support**: National Suicide Prevention Lifeline (988)
- **Text Support**: Crisis Text Line (Text HOME to 741741)
- **Emergency**: Call 911 for immediate danger
- **Professional Help**: Platform provides therapist directories

### Platform Features Summary
✅ **AI Chat Support** - 24/7 mental health assistant with crisis detection
✅ **Progress Tracking** - Comprehensive mood and wellness analytics
✅ **Community Support** - Safe space for sharing and connection
✅ **Resource Library** - Curated mental health resources and tools
✅ **Admin Dashboard** - Complete platform management system
✅ **Real-time Updates** - Instant synchronization across all features
✅ **Crisis Intervention** - Automatic emergency resource provision
✅ **Mobile Responsive** - Works perfectly on all devices

### Quick Access Links
- **Landing Page**: `http://localhost:5173/`
- **Chat Support**: `http://localhost:5173/chat`
- **Admin Dashboard**: `http://localhost:5173/admin`
- **User Dashboard**: `http://localhost:5173/dashboard`

## 📄 License

This project is developed for mental health support purposes. Please use responsibly and ensure proper crisis intervention protocols are followed.

## 🔧 Troubleshooting

### Common Issues

#### Chat Support Not Loading
- Ensure you're logged in as a user (not admin)
- Check browser console for errors
- Try refreshing the page
- Clear browser cache if needed

#### Admin Dashboard Access
- Use correct admin credentials
- Select "Admin" role during login
- Check if admin credentials have been changed

#### Data Not Syncing
- Check real-time sync indicator in bottom-right
- Use admin debug panel to refresh data
- Verify localStorage is enabled in browser

#### Performance Issues
- Clear browser cache and localStorage
- Check network connection
- Use admin debug panel to check storage usage

### Browser Compatibility
- **Recommended**: Chrome, Firefox, Safari, Edge (latest versions)
- **Minimum**: ES6+ support required
- **Mobile**: Responsive design works on all modern mobile browsers

## 📱 Mobile Support

The platform is fully responsive and works on:
- **Smartphones**: iOS Safari, Android Chrome
- **Tablets**: iPad, Android tablets
- **Desktop**: All modern browsers

## 🔒 Security Features

### Data Protection
- **Local Storage**: All data stored locally in browser
- **No External APIs**: Chat support uses local AI (privacy-focused)
- **Role-based Access**: Separate user and admin capabilities
- **Session Management**: Secure login/logout functionality

### Privacy Considerations
- **No Data Collection**: Personal data stays on user's device
- **Anonymous Usage**: No tracking or analytics
- **Crisis Support**: Emergency resources provided without data collection

## 🎯 Feature Roadmap

### Planned Enhancements
- **External API Integration**: Optional cloud-based AI for enhanced responses
- **Data Backup**: Export/import functionality for user data
- **Advanced Analytics**: More detailed progress tracking
- **Group Therapy**: Virtual group session capabilities
- **Professional Integration**: Direct therapist communication

### Current Limitations
- **Local Storage Only**: Data tied to specific browser/device
- **Single Device**: No cross-device synchronization
- **Offline Mode**: Limited functionality without internet

## 📊 Platform Statistics

### User Capabilities
- **Unlimited Users**: No registration limits
- **Real-time Updates**: Instant synchronization
- **Data Export**: Download personal information
- **Progress Tracking**: Comprehensive analytics

### Admin Capabilities
- **User Monitoring**: Real-time activity tracking
- **Content Management**: Full CRUD operations
- **System Monitoring**: Debug and performance tools
- **Emergency Override**: Crisis intervention capabilities

## 🆘 Crisis Intervention Protocol

### Automatic Detection
The platform automatically detects crisis keywords and provides:
1. **Immediate Resources**: Crisis hotlines and emergency contacts
2. **Professional Guidance**: Recommendations for immediate help
3. **Safety Planning**: Step-by-step crisis management
4. **Follow-up Support**: Continued monitoring and resources

### Emergency Contacts
- **US**: National Suicide Prevention Lifeline (988)
- **Text Support**: Crisis Text Line (Text HOME to 741741)
- **Emergency**: 911 for immediate danger
- **International**: Platform provides local crisis resources

## 🎓 Educational Resources

### Mental Health Topics Covered
- **Anxiety Disorders**: Panic attacks, generalized anxiety, phobias
- **Depression**: Major depression, seasonal affective disorder
- **Stress Management**: Work stress, life transitions, trauma
- **Self-Care**: Mindfulness, meditation, wellness practices
- **Crisis Support**: Suicide prevention, self-harm intervention

### Resource Types
- **Articles**: Evidence-based mental health information
- **Tools**: Interactive wellness assessments
- **Exercises**: Guided meditation and breathing techniques
- **Professional Help**: Therapist and counselor directories

## 💻 Development Environment

### Setup for Developers
```bash
# Clone repository
git clone <repository-url>
cd WMH/project

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables
No environment variables required - the platform runs entirely client-side.

### Development Tools
- **TypeScript**: Full type safety
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Vite**: Fast development and building

---

**🌸 Women's Mental Health Platform - Supporting mental wellness through technology 💙**

*This platform is designed to provide support and resources for mental health. It is not a replacement for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified health providers with any questions you may have regarding a medical condition.*
