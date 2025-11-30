# Taqyeem Frontend

A modern, bilingual React frontend for the Taqyeem interview & learning platform with real-time video interview capabilities.

## 🚀 Features

- **Modern React**: Built with React 18, Vite, and modern React patterns
- **Bilingual Support**: Full Arabic/English support with RTL/LTR layouts
- **Beautiful UI**: TailwindCSS 4 + Custom UI components with blue/cyan theme
- **State Management**: React Query (TanStack Query) for server state, Context for app state
- **Routing**: React Router v6 for navigation
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion for smooth animations
- **Real-time Communication**: Socket.io client for WebRTC signaling and session management
- **Video Interviews**: WebRTC peer-to-peer video/audio communication
- **Responsive**: Mobile-first responsive design
- **Accessibility**: WCAG compliant components

## 📁 Project Structure

```
src/
├── api/                    # API service functions
│   └── index.js           # Axios instance and API methods
├── components/             # React components
│   ├── interviews/        # Interview-related components
│   │   ├── DayCalendar.jsx
│   │   ├── InterviewerCard.jsx
│   │   ├── InterviewerList.jsx
│   │   ├── ReservationCard.jsx
│   │   ├── ReservationsList.jsx
│   │   ├── ScheduleForm.jsx
│   │   ├── SessionsList.jsx
│   │   ├── SlotCard.jsx
│   │   ├── SlotsCalendar.jsx
│   │   └── SlotsList.jsx
│   ├── sessions/          # Session components
│   │   ├── EvaluationDisplay.jsx
│   │   ├── LiveEvaluationForm.jsx
│   │   ├── QuestionsSidebar.jsx
│   │   └── VideoCall.jsx
│   ├── layout/            # Layout components
│   │   ├── Footer.jsx
│   │   └── Header.jsx
│   ├── ui/                # Reusable UI components
│   │   ├── Avatar.jsx
│   │   ├── Badge.jsx
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── ConfirmDialog.jsx
│   │   ├── CreateEditContentDialog.jsx
│   │   ├── EditUserDialog.jsx
│   │   ├── Input.jsx
│   │   ├── PageHeader.jsx
│   │   ├── PasswordInput.jsx
│   │   ├── RejectReservationDialog.jsx
│   │   └── Tabs.jsx
│   ├── AppName.jsx
│   ├── LanguageToggle.jsx
│   └── ProtectedRoute.jsx
├── pages/                  # Page components
│   ├── AdminPage.jsx      # Admin dashboard
│   ├── DashboardPage.jsx  # User dashboard
│   ├── EvaluationsPage.jsx
│   ├── HomePage.jsx
│   ├── InterviewsPage.jsx
│   ├── LearningPage.jsx
│   ├── LoginPage.jsx
│   ├── NotFoundPage.jsx
│   ├── ProfilePage.jsx
│   ├── RegisterPage.jsx
│   ├── SessionPage.jsx    # Video interview session
│   └── StyleShowcasePage.jsx
├── hooks/                  # Custom React hooks
│   ├── api.js             # React Query hooks
│   ├── useAuth.js         # Authentication hook
│   └── useSocket.js       # Socket.io hook
├── context/                # React Context providers
│   └── AuthContext.jsx    # Authentication context
├── config/                 # Configuration files
│   ├── api.js             # API configuration
│   ├── app.js             # App routes and constants
│   ├── i18n.js            # i18next configuration
│   └── theme.js            # Theme configuration
├── utils/                  # Utility functions
│   ├── helpers.js
│   ├── localStorage.js
│   └── validation.js
├── locales/                # Translation files
│   ├── en.json            # English translations
│   └── ar.json            # Arabic translations
├── App.jsx                 # Main app component
├── App.css                 # Global styles
├── index.css               # TailwindCSS imports
└── main.jsx                # App entry point
```

## 🛠️ Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment Setup**

   ```bash
   cp env.example .env
   ```

   Update the `.env` file with your configuration:

   ```env
   # API Configuration
   VITE_API_BASE_URL=http://localhost:5000/api/v1

   # App Configuration
   VITE_APP_NAME=Taqyeem
   VITE_APP_NAME_AR=تقييم
   VITE_APP_DESCRIPTION=Bilingual Interview & Learning Platform
   VITE_APP_DESCRIPTION_AR=منصة المقابلات والتعلم ثنائية اللغة

   # Environment
   VITE_NODE_ENV=development

   # Features
   VITE_ENABLE_DEVTOOLS=true
   VITE_ENABLE_ANALYTICS=false
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

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
- **Responsive**: Fluid typography scales with proper line heights

### Components

- **Buttons**: Multiple variants (default, outline, secondary, ghost, danger)
- **Cards**: Clean, modern card layouts with hover effects
- **Forms**: Accessible form components with validation and error messages
- **Navigation**: Responsive navigation with mobile menu
- **Badges**: Status indicators and labels (StatusBadge component)
- **Dialogs**: Modal dialogs for confirmations and forms
- **Tabs**: Tab navigation component
- **Inputs**: Text inputs, password inputs with validation

## 🌐 Internationalization

The app supports both Arabic and English with:

- **RTL/LTR Layout**: Automatic direction switching based on selected language
- **Font Selection**: Appropriate fonts for each language (Cairo for Arabic, Inter for English)
- **Translation Files**: JSON-based translations in `src/locales/`
- **Language Detection**: Browser language detection on first visit
- **Persistent Settings**: Language preference saved in localStorage
- **Dynamic Content**: All UI text, labels, and messages are translatable

### Adding Translations

1. Add new keys to both `src/locales/en.json` and `src/locales/ar.json`
2. Use the `useTranslation` hook in components:

   ```jsx
   import { useTranslation } from "react-i18next";

   function MyComponent() {
     const { t } = useTranslation();
     return <h1>{t("navigation.home")}</h1>;
   }
   ```

3. Translation keys are organized by feature/domain (e.g., `navigation`, `auth`, `interviews`, `sessions`)

## 🔧 API Integration

The frontend uses React Query (TanStack Query) for efficient API management:

### Using React Query Hooks

```jsx
import { useUsers, useCreateUser } from "../hooks/api.js";

function UsersList() {
  const { data: users, isLoading, error } = useUsers();
  const createUser = useCreateUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleCreate = async () => {
    await createUser.mutateAsync({ name: "John", email: "john@example.com" });
  };

  return (
    <ul>
      {users?.map((user) => (
        <li key={user._id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Available Hooks

- `useUsers()` - Get all users
- `useUser(id)` - Get user by ID
- `useSlots(dayId)` - Get slots for a day
- `useReservations()` - Get reservations
- `useSessions()` - Get sessions
- `useEvaluations()` - Get evaluations
- `useEvaluationBySession(sessionId)` - Get evaluation for a session
- And more in `src/hooks/api.js`

## 💬 Real-time Features

### Socket.io Integration

The app uses Socket.io for real-time communication:

```jsx
import { useSocket } from "../hooks/useSocket.js";

function SessionComponent() {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.emit("join-session", { sessionId: "123" });
      socket.on("user-joined", (data) => {
        console.log("User joined:", data);
      });
    }
  }, [socket]);

  return <div>Connected: {isConnected ? "Yes" : "No"}</div>;
}
```

### WebRTC Video Calls

The `VideoCall` component handles peer-to-peer video communication:

- **Signaling**: Uses Socket.io for WebRTC signaling (offer, answer, ICE candidates)
- **Media Streams**: Captures and displays local/remote video/audio
- **Session Management**: Handles join/leave events
- **Error Handling**: Graceful handling of connection failures

## 🎭 User Roles

The app supports three user roles with different interfaces:

### Candidate

- Browse and book interview slots
- View available slots in calendar format
- Attend scheduled video interviews
- View evaluation results and feedback
- Access learning materials
- Manage profile and preferences

### Interviewer

- Create interview days and time slots
- Manage reservations (accept/reject with reasons)
- Conduct real-time video interview sessions
- Submit comprehensive evaluations with criteria scoring
- Provide feedback to candidates
- View session history and statistics

### Admin

- **User Management**: View, edit, and delete users
- **Reservation Management**: View, filter, search, and delete reservations
- **Session Management**: 
  - View all sessions with search and filtering
  - Delete sessions
  - View candidate evaluations for each session (View Evaluation button)
- **Content Management**: Manage educational content
- **Analytics**: Access platform statistics and trends

## 📱 Responsive Design

- **Mobile First**: Designed for mobile devices first
- **Breakpoints**: 
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
  - `2xl`: 1536px
- **Flexible Layouts**: CSS Grid and Flexbox for responsive layouts
- **Touch Friendly**: Appropriate touch targets (min 44x44px) and interactions
- **Adaptive Components**: Components adapt to screen size

## 🚀 Deployment

1. **Build for production**

   ```bash
   npm run build
   # or
   npm run build:production
   ```

   This creates an optimized production build in the `dist/` directory.

2. **Preview production build**

   ```bash
   npm run preview
   # or
   npm run preview:production
   ```

3. **Deploy to your hosting platform**
   - **Vercel**: Connect your repository and deploy
   - **Netlify**: Drag and drop the `dist` folder or connect repository
   - **Any static hosting**: Upload the `dist` folder contents
   - Ensure environment variables are set in your hosting platform
   - Configure redirects for SPA routing (all routes → `index.html`)

### Vercel Configuration

If deploying to Vercel, create a `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server (Vite dev server)
- `npm run build` - Build for production
- `npm run build:production` - Build with production mode
- `npm run preview` - Preview production build locally
- `npm run preview:production` - Preview production build with production mode
- `npm run lint` - Run ESLint

### Code Style

- **ESLint**: Configured for React best practices
- **Conventions**:
  - PascalCase for components (e.g., `UserCard.jsx`)
  - camelCase for functions and variables
  - Descriptive component and function names
  - Use functional components with hooks
  - Extract reusable logic into custom hooks

### Development Tips

- Use React Query DevTools in development (enabled via `VITE_ENABLE_DEVTOOLS`)
- Hot Module Replacement (HMR) is enabled for fast development
- Check browser console for React Query cache information
- Use React DevTools for component inspection

## 🔒 Security

- **Environment Variables**: Sensitive data in `.env` files (never commit `.env`)
- **API Security**: JWT token management with automatic refresh
- **Input Validation**: Client-side validation with Zod schemas
- **XSS Protection**: React's built-in XSS protection
- **HTTPS**: Always use HTTPS in production
- **Token Storage**: Tokens stored securely in localStorage

## 📚 Dependencies

### Core

- **React 18**: Latest React with concurrent features
- **Vite 7**: Fast build tool and dev server
- **React Router 6**: Client-side routing
- **React Query 5**: Server state management and caching

### UI & Styling

- **TailwindCSS 4**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Lucide React**: Icon library
- **date-fns**: Date utility library
- **react-datepicker**: Date picker component

### Forms & Validation

- **React Hook Form**: Performant forms with minimal re-renders
- **Zod**: TypeScript-first schema validation
- **@hookform/resolvers**: Form validation resolvers

### Internationalization

- **react-i18next**: React bindings for i18next
- **i18next**: Core internationalization library
- **i18next-browser-languagedetector**: Automatic language detection

### Real-time & Communication

- **socket.io-client**: Socket.io client for real-time communication
- **WebRTC**: Native browser APIs for peer-to-peer video/audio

### Utilities

- **Axios**: HTTP client for API requests
- **clsx**: Conditional className utility
- **tailwind-merge**: Tailwind class merging utility
- **react-hot-toast**: Toast notification library

## 🎯 Key Features

### Interview Booking

- Calendar view of available slots
- Filter by interviewer
- Book slots with one-click reservation
- View reservation status (pending, accepted, rejected)

### Video Interviews

- Real-time WebRTC video/audio communication
- Session management with join/leave notifications
- Live evaluation form during interviews
- Questions sidebar for interviewers
- Recording support (optional)

### Evaluations

- View detailed evaluations with criteria scores
- Communication, Technical, Problem Solving, and Confidence scores
- Comments and general notes
- Overall score calculation
- Admin can view all evaluations

### Admin Dashboard

- Comprehensive user management
- Reservation and session management
- View evaluations for any session
- Content management for educational materials
- Platform statistics and analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Ensure bilingual support (add translations)
5. Test in both Arabic and English
6. Test responsive design on mobile
7. Submit a pull request

### Guidelines

- Follow existing code style and structure
- Add translations for new text (both English and Arabic)
- Ensure components are responsive
- Test with React Query DevTools
- Use TypeScript-style prop validation with PropTypes or JSDoc

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the main project README
- Review component documentation in code comments

---

**Taqyeem Frontend** - Modern, bilingual, real-time interview platform 🚀
