import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminAPI,
  authAPI,
  daysAPI,
  evaluationsAPI,
  interviewQuestionsAPI,
  learningAPI,
  reservationsAPI,
  schedulesAPI,
  sessionsAPI,
  slotsAPI,
  usersAPI,
} from "../api";

// Auth hooks
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      // Don't store in localStorage here - let AuthContext handle it
      queryClient.setQueryData(["user"], data.data.user);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authAPI.register,
    onSuccess: (data) => {
      // Don't store in localStorage here - let AuthContext handle it
      queryClient.setQueryData(["user"], data.data.user);
    },
  });
};

export const useGetMe = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: authAPI.getMe,
    select: (data) => data.data.user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry if backend is not available
    enabled: !!localStorage.getItem("token"), // Only run if there's a token
  });
};

// Users hooks
export const useUsers = (params) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => usersAPI.getUsers(params),
    select: (response) => response.data.data,
  });
};

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: adminAPI.getDashboard,
    select: (response) => response.data.data,
    staleTime: 60 * 1000,
  });
};

// Admin Reservations hooks
export const useAdminReservations = (params) => {
  return useQuery({
    queryKey: ["admin-reservations", params],
    queryFn: () => adminAPI.getAllReservations(params),
    select: (response) => response.data.data,
  });
};

export const useDeleteAdminReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => adminAPI.deleteReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-reservations"]);
      queryClient.invalidateQueries(["admin-dashboard"]);
    },
  });
};

// Admin Slots hooks
export const useAdminSlots = (params) => {
  return useQuery({
    queryKey: ["admin-slots", params],
    queryFn: () => adminAPI.getAllSlots(params),
    select: (response) => response.data.data,
  });
};

export const useDeleteAdminSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => adminAPI.deleteSlot(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-slots"]);
      queryClient.invalidateQueries(["admin-dashboard"]);
    },
  });
};

// Admin Sessions hooks
export const useAdminSessions = (params) => {
  return useQuery({
    queryKey: ["admin-sessions", params],
    queryFn: () => adminAPI.getAllSessions(params),
    select: (response) => response.data.data,
  });
};

export const useDeleteAdminSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => adminAPI.deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-sessions"]);
      queryClient.invalidateQueries(["admin-dashboard"]);
    },
  });
};

export const useInterviewers = (params) => {
  return useQuery({
    queryKey: ["interviewers", params],
    queryFn: () => usersAPI.getInterviewers(params),
    select: (response) => response.data.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersAPI.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
    },
  });
};

export const useApproveInterviewer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => usersAPI.approveInterviewer(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-dashboard"]);
      queryClient.invalidateQueries(["users"]);
    },
  });
};

export const useRejectInterviewer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => usersAPI.rejectInterviewer(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-dashboard"]);
      queryClient.invalidateQueries(["users"]);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => usersAPI.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-dashboard"]);
      queryClient.invalidateQueries(["users"]);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => usersAPI.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-dashboard"]);
      queryClient.invalidateQueries(["users"]);
    },
  });
};

// Days hooks
export const useDays = (params) => {
  return useQuery({
    queryKey: ["days", params],
    queryFn: () => daysAPI.getDays(params),
    select: (response) => response.data.data,
  });
};

export const useDay = (id) => {
  return useQuery({
    queryKey: ["day", id],
    queryFn: () => daysAPI.getDayById(id),
    select: (response) => response.data.data.day,
    enabled: !!id,
  });
};

export const useCreateDay = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: daysAPI.createDay,
    onSuccess: () => {
      queryClient.invalidateQueries(["days"]);
    },
  });
};

// Schedules hooks
export const useSchedules = (params) => {
  return useQuery({
    queryKey: ["schedules", params],
    queryFn: () => schedulesAPI.getSchedules(params),
    select: (response) => response.data.data,
  });
};

export const useSchedulesByDay = (dayId, params) => {
  return useQuery({
    queryKey: ["schedules", "day", dayId, params],
    queryFn: () => schedulesAPI.getSchedulesByDay(dayId, params),
    select: (response) => response.data.data.schedules,
    enabled: !!dayId,
  });
};

export const useSchedule = (id) => {
  return useQuery({
    queryKey: ["schedule", id],
    queryFn: () => schedulesAPI.getScheduleById(id),
    select: (response) => response.data.data,
    enabled: !!id,
  });
};

export const useMySchedules = (params, options = {}) => {
  return useQuery({
    queryKey: ["my-schedules", params],
    queryFn: () => schedulesAPI.getMySchedules(params),
    select: (response) => response.data.data.schedules,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: schedulesAPI.createSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries(["schedules"]);
      queryClient.invalidateQueries(["my-schedules"]);
      queryClient.invalidateQueries(["slots"]);
    },
  });
};

export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => schedulesAPI.updateSchedule(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(["schedule", id]);
      queryClient.invalidateQueries(["schedules"]);
      queryClient.invalidateQueries(["my-schedules"]);
      queryClient.invalidateQueries(["slots"]);
    },
  });
};

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: schedulesAPI.deleteSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries(["schedules"]);
      queryClient.invalidateQueries(["my-schedules"]);
      queryClient.invalidateQueries(["slots"]);
    },
  });
};

// Slots hooks
export const useSlotsByDay = (dayId, params) => {
  return useQuery({
    queryKey: ["slots", dayId, params],
    queryFn: () => slotsAPI.getSlotsByDay(dayId, params),
    select: (response) => response.data.data.slots,
    enabled: !!dayId,
  });
};

export const useSlotsByInterviewer = (interviewerId, params) => {
  return useQuery({
    queryKey: ["interviewer-slots", interviewerId, params],
    queryFn: () => slotsAPI.getSlotsByInterviewer(interviewerId, params),
    select: (response) => response.data.data.slots,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
    enabled: !!interviewerId,
  });
};

export const useMySlots = (params) => {
  return useQuery({
    queryKey: ["my-slots", params],
    queryFn: () => slotsAPI.getMySlots(params),
    select: (response) => response.data.data.slots,
  });
};

export const useCreateSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: slotsAPI.createSlot,
    onSuccess: () => {
      queryClient.invalidateQueries(["slots"]);
      queryClient.invalidateQueries(["my-slots"]);
    },
  });
};

// Reservations hooks
export const useMyReservations = (params) => {
  return useQuery({
    queryKey: ["my-reservations", params],
    queryFn: () => reservationsAPI.getMyReservations(params),
    select: (response) => response.data.data.reservations,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};

export const usePendingReservations = (enabled = true) => {
  return useQuery({
    queryKey: ["pending-reservations"],
    queryFn: reservationsAPI.getPendingReservations,
    select: (response) => response.data.data.reservations,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
    enabled,
  });
};

export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reservationsAPI.createReservation,
    onSuccess: () => {
      queryClient.invalidateQueries(["my-reservations"]);
      queryClient.invalidateQueries(["slots"]);
    },
  });
};

export const useAcceptReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reservationsAPI.acceptReservation,
    onSuccess: async () => {
      // Invalidate and refetch pending reservations immediately
      await queryClient.invalidateQueries({ queryKey: ["pending-reservations"] });
      await queryClient.refetchQueries({ queryKey: ["pending-reservations"] });
      
      // Invalidate other related queries
      queryClient.invalidateQueries({ queryKey: ["my-reservations"] });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["slots"] });
      queryClient.invalidateQueries({ queryKey: ["interviewer-slots"] });
    },
  });
};

export const useRejectReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => reservationsAPI.rejectReservation(id, data),
    onSuccess: async () => {
      // Invalidate and refetch pending reservations immediately
      await queryClient.invalidateQueries({ queryKey: ["pending-reservations"] });
      await queryClient.refetchQueries({ queryKey: ["pending-reservations"] });
      
      // Invalidate other related queries
      queryClient.invalidateQueries({ queryKey: ["my-reservations"] });
      queryClient.invalidateQueries({ queryKey: ["slots"] });
      queryClient.invalidateQueries({ queryKey: ["interviewer-slots"] });
    },
  });
};

// Sessions hooks
export const useMySessions = (params) => {
  return useQuery({
    queryKey: ["my-sessions", params],
    queryFn: () => sessionsAPI.getMySessions(params),
    select: (data) => data.data.data?.sessions || [],
  });
};

export const useSession = (id) => {
  return useQuery({
    queryKey: ["session", id],
    queryFn: () => sessionsAPI.getSessionById(id),
    select: (data) => data.data.data?.session || data.data.session,
    enabled: !!id,
    retry: 1,
  });
};

export const useStartSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sessionsAPI.startSession,
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries(["session", sessionId]);
      queryClient.invalidateQueries(["my-sessions"]);
    },
  });
};

export const useCompleteSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => sessionsAPI.completeSession(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(["session", id]);
      queryClient.invalidateQueries(["my-sessions"]);
    },
  });
};


// Interview Questions hooks
export const useInterviewQuestions = (specialization, params) => {
  return useQuery({
    queryKey: ["interview-questions", specialization, params],
    queryFn: () =>
      interviewQuestionsAPI.getQuestionsBySpecialization(specialization, params),
    select: (data) => data.data.data.questions,
    enabled: !!specialization,
  });
};

export const useSessionQuestions = (sessionId) => {
  return useQuery({
    queryKey: ["session-questions", sessionId],
    queryFn: () => interviewQuestionsAPI.getSessionQuestions(sessionId),
    select: (data) => data.data.data.questions,
    enabled: !!sessionId,
  });
};

export const useMarkQuestionAsAsked = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, data }) =>
      interviewQuestionsAPI.markQuestionAsAsked(sessionId, data),
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries(["session-questions", sessionId]);
    },
  });
};

// Evaluations hooks
export const useEvaluationBySession = (sessionId) => {
  return useQuery({
    queryKey: ["evaluation", sessionId],
    queryFn: () => evaluationsAPI.getEvaluationBySession(sessionId),
    select: (response) => {
      // Handle the response structure: response.data.data.evaluation
      if (response?.data?.data?.evaluation) {
        return response.data.data.evaluation;
      }
      // Fallback: try response.data.evaluation
      if (response?.data?.evaluation) {
        return response.data.evaluation;
      }
      return null;
    },
    enabled: !!sessionId,
    retry: false, // Don't retry on 404 errors
  });
};

export const useMyEvaluations = (params) => {
  return useQuery({
    queryKey: ["my-evaluations", params],
    queryFn: () => evaluationsAPI.getMyEvaluations(params),
    select: (response) => {
      // Response structure: response.data = { message, data: { evaluations, pagination } }
      // So response.data.data = { evaluations, pagination }
      const result = response?.data?.data || {};
      return result;
    },
  });
};

export const useCreateEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: evaluationsAPI.createEvaluation,
    onSuccess: (_, data) => {
      queryClient.invalidateQueries(["evaluation", data.sessionId]);
      queryClient.invalidateQueries(["my-evaluations"]);
    },
  });
};

// Learning hooks
export const useLearningContent = (params) => {
  return useQuery({
    queryKey: ["learning-content", params],
    queryFn: () => learningAPI.getContent(params),
    select: (response) => response.data.data,
    enabled: params !== null && params !== undefined,
  });
};

export const useLearningContentById = (id) => {
  return useQuery({
    queryKey: ["learning-content", id],
    queryFn: () => learningAPI.getContentById(id),
    select: (data) => data.data.content,
    enabled: !!id,
  });
};

export const useLearningCategories = () => {
  return useQuery({
    queryKey: ["learning-categories"],
    queryFn: learningAPI.getCategories,
    select: (data) => data.data.categories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateLearningContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: learningAPI.createContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learning-content"] });
      queryClient.invalidateQueries({ queryKey: ["learning-categories"] });
    },
  });
};

export const useUpdateLearningContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => learningAPI.updateContent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learning-content"] });
    },
  });
};

export const useDeleteLearningContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: learningAPI.deleteContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learning-content"] });
    },
  });
};
