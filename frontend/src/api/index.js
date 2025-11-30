import api from "../config/api.js";

// Auth API
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => {
    // Check if userData is FormData
    if (userData instanceof FormData) {
      return api.post("/auth/register", userData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return api.post("/auth/register", userData);
  },
  getMe: () => api.get("/auth/me"),
};

// Users API
export const usersAPI = {
  getUsers: (params) => api.get("/users", { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  getInterviewers: (params) => api.get("/users/interviewers", { params }),
  getPendingInterviewers: (params) =>
    api.get("/users/pending-interviewers", { params }),
  approveInterviewer: (id) => api.put(`/users/${id}/approve`),
  rejectInterviewer: (id) => api.put(`/users/${id}/reject`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  updateProfile: (data) => api.put("/users/me", data),
  updateAvatar: (formData) =>
    api.put("/users/me/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deactivateAccount: () => api.put("/users/me/deactivate"),
};

// Days API
export const daysAPI = {
  getDays: (params) => api.get("/days", { params }),
  getDayById: (id) => api.get(`/days/${id}`),
  createDay: (data) => api.post("/days", data),
  updateDay: (id, data) => api.put(`/days/${id}`, data),
  deleteDay: (id) => api.delete(`/days/${id}`),
};

// Schedules API
export const schedulesAPI = {
  getSchedules: (params) => api.get("/schedules", { params }),
  getSchedulesByDay: (dayId, params) =>
    api.get(`/schedules/day/${dayId}`, { params }),
  getScheduleById: (id) => api.get(`/schedules/${id}`),
  createSchedule: (data) => api.post("/schedules", data),
  getMySchedules: (params) => api.get("/schedules/my", { params }),
  updateSchedule: (id, data) => api.put(`/schedules/${id}`, data),
  uploadScheduleImage: (id, formData) =>
    api.put(`/schedules/${id}/image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteSchedule: (id) => api.delete(`/schedules/${id}`),
};

// Slots API
export const slotsAPI = {
  getSlotsByDay: (dayId, params) => api.get(`/slots/${dayId}`, { params }),
  getSlotsByInterviewer: (interviewerId, params) =>
    api.get(`/slots/interviewer/${interviewerId}`, { params }),
  createSlot: (data) => api.post("/slots", data),
  getMySlots: (params) => api.get("/slots/my", { params }),
  updateSlot: (id, data) => api.put(`/slots/${id}`, data),
  deleteSlot: (id) => api.delete(`/slots/${id}`),
};

// Reservations API
export const reservationsAPI = {
  createReservation: (data) => api.post("/reservations", data),
  getMyReservations: (params) => api.get("/reservations/me", { params }),
  getPendingReservations: () => api.get("/reservations/pending"),
  acceptReservation: (id) => api.post(`/reservations/${id}/accept`),
  rejectReservation: (id, data) => api.post(`/reservations/${id}/reject`, data),
};

// Sessions API
export const sessionsAPI = {
  getMySessions: (params) => api.get("/sessions/me", { params }),
  getSessionById: (id) => api.get(`/sessions/${id}`),
  startSession: (id) => api.post(`/sessions/${id}/start`),
  uploadRecording: (id, formData) =>
    api.post(`/sessions/${id}/recording`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  completeSession: (id, data) => api.post(`/sessions/${id}/complete`, data),
  cancelSession: (id, data) => api.post(`/sessions/${id}/cancel`, data),
};

// Evaluations API
export const evaluationsAPI = {
  createEvaluation: (data) => api.post("/evaluations", data),
  getEvaluationBySession: (sessionId) => api.get(`/evaluations/${sessionId}`),
  updateEvaluation: (id, data) => api.put(`/evaluations/${id}`, data),
  getMyEvaluations: (params) => api.get("/evaluations/my", { params }),
  getEvaluationStats: () => api.get("/evaluations/stats"),
};

// Feedback API
export const feedbackAPI = {
  createFeedback: (data) => api.post("/feedbacks", data),
  getFeedbacksBySession: (sessionId) => api.get(`/feedbacks/${sessionId}`),
  getMyFeedbacks: (params) => api.get("/feedbacks/my", { params }),
  updateFeedback: (id, data) => api.put(`/feedbacks/${id}`, data),
  deleteFeedback: (id) => api.delete(`/feedbacks/${id}`),
  getPublicFeedbacks: (params) => api.get("/feedbacks/public", { params }),
};

// Learning API
export const learningAPI = {
  getContent: (params) => api.get("/learn", { params }),
  getContentById: (id) => api.get(`/learn/${id}`),
  getCategories: () => api.get("/learn/categories"),
  createContent: (formData) => {
    if (formData instanceof FormData) {
      return api.post("/learn", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return api.post("/learn", formData);
  },
  updateContent: (id, formData) => {
    if (formData instanceof FormData) {
      return api.put(`/learn/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return api.put(`/learn/${id}`, formData);
  },
  deleteContent: (id) => api.delete(`/learn/${id}`),
  getContentStats: () => api.get("/learn/stats"),
};

// Interview Questions API
export const interviewQuestionsAPI = {
  getQuestionsBySpecialization: (specialization, params) =>
    api.get(`/interview-questions/${specialization}`, { params }),
  getSessionQuestions: (sessionId) =>
    api.get(`/interview-questions/session/${sessionId}`),
  markQuestionAsAsked: (sessionId, data) =>
    api.post(`/interview-questions/session/${sessionId}/ask`, data),
  createQuestion: (data) => api.post("/interview-questions", data),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get("/admin/dashboard"),
  getAllReservations: (params) => api.get("/admin/reservations", { params }),
  getAllSlots: (params) => api.get("/admin/slots", { params }),
  getAllSessions: (params) => api.get("/admin/sessions", { params }),
  deleteReservation: (id) => api.delete(`/admin/reservations/${id}`),
  deleteSlot: (id) => api.delete(`/admin/slots/${id}`),
  deleteSession: (id) => api.delete(`/admin/sessions/${id}`),
};
