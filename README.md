# Taqyeem Platform

**تقييم** - A comprehensive bilingual interview & learning platform built with modern web technologies.

## 🌟 Overview

Taqyeem is a full-stack platform designed to facilitate interview scheduling, conduct, and evaluation while providing educational content to help users improve their interview skills. The platform supports both Arabic and English languages with a beautiful, modern interface and real-time video interview capabilities.

## 🏗️ Architecture

### Tech Stack

**Frontend:**

- React 18 + Vite
- TailwindCSS 4 + Custom UI Components
- React Query (TanStack Query) + React Router
- React Hook Form + Zod Validation
- Framer Motion (Animations)
- i18next (Bilingual support: Arabic/English)
- Socket.io Client (Real-time communication)
- WebRTC (Video interviews)

**Backend:**

- Node.js + Express 5
- MongoDB + Mongoose ODM
- JWT Authentication (bcrypt password hashing)
- Cloudinary (File storage & CDN)
- Multer (File uploads)
- Socket.io (Real-time signaling & WebRTC)
- Express Validator + Joi (Input validation)
- Helmet + CORS (Security)

**Database:**

- MongoDB Atlas (Cloud)
- Mongoose ODM

**Real-time Communication:**

- Socket.io (WebRTC signaling, session management)
- WebRTC (Peer-to-peer video/audio)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for file storage)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Taqyeem
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   cp env.example .env
   # Update .env with your credentials (see Environment Variables section)
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

3. **Frontend Setup**

   ```bash
   cd frontend
   npm install
   cp env.example .env
   # Update .env with your API URL
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

4. **Access the application**
   - Frontend: <http://localhost:5173>
   - Backend API: <http://localhost:5000/api/v1>

## 📋 Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=5000
HOST=localhost
NODE_ENV=development

# Database
MONGODB_URI=your-mongodb-connection-string

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_FOLDER=taqyeem

# CORS
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
```

### Frontend (.env)

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api/v1

# App Configuration
VITE_APP_NAME=Taqyeem
VITE_APP_NAME_AR=تقييم
VITE_APP_DESCRIPTION=Bilingual Interview & Learning Platform
```

## 🧩 Features

### 🔐 Authentication & Authorization

- JWT-based authentication with secure token management
- Role-based access control (Candidate, Interviewer, Admin)
- Secure password hashing with bcrypt (12 salt rounds)
- User profile management with avatar uploads
- Protected routes and API endpoints

### 📅 Interview Management

- **Interview Days**: Create and manage interview schedules with date-based organization
- **Time Slots**: Flexible slot creation with multiple candidates per slot support
- **Reservations**:
  - Candidates can book available slots
  - One reservation per candidate per interviewer rule
  - Interviewer can accept/reject reservations
  - Automatic slot status updates (available → pending → booked)
- **Sessions**:
  - Real-time video interview sessions using WebRTC
  - Socket.io for signaling and session management
  - Session recording support
  - Start, complete, and cancel session workflows
- **Slot Reversal**: Automatic slot availability restoration when:
  - Reservations are deleted or rejected
  - Sessions are completed, cancelled, or deleted
- **Evaluations**:
  - Comprehensive evaluation system with criteria scoring
  - Communication, Technical, Problem Solving, and Confidence criteria
  - Overall score calculation
  - Comments and general notes
  - View evaluations in admin dashboard

### 📚 Learning Platform

- **Educational Content**: Articles, FAQs, and tips
- **Bilingual Content**: Full Arabic/English support
- **Categories**: Organized content by topics
- **Search & Filter**: Easy content discovery
- **Admin Management**: Create, update, and delete educational content

### 🎯 User Roles

#### Candidate

- Browse and book interview slots
- View available slots in calendar format
- Attend scheduled video interviews
- View evaluation results and feedback
- Access learning materials
- Manage profile and preferences

#### Interviewer

- Create interview days and time slots
- Manage reservations (accept/reject with reasons)
- Conduct real-time video interview sessions
- Submit comprehensive evaluations with criteria scoring
- Provide feedback to candidates
- View session history and statistics

#### Admin

- **User Management**: View, edit, and delete users
- **Reservation Management**: View, filter, search, and delete reservations
- **Session Management**:
  - View all sessions with search and filtering
  - Delete sessions
  - View candidate evaluations for each session
- **Content Management**: Manage educational content
- **Analytics**: Access platform statistics and trends
- **Content Moderation**: Oversee all platform operations

### 💬 Real-time Features

- **WebRTC Video Calls**: Peer-to-peer video/audio communication
- **Socket.io Signaling**: Real-time WebRTC signaling (offer, answer, ICE candidates)
- **Session Management**: Real-time session join/leave notifications
- **Evaluation Updates**: Real-time evaluation updates during sessions
- **User Presence**: Track user presence in sessions

## 🌐 Bilingual Support

The platform provides complete bilingual support:

- **Languages**: Arabic (العربية) and English
- **RTL/LTR Layouts**: Automatic direction switching based on language
- **Font Support**:
  - Cairo font for Arabic text
  - Inter font for English text
- **Content Translation**: All UI text, labels, and messages
- **User Preferences**: Language selection per user with persistence
- **Localized Content**: Educational content available in both languages

## 📊 Database Schema

### Core Models

- **User**: Authentication, profile, role, and preferences
- **Day**: Interview day scheduling with date and metadata
- **Slot**: Time slot management with capacity (maxCandidates, currentCandidates)
- **Reservation**: Booking system linking candidates, interviewers, and slots
- **Session**: Interview sessions with status tracking (pending, in-progress, completed, cancelled)
- **Evaluation**: Performance assessment with criteria scores and comments
- **Feedback**: Session feedback from participants
- **EducationalContent**: Learning materials with bilingual support
- **InterviewQuestion**: Predefined interview questions
- **SessionQuestion**: Questions used in specific sessions

### Relationships

```text
User (1) ───< Reservation >───(1) Slot
User (1) ───< Session >───(1) Reservation
Session (1) ───< Evaluation
Session (1) ───< Feedback
User (1) ───< EducationalContent
Session (1) ───< SessionQuestion
```

### Key Features

- **Slot Status Management**:
  - `available`: No candidates booked
  - `pending`: Some candidates booked (less than max)
  - `booked`: At maximum capacity
- **Automatic Slot Reversal**: Slots become available when reservations/sessions are deleted or completed
- **One Reservation Rule**: Each candidate can have only one active reservation per interviewer

## 🔧 API Documentation

### Base URL

```text
http://localhost:5000/api/v1
```

### Authentication

All protected routes require a Bearer token:

```http
Authorization: Bearer <jwt-token>
```

### Response Format

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Key Endpoints

#### Authentication Endpoints

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

#### Users

- `GET /users` - Get all users (admin)
- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update current user profile
- `PUT /users/:id` - Update user (admin)
- `DELETE /users/:id` - Delete user (admin)

#### Days

- `GET /days` - Get all interview days
- `GET /days/:id` - Get day by ID
- `POST /days` - Create day (interviewer/admin)
- `PUT /days/:id` - Update day (interviewer/admin)
- `DELETE /days/:id` - Delete day (interviewer/admin)

#### Slots

- `GET /slots/:dayId` - Get slots for a day
- `GET /slots/my` - Get my slots (interviewer)
- `POST /slots` - Create slots (interviewer/admin)
- `PUT /slots/:id` - Update slot (interviewer/admin)
- `DELETE /slots/:id` - Delete slot (interviewer/admin)

#### Reservations

- `GET /reservations` - Get all reservations (admin)
- `GET /reservations/me` - Get my reservations
- `POST /reservations` - Create reservation (candidate)
- `POST /reservations/:id/accept` - Accept reservation (interviewer)
- `POST /reservations/:id/reject` - Reject reservation (interviewer)
- `DELETE /reservations/:id` - Delete reservation (admin)

#### Sessions

- `GET /sessions/me` - Get my sessions
- `GET /sessions/:id` - Get session by ID
- `POST /sessions/:id/start` - Start session (interviewer)
- `POST /sessions/:id/complete` - Complete session (interviewer)
- `POST /sessions/:id/cancel` - Cancel session
- `DELETE /sessions/:id` - Delete session (admin)

#### Evaluations

- `POST /evaluations` - Create evaluation (interviewer)
- `GET /evaluations/:sessionId` - Get evaluation by session
- `PUT /evaluations/:id` - Update evaluation (interviewer)
- `GET /evaluations/my` - Get my evaluations

#### Learning

- `GET /learn` - Get all educational content
- `GET /learn/:id` - Get content by ID
- `GET /learn/categories` - Get content categories
- `POST /learn` - Create content (admin)
- `PUT /learn/:id` - Update content (admin)
- `DELETE /learn/:id` - Delete content (admin)

#### Admin Endpoints

- `GET /admin/users` - Get all users with statistics
- `GET /admin/reservations` - Get all reservations
- `GET /admin/sessions` - Get all sessions
- `DELETE /admin/reservations/:id` - Delete reservation
- `DELETE /admin/sessions/:id` - Delete session
- `GET /admin/stats` - Get platform statistics

## 🎨 Design System

### Color Palette

- **Primary**: Blue shades (#3b82f6, #2563eb, #1d4ed8)
- **Secondary**: Cyan shades (#06b6d4, #0891b2, #0e7490)
- **Accent**: Sky shades (#0ea5e9, #0284c7, #0369a1)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

### Typography

- **English**: Inter font family
- **Arabic**: Cairo font family
- Responsive font sizes with proper line heights

### Components

- Modern, accessible UI components
- Responsive design patterns (mobile-first)
- Consistent spacing and layout system
- Smooth animations and transitions (Framer Motion)
- Loading states and error handling
- Toast notifications for user feedback

## 🚀 Deployment

### Backend Deployment

1. Set up MongoDB Atlas cluster
2. Configure Cloudinary account
3. Set all environment variables in your hosting platform
4. Deploy to your preferred platform (Vercel, Railway, Heroku, etc.)
5. Ensure Socket.io is properly configured for your hosting environment

### Frontend Deployment

1. Build the production bundle: `npm run build`
2. Deploy to static hosting (Vercel, Netlify, etc.)
3. Configure environment variables
4. Set up redirects for SPA routing (all routes → index.html)

### Deployment Considerations

- **Socket.io**: Ensure your hosting platform supports WebSocket connections
- **WebRTC**: May require TURN server configuration for production (especially for users behind NAT/firewalls)
- **CORS**: Configure `FRONTEND_URL` to include your production frontend URL
- **Rate Limiting**: Adjust rate limits for production traffic

## 🧪 Development

### Project Structure

```text
Taqyeem/
├── backend/                    # Express.js API
│   ├── index.js               # Server entry point
│   ├── package.json
│   ├── env.example            # Environment variables template
│   ├── src/
│   │   ├── app.controller.js # Main app routes
│   │   ├── config/           # Configuration files
│   │   │   └── cloudinary.js
│   │   ├── DB/               # Database
│   │   │   ├── connection.js
│   │   │   └── models/       # Mongoose models
│   │   ├── middleware/       # Express middleware
│   │   │   ├── authentication.js
│   │   │   ├── authorization.js
│   │   │   ├── error-handler.js
│   │   │   └── validation.js
│   │   ├── modules/          # Feature modules
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── day/
│   │   │   ├── evaluation/
│   │   │   ├── reservation/
│   │   │   ├── session/
│   │   │   ├── slot/
│   │   │   └── user/
│   │   ├── socket/           # Socket.io server
│   │   │   └── socketServer.js
│   │   └── utils/            # Utility functions
│   └── scripts/              # Utility scripts
├── frontend/                  # React application
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── env.example
│   ├── public/               # Static assets
│   └── src/
│       ├── main.jsx          # App entry point
│       ├── App.jsx           # Main app component
│       ├── api/              # API services
│       ├── components/       # React components
│       │   ├── interviews/  # Interview-related components
│       │   ├── sessions/     # Session components
│       │   ├── layout/      # Layout components
│       │   └── ui/           # Reusable UI components
│       ├── pages/            # Page components
│       ├── hooks/            # Custom React hooks
│       ├── context/          # React Context providers
│       ├── config/           # App configuration
│       ├── utils/            # Utility functions
│       └── locales/          # Translation files (i18n)
│           ├── en.json
│           └── ar.json
└── README.md                 # This file
```

### Development Commands

**Backend:**

```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm test         # Run tests (if configured)
```

**Frontend:**

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run build:production # Build with production mode
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication with expiration
- **Password Hashing**: bcrypt with 12 salt rounds
- **Input Validation**:
  - Server-side validation with express-validator and Joi
  - Client-side validation with Zod
- **Rate Limiting**: API rate limiting to prevent abuse (configurable)
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet**: Security headers for Express
- **File Upload Security**:
  - Secure file handling with Cloudinary
  - File type and size validation
  - Virus scanning (via Cloudinary)
- **SQL Injection Prevention**: Mongoose ODM with parameterized queries
- **XSS Protection**: Input sanitization and output encoding

## 📈 Performance

- **React Query**: Efficient data fetching, caching, and background updates
- **Code Splitting**: Lazy loading for better initial load performance
- **Image Optimization**: Cloudinary CDN for optimized images
- **Database Indexing**: Optimized MongoDB queries with proper indexes
- **Socket.io Optimization**: Efficient real-time communication
- **WebRTC**: Peer-to-peer communication reduces server load
- **Caching**: React Query cache for API responses

## 🎯 Key Features & Workflows

### Interview Booking Flow

1. Interviewer creates interview day
2. Interviewer generates time slots for the day
3. Candidate browses available slots
4. Candidate books a slot (creates reservation)
5. Slot status updates (available → pending)
6. Interviewer accepts/rejects reservation
7. If accepted, session is created
8. Session can be started, completed, or cancelled
9. After completion, slot becomes available again

### Evaluation Flow

1. Interviewer completes session
2. Interviewer creates evaluation with criteria scores
3. Evaluation includes:
   - Communication score (0-10)
   - Technical score (0-10)
   - Problem Solving score (0-10)
   - Confidence score (0-10)
   - Comments for each criterion
   - General notes
   - Overall score (calculated automatically)
4. Candidate can view their evaluation
5. Admin can view all evaluations

### Real-time Session Flow

1. Candidate and interviewer join session room via Socket.io
2. WebRTC connection established (offer/answer/ICE candidates)
3. Video/audio stream shared peer-to-peer
4. Session can be recorded (optional)
5. Real-time evaluation updates during session
6. Session completion triggers slot reversal

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and structure
- Write meaningful commit messages
- Add tests for new features (when test suite is set up)
- Update documentation as needed
- Ensure bilingual support for new features (add translations)
- Test both Arabic and English interfaces
- Ensure responsive design works on mobile devices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation in each module
- Review the backend and frontend README files

## 🙏 Acknowledgments

- React team for the amazing framework
- TailwindCSS for the utility-first CSS framework
- MongoDB team for the flexible database
- Socket.io team for real-time communication
- WebRTC community for peer-to-peer video technology
- All open-source contributors

---

**Taqyeem Platform** - Empowering interviews, enhancing skills, bridging languages. 🚀
