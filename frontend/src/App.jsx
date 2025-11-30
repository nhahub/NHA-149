import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { Footer } from "./components/layout/Footer.jsx";
import { Header } from "./components/layout/Header.jsx";
import { ROUTES } from "./config/app.js";
import { AuthProvider } from "./context/AuthContext.jsx";

// Import pages
import AdminPage from "./pages/AdminPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import EvaluationsPage from "./pages/EvaluationsPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import InterviewsPage from "./pages/InterviewsPage.jsx";
import LearningPage from "./pages/LearningPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import SessionPage from "./pages/SessionPage.jsx";
import StyleShowcasePage from "./pages/StyleShowcasePage.jsx";

// Import i18n configuration
import "./config/i18n.js";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <div className="min-h-screen bg-animated flex flex-col relative z-10">
            <Header />
            <main className="flex-1">
              <Routes>
                {/* Public routes */}
                <Route path={ROUTES.HOME} element={<HomePage />} />
                <Route
                  path={ROUTES.LOGIN}
                  element={
                    <ProtectedRoute requireAuth={false}>
                      <LoginPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={ROUTES.REGISTER}
                  element={
                    <ProtectedRoute requireAuth={false}>
                      <RegisterPage />
                    </ProtectedRoute>
                  }
                />

                {/* Protected routes */}
                <Route
                  path={ROUTES.DASHBOARD}
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={ROUTES.INTERVIEWS}
                  element={
                    <ProtectedRoute>
                      <InterviewsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={ROUTES.SESSION}
                  element={
                    <ProtectedRoute>
                      <SessionPage />
                    </ProtectedRoute>
                  }
                />
                {/* Public route - no authentication required */}
                <Route path={ROUTES.LEARNING} element={<LearningPage />} />
                <Route
                  path={ROUTES.PROFILE}
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={ROUTES.EVALUATIONS}
                  element={
                    <ProtectedRoute>
                      <EvaluationsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={ROUTES.ADMIN}
                  element={
                    <ProtectedRoute>
                      <AdminPage />
                    </ProtectedRoute>
                  }
                />

                {/* Style Showcase Route */}
                <Route path={ROUTES.SHOWCASE} element={<StyleShowcasePage />} />

                {/* Catch all route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: "#10b981",
                    secondary: "#fff",
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#fff",
                  },
                },
              }}
            />
          </div>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
