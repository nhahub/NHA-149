# Taqyeem Backend API

A comprehensive backend API for the Taqyeem bilingual interview & learning platform with real-time communication support.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Interview Management**: Create days, slots, reservations, and sessions
- **Evaluation System**: Comprehensive evaluation criteria and feedback
- **Educational Content**: Articles, FAQs, and tips with bilingual support
- **File Upload**: Cloudinary integration for avatars and recordings
- **Real-time Communication**: Socket.io server for WebRTC signaling and session management
- **Slot Management**: Automatic slot status updates and reversal
- **Database**: MongoDB with Mongoose ODM
- **Security**: Rate limiting, CORS, Helmet, input validation

## 📁 Project Structure

```
backend/
├── index.js                 # Main server entry point
├── package.json             # Dependencies and scripts
├── env.example              # Environment variables template
├── vercel.json              # Vercel deployment configuration
├── src/
│   ├── app.controller.js   # Main app routes and middleware setup
│   ├── config/
│   │   └── cloudinary.js    # Cloudinary configuration
│   ├── DB/
│   │   ├── connection.js    # MongoDB connection
│   │   └── models/          # Mongoose models
│   │       ├── user.model.js
│   │       ├── day.model.js
│   │       ├── slot.model.js
│   │       ├── reservation.model.js
│   │       ├── session.model.js
│   │       ├── evaluation.model.js
│   │       ├── feedback.model.js
│   │       ├── educational-content.model.js
│   │       ├── interview-question.model.js
│   │       ├── session-question.model.js
│   │       └── schedule.model.js
│   ├── middleware/
│   │   ├── authentication.js    # JWT authentication
│   │   ├── authorization.js     # Role-based authorization
│   │   ├── error-handler.js     # Error handling middleware
│   │   ├── validation.js        # Request validation
│   │   └── index.js             # Middleware exports
│   ├── modules/              # Feature modules (MVC pattern)
│   │   ├── admin/
│   │   │   ├── admin.controller.js
│   │   │   └── admin.service.js
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   └── auth.validation.js
│   │   ├── day/
│   │   │   ├── day.controller.js
│   │   │   ├── day.service.js
│   │   │   └── day.validation.js
│   │   ├── evaluation/
│   │   │   ├── evaluation.controller.js
│   │   │   ├── evaluation.service.js
│   │   │   └── evaluation.validation.js
│   │   ├── feedback/
│   │   │   ├── feedback.controller.js
│   │   │   ├── feedback.service.js
│   │   │   └── feedback.validation.js
│   │   ├── learn/
│   │   │   ├── learn.controller.js
│   │   │   ├── learn.service.js
│   │   │   └── learn.validation.js
│   │   ├── reservation/
│   │   │   ├── reservation.controller.js
│   │   │   ├── reservation.service.js
│   │   │   └── reservation.validation.js
│   │   ├── session/
│   │   │   ├── session.controller.js
│   │   │   ├── session.service.js
│   │   │   └── session.validation.js
│   │   ├── slot/
│   │   │   ├── slot.controller.js
│   │   │   ├── slot.service.js
│   │   │   └── slot.validation.js
│   │   └── user/
│   │       ├── user.controller.js
│   │       ├── user.service.js
│   │       └── user.validation.js
│   ├── socket/
│   │   └── socketServer.js  # Socket.io server setup
│   └── utils/
│       ├── Encryption/      # Encryption utilities
│       ├── Hash/            # Password hashing
│       ├── multer/          # File upload configuration
│       ├── token/           # JWT token utilities
│       ├── response.js      # Response helpers
│       ├── validation.js    # Validation utilities
│       ├── slot-generator.js # Slot generation logic
│       └── time.js          # Time utilities
└── scripts/                 # Utility scripts
    ├── cleanup-slot-indexes.js
    └── migrate-schedule-indexes.js
```

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Taqyeem/backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp env.example .env
   ```

   Update the `.env` file with your configuration:

   ```env
   # Server Configuration
   PORT=5000
   HOST=localhost
   NODE_ENV=development

   # Database Configuration
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taqyeem

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d

   # Hash Configuration
   SALT_ROUNDS=12

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   CLOUDINARY_FOLDER=taqyeem

   # CORS Configuration
   FRONTEND_URL=http://localhost:5173

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=1000
   ```

4. **Start the server**

   ```bash
   # Development (with nodemon)
   npm run dev

   # Production
   npm start
   ```

   The API will be available at `http://localhost:5000/api/v1`

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api/v1
```

### Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

### Response Format

All API responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ] // For validation errors
}
```

## 🔐 User Roles

- **candidate**: Can reserve slots, attend sessions, view evaluations
- **interviewer**: Can create slots, manage reservations, conduct sessions, create evaluations
- **admin**: Full access to all features and user management

## 📋 API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user profile

### Users

- `GET /users` - Get all users (admin)
- `GET /users/:id` - Get user by ID
- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update current user profile
- `PUT /users/me/avatar` - Update avatar
- `PUT /users/:id` - Update user (admin)
- `DELETE /users/:id` - Delete user (admin)

### Interview Days

- `GET /days` - Get all interview days
- `GET /days/:id` - Get day by ID
- `POST /days` - Create interview day (interviewer/admin)
- `PUT /days/:id` - Update interview day (interviewer/admin)
- `DELETE /days/:id` - Delete interview day (interviewer/admin)

### Time Slots

- `GET /slots/:dayId` - Get slots for a day
- `GET /slots/my` - Get my slots (interviewer)
- `POST /slots` - Create time slot(s) (interviewer/admin)
- `PUT /slots/:id` - Update time slot (interviewer/admin)
- `DELETE /slots/:id` - Delete time slot (interviewer/admin)

### Reservations

- `GET /reservations` - Get all reservations (admin)
- `GET /reservations/me` - Get my reservations
- `GET /reservations/pending` - Get pending reservations (interviewer)
- `POST /reservations` - Create reservation (candidate)
- `POST /reservations/:id/accept` - Accept reservation (interviewer)
- `POST /reservations/:id/reject` - Reject reservation (interviewer)
- `DELETE /reservations/:id` - Delete reservation (admin) - **Reverses slot booking**

### Sessions

- `GET /sessions/me` - Get my sessions
- `GET /sessions/:id` - Get session by ID
- `POST /sessions/:id/start` - Start session (interviewer)
- `POST /sessions/:id/complete` - Complete session (interviewer)
- `POST /sessions/:id/cancel` - Cancel session
- `DELETE /sessions/:id` - Delete session (admin) - **Reverses slot booking**

### Evaluations

- `POST /evaluations` - Create evaluation (interviewer)
- `GET /evaluations/:sessionId` - Get evaluation by session ID
- `PUT /evaluations/:id` - Update evaluation (interviewer)
- `GET /evaluations/my` - Get my evaluations (as interviewer)
- `GET /evaluations/stats` - Get evaluation statistics (admin)

### Feedback

- `POST /feedbacks` - Create feedback
- `GET /feedbacks/:sessionId` - Get feedbacks by session
- `GET /feedbacks/my` - Get my feedbacks
- `PUT /feedbacks/:id` - Update feedback
- `DELETE /feedbacks/:id` - Delete feedback
- `GET /feedbacks/public` - Get public feedbacks

### Educational Content

- `GET /learn` - Get all content
- `GET /learn/:id` - Get content by ID
- `GET /learn/categories` - Get content categories
- `POST /learn` - Create content (admin)
- `PUT /learn/:id` - Update content (admin)
- `DELETE /learn/:id` - Delete content (admin)
- `GET /learn/stats` - Get content statistics (admin)

### Admin

- `GET /admin/users` - Get all users with statistics
- `GET /admin/reservations` - Get all reservations with filters
- `GET /admin/sessions` - Get all sessions with filters
- `DELETE /admin/reservations/:id` - Delete reservation (reverses slot)
- `DELETE /admin/sessions/:id` - Delete session (reverses slot)
- `GET /admin/stats` - Get platform statistics and trends

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication with expiration
- **Role-based Authorization**: Different access levels for different user types
- **Rate Limiting**: Prevents API abuse (configurable window and max requests)
- **Input Validation**: Comprehensive request validation with express-validator and Joi
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet**: Security headers for Express
- **Password Hashing**: bcrypt with configurable salt rounds (default: 12)
- **File Upload Security**: Secure file handling with Cloudinary, type and size validation

## 💬 Real-time Features

### Socket.io Server

The backend includes a Socket.io server for real-time communication:

**Features:**
- WebRTC signaling (offer, answer, ICE candidates)
- Session room management
- User join/leave notifications
- Real-time evaluation updates
- Authentication via JWT tokens

**Events:**
- `join-session` - Join a session room
- `leave-session` - Leave a session room
- `offer` - WebRTC offer
- `answer` - WebRTC answer
- `ice-candidate` - ICE candidate exchange
- `evaluation-update` - Real-time evaluation updates

**Configuration:**
- CORS configured for frontend URL
- JWT authentication middleware
- Room-based messaging
- Automatic cleanup on disconnect

## 🎯 Key Features

### Slot Management

- **Status Management**: 
  - `available`: No candidates booked
  - `pending`: Some candidates booked (less than maxCandidates)
  - `booked`: At maximum capacity
- **Automatic Status Updates**: Slot status updates automatically when reservations are created, accepted, or rejected
- **Slot Reversal**: When reservations or sessions are deleted/completed, slots automatically become available again:
  - Decrement `currentCandidates`
  - Update status based on new count
  - Prevents negative counts

### Reservation Rules

- **One Reservation Rule**: Each candidate can have only one active reservation per interviewer
- **Status Flow**: `pending` → `accepted`/`rejected`
- **Automatic Slot Updates**: Slot status and candidate count update on reservation changes

### Evaluation System

- **Criteria Scoring**: 
  - Communication (0-10)
  - Technical (0-10)
  - Problem Solving (0-10)
  - Confidence (0-10)
- **Overall Score**: Automatically calculated from criteria scores
- **Comments**: Optional comments for each criterion
- **General Notes**: Additional notes field
- **Session Association**: Each evaluation is linked to a session

## 🌐 Bilingual Support

The API supports both Arabic and English content:

- User language preference stored in profile
- Bilingual educational content (title, content, description in both languages)
- Localized error messages (can be extended)
- RTL/LTR layout support via metadata

## 📊 Database Schema

### Key Relationships

```
User (1) ───< Reservation >───(1) Slot
User (1) ───< Session >───(1) Reservation
Session (1) ───< Evaluation
Session (1) ───< Feedback
User (1) ───< EducationalContent
```

### Indexes

- `email` (unique) on User
- `role` on User
- `dayId` on Slot
- `sessionId` on Evaluation/Feedback
- `category` on EducationalContent
- `slotId` on Reservation
- `reservationId` on Session

### Models

- **User**: Authentication, profile, role, preferences
- **Day**: Interview day with date and metadata
- **Slot**: Time slot with capacity (maxCandidates, currentCandidates, status)
- **Reservation**: Links candidate, interviewer, and slot
- **Session**: Interview session with status tracking
- **Evaluation**: Performance assessment with criteria scores
- **Feedback**: Session feedback
- **EducationalContent**: Learning materials with bilingual support

## 🚀 Deployment

### Environment Setup

1. Set all environment variables in your hosting platform
2. Configure MongoDB Atlas connection string
3. Set up Cloudinary account and credentials
4. Configure CORS with production frontend URL
5. Adjust rate limiting for production traffic

### Deployment Platforms

- **Vercel**: Serverless functions (configure `vercel.json`)
- **Railway**: Direct Node.js deployment
- **Heroku**: Standard Node.js deployment
- **DigitalOcean**: App Platform or Droplet
- **AWS**: EC2 or Elastic Beanstalk

### Socket.io Considerations

- Ensure your hosting platform supports WebSocket connections
- Configure CORS for Socket.io connections
- Consider using a TURN server for WebRTC in production (for users behind NAT/firewalls)

### Database

- Use MongoDB Atlas for cloud database
- Configure connection string with proper credentials
- Set up database indexes for performance
- Enable backup and monitoring

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests (if configured)

### Code Structure

- **MVC Pattern**: Controllers handle requests, services contain business logic
- **Validation**: Separate validation files for each module
- **Error Handling**: Centralized error handling middleware
- **Response Format**: Consistent response format via utility functions

### Development Tips

- Use nodemon for automatic server restart
- Check MongoDB connection in logs
- Test Socket.io connections with Socket.io client tools
- Use Postman or similar for API testing
- Check Cloudinary uploads in Cloudinary dashboard

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

### Guidelines

- Follow existing code structure (MVC pattern)
- Add validation for new endpoints
- Update error handling
- Add JSDoc comments for complex functions
- Test with different user roles
- Ensure slot reversal logic is maintained

## 📞 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the main project README
- Review module documentation in code comments

---

**Taqyeem Backend API** - Robust, secure, real-time interview platform API 🚀
