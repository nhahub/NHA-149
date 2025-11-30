export const APP_CONFIG = {
  name: "Taqyeem",
  nameAr: "تقييم",
  description: "Bilingual Interview & Learning Platform",
  descriptionAr: "منصة المقابلات والتعلم ثنائية اللغة",
  version: "1.0.0",
  apiBaseUrl:
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
  supportedLanguages: ["en", "ar"],
  defaultLanguage: "en",
  theme: {
    primary: "blue",
    secondary: "cyan",
    accent: "sky",
  },
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  INTERVIEWS: "/interviews",
  SESSION: "/session/:id",
  LEARNING: "/learning",
  EVALUATIONS: "/evaluations",
  ADMIN: "/admin",
  SHOWCASE: "/showcase",
};

export const USER_ROLES = {
  CANDIDATE: "candidate",
  INTERVIEWER: "interviewer",
  ADMIN: "admin",
};

export const INTERVIEW_STATUS = {
  SCHEDULED: "scheduled",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const RESERVATION_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
};

export const SLOT_STATUS = {
  AVAILABLE: "available",
  PENDING: "pending",
  BOOKED: "booked",
};
