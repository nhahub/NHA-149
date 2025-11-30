import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarClock,
  Edit,
  Eye,
  FileText,
  Filter,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  TrendingUp,
  Users,
  Video,
  X,
} from "lucide-react";
import { createElement, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../components/ui/Avatar.jsx";
import { Button } from "../components/ui/Button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card.jsx";
import { ConfirmDialog } from "../components/ui/ConfirmDialog.jsx";
import { CreateEditContentDialog } from "../components/ui/CreateEditContentDialog.jsx";
import { EditUserDialog } from "../components/ui/EditUserDialog.jsx";
import { Input } from "../components/ui/Input.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import { Tabs } from "../components/ui/Tabs.jsx";
import { APP_CONFIG, USER_ROLES } from "../config/app.js";
import {
  useAdminDashboard,
  useAdminReservations,
  useAdminSessions,
  useAdminSlots,
  useApproveInterviewer,
  useCreateLearningContent,
  useDeleteAdminReservation,
  useDeleteAdminSession,
  useDeleteAdminSlot,
  useDeleteLearningContent,
  useDeleteUser,
  useEvaluationBySession,
  useLearningCategories,
  useLearningContent,
  useRejectInterviewer,
  useUpdateLearningContent,
  useUpdateUser,
  useUsers,
} from "../hooks/api.js";
import { useAuth } from "../hooks/useAuth.js";
import { formatDate, formatDateTime, formatTime } from "../utils/helpers.js";

const statusKeyMap = {
  "in-progress": "status.inProgress",
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase() || "TQ";

const isAbsoluteUrl = (url = "") => /^https?:\/\//i.test(url);

const resolveCvUrl = (url) => {
  if (!url) return null;
  if (isAbsoluteUrl(url)) return url;
  let fallbackOrigin = window.location.origin;
  try {
    fallbackOrigin = new URL(APP_CONFIG.apiBaseUrl).origin;
  } catch {
    // ignore, fallback to current origin
  }
  const normalizedPath = url.startsWith("/") ? url : `/${url}`;
  return `${fallbackOrigin}${normalizedPath}`;
};

const calculateTrendChange = (series = []) => {
  if (!series.length) return 0;
  const first = series[0];
  const last = series[series.length - 1];
  if (first === 0) {
    return last === 0 ? 0 : 100;
  }
  return ((last - first) / (first || 1)) * 100;
};

const Sparkline = ({ data = [], stroke = "#0891b2" }) => {
  if (!data.length || data.every((value) => value === 0)) {
    return (
      <div className="flex h-20 items-center justify-center text-xs text-secondary-400">
        —
      </div>
    );
  }

  const maxValue = Math.max(...data, 1);
  const points = data
    .map((value, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * 100;
      const y = 40 - (value / maxValue) * 40;
      return `${x},${y}`;
    })
    .join(" ");

  const lastY = 40 - (data[data.length - 1] / maxValue) * 40;
  const lastX = 100;

  return (
    <svg
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      className="h-20 w-full overflow-visible"
    >
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        points={points}
      />
      <circle cx={lastX} cy={lastY} r="2.5" fill={stroke} />
    </svg>
  );
};

const StatCard = ({ title, value, subtitle, icon, accent, footnote }) => (
  <div className="relative overflow-hidden rounded-2xl border border-secondary-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-secondary-500">{title}</p>
        <p className="text-2xl font-semibold text-secondary-900">{value}</p>
        {subtitle && (
          <p className="mt-1 text-xs text-secondary-500">{subtitle}</p>
        )}
      </div>
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl text-white ${accent}`}
      >
        {icon ? createElement(icon, { className: "h-6 w-6" }) : null}
      </div>
    </div>
    {footnote && (
      <p className="mt-4 text-xs font-medium text-secondary-400">{footnote}</p>
    )}
  </div>
);

const TrendCard = ({
  title,
  value,
  series,
  stroke,
  changeLabel,
  footnote,
  icon,
}) => {
  const change = calculateTrendChange(series);
  const isPositive = change >= 0;

  return (
    <Card className="h-full border border-secondary-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-medium text-secondary-900">
            {title}
          </CardTitle>
          <p className="text-sm text-secondary-500">{changeLabel}</p>
        </div>
        <div className="rounded-xl bg-secondary-50 p-3 text-secondary-600">
          {icon ? createElement(icon, { className: "h-5 w-5" }) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-3xl font-semibold text-secondary-900">{value}</p>
        <div className="flex items-center gap-2 text-sm font-medium">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
              isPositive
                ? "bg-emerald-50 text-emerald-600"
                : "bg-rose-50 text-rose-600"
            }`}
          >
            {isPositive ? "+" : ""}
            {Number.isFinite(change) ? change.toFixed(1) : "0"}%
          </span>
          <span className="text-secondary-500">/</span>
          <span className="text-secondary-600">{changeLabel}</span>
        </div>
        <Sparkline data={series} stroke={stroke} />
        {footnote && <p className="text-xs text-secondary-400">{footnote}</p>}
      </CardContent>
    </Card>
  );
};

const StatusBadge = ({ status, label }) => {
  const statusStyles = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-rose-50 text-rose-700 border-rose-200",
    scheduled: "bg-blue-50 text-blue-700 border-blue-200",
    "in-progress": "bg-cyan-50 text-cyan-700 border-cyan-200",
    completed: "bg-slate-100 text-slate-700 border-slate-200",
    cancelled: "bg-gray-100 text-gray-600 border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        statusStyles[status] || "bg-secondary-100 text-secondary-700"
      }`}
    >
      {label}
    </span>
  );
};

export default function AdminPage() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const { data, isLoading, isError, error } = useAdminDashboard();
  const approveInterviewer = useApproveInterviewer();
  const rejectInterviewer = useRejectInterviewer();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const deleteAdminReservation = useDeleteAdminReservation();
  const deleteAdminSlot = useDeleteAdminSlot();
  const deleteAdminSession = useDeleteAdminSession();
  const [actioning, setActioning] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);

  // Search and filter state for users
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [approvalFilter, setApprovalFilter] = useState("");

  // Search and filter state for reservations & slots
  const [reservationSearch, setReservationSearch] = useState("");
  const [debouncedReservationSearch, setDebouncedReservationSearch] =
    useState("");
  const [reservationStatusFilter, setReservationStatusFilter] = useState("");
  const [reservationDateFrom, setReservationDateFrom] = useState("");
  const [reservationDateTo, setReservationDateTo] = useState("");

  const [slotSearch, setSlotSearch] = useState("");
  const [debouncedSlotSearch, setDebouncedSlotSearch] = useState("");
  const [slotStatusFilter, setSlotStatusFilter] = useState("");
  const [slotDateFrom, setSlotDateFrom] = useState("");
  const [slotDateTo, setSlotDateTo] = useState("");

  // Search and filter state for sessions
  const [sessionSearch, setSessionSearch] = useState("");
  const [debouncedSessionSearch, setDebouncedSessionSearch] = useState("");
  const [sessionStatusFilter, setSessionStatusFilter] = useState("");
  const [sessionDateFrom, setSessionDateFrom] = useState("");
  const [sessionDateTo, setSessionDateTo] = useState("");

  // Content learning state
  const [contentSearch, setContentSearch] = useState("");
  const [debouncedContentSearch, setDebouncedContentSearch] = useState("");
  const [contentTypeFilter, setContentTypeFilter] = useState("");
  const [contentCategoryFilter, setContentCategoryFilter] = useState("");
  const [contentPublishedFilter, setContentPublishedFilter] = useState("");
  const [contentToEdit, setContentToEdit] = useState(null);
  const [contentToDelete, setContentToDelete] = useState(null);
  const [isCreateContentOpen, setIsCreateContentOpen] = useState(false);

  // Delete state
  const [reservationToDelete, setReservationToDelete] = useState(null);
  const [slotToDelete, setSlotToDelete] = useState(null);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [sessionToViewEvaluation, setSessionToViewEvaluation] = useState(null);

  // Debounce search queries
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedReservationSearch(reservationSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [reservationSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSlotSearch(slotSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [slotSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedContentSearch(contentSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [contentSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSessionSearch(sessionSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [sessionSearch]);

  // Build filter params
  const userFilterParams = useMemo(() => {
    const params = {
      page: 1,
      limit: 100, // Get all users for admin view
    };

    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    if (roleFilter) {
      params.role = roleFilter;
    }

    if (statusFilter !== "") {
      params.isActive = statusFilter === "active";
    }

    // Note: Approval filter is handled client-side since the API might not support it
    // We'll filter the results after fetching

    return params;
  }, [debouncedSearch, roleFilter, statusFilter]);

  // Build filter params for reservations & slots
  const reservationFilterParams = useMemo(() => {
    const params = { page: 1, limit: 100 };
    if (debouncedReservationSearch) params.search = debouncedReservationSearch;
    if (reservationStatusFilter) params.status = reservationStatusFilter;
    if (reservationDateFrom) params.startDate = reservationDateFrom;
    if (reservationDateTo) params.endDate = reservationDateTo;
    return params;
  }, [
    debouncedReservationSearch,
    reservationStatusFilter,
    reservationDateFrom,
    reservationDateTo,
  ]);

  const slotFilterParams = useMemo(() => {
    const params = { page: 1, limit: 100 };
    if (debouncedSlotSearch) params.search = debouncedSlotSearch;
    if (slotStatusFilter) params.status = slotStatusFilter;
    if (slotDateFrom) params.startDate = slotDateFrom;
    if (slotDateTo) params.endDate = slotDateTo;
    return params;
  }, [debouncedSlotSearch, slotStatusFilter, slotDateFrom, slotDateTo]);

  const sessionFilterParams = useMemo(() => {
    const params = { page: 1, limit: 100 };
    if (debouncedSessionSearch) params.search = debouncedSessionSearch;
    if (sessionStatusFilter) params.status = sessionStatusFilter;
    if (sessionDateFrom) params.startDate = sessionDateFrom;
    if (sessionDateTo) params.endDate = sessionDateTo;
    return params;
  }, [
    debouncedSessionSearch,
    sessionStatusFilter,
    sessionDateFrom,
    sessionDateTo,
  ]);

  // Build filter params for content
  const contentFilterParams = useMemo(() => {
    const params = { page: 1, limit: 100 };
    if (debouncedContentSearch) params.search = debouncedContentSearch;
    if (contentTypeFilter) params.type = contentTypeFilter;
    if (contentCategoryFilter) params.category = contentCategoryFilter;
    // For admin, show all content (published and unpublished)
    // Remove isPublished filter to show all
    return params;
  }, [debouncedContentSearch, contentTypeFilter, contentCategoryFilter]);

  // Fetch data for tabs
  const {
    data: usersData,
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = useUsers(userFilterParams);
  const { data: contentData, isLoading: contentLoading } =
    useLearningContent(contentFilterParams);
  const { data: adminReservationsData, isLoading: adminReservationsLoading } =
    useAdminReservations(reservationFilterParams);
  const { data: adminSlotsData, isLoading: adminSlotsLoading } =
    useAdminSlots(slotFilterParams);
  const { data: adminSessionsData, isLoading: adminSessionsLoading } =
    useAdminSessions(sessionFilterParams);
  const { data: categories = [] } = useLearningCategories();

  // Mutations
  const createContentMutation = useCreateLearningContent();
  const updateContentMutation = useUpdateLearningContent();
  const deleteContentMutation = useDeleteLearningContent();

  // Filter by approval status client-side
  const allUsers = useMemo(() => {
    const allUsersRaw = usersData?.users || [];
    if (approvalFilter === "") return allUsersRaw;
    if (approvalFilter === "approved") {
      return allUsersRaw.filter(
        (u) => u.role !== "interviewer" || u.isApproved === true
      );
    }
    if (approvalFilter === "pending") {
      return allUsersRaw.filter(
        (u) => u.role === "interviewer" && u.isApproved === false
      );
    }
    return allUsersRaw;
  }, [usersData?.users, approvalFilter]);
  const allContentRaw = contentData?.content || [];
  // Filter by published status if needed
  const allContent =
    contentPublishedFilter === ""
      ? allContentRaw
      : allContentRaw.filter((c) =>
          contentPublishedFilter === "published"
            ? c.isPublished
            : !c.isPublished
        );
  const adminReservations = adminReservationsData?.reservations || [];
  const adminSlots = adminSlotsData?.slots || [];
  const adminSessions = adminSessionsData?.sessions || [];

  const isRTL = i18n.language === "ar";
  const locale = i18n.language === "ar" ? "ar-EG" : "en-US";

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(locale),
    [locale]
  );

  const stats = data?.stats || {};
  const trends = data?.trends || { labels: [], users: [], reservations: [] };
  const pendingInterviewers = data?.pendingInterviewers || [];
  const recent = data?.recent || {
    users: [],
    reservations: [],
    sessions: [],
  };
  const system = data?.system;

  const formatNumber = (value = 0) => numberFormatter.format(value);

  const uptimeLabel = (() => {
    if (!system?.uptimeSeconds && system?.uptimeSeconds !== 0) return "--";
    const hours = Math.floor(system.uptimeSeconds / 3600);
    const minutes = Math.floor((system.uptimeSeconds % 3600) / 60);
    return t("admin.system.uptimeValue", { hours, minutes });
  })();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== USER_ROLES.ADMIN) {
    return <Navigate to="/dashboard" replace />;
  }

  const statCards = [
    {
      key: "users",
      title: t("admin.stats.totalUsers"),
      value: formatNumber(stats.users?.total || 0),
      subtitle: t("admin.stats.activeUsers", {
        count: formatNumber(stats.users?.active || 0),
      }),
      footnote: `${formatNumber(stats.users?.pendingInterviewers || 0)} ${t(
        "admin.stats.pendingInterviewers"
      )}`,
      icon: Users,
      accent: "bg-gradient-to-br from-cyan-500 to-blue-600",
    },
    {
      key: "reservations",
      title: t("admin.stats.reservations"),
      value: formatNumber(stats.reservations?.total || 0),
      subtitle: t("admin.stats.pendingReservations", {
        count: formatNumber(stats.reservations?.pending || 0),
      }),
      footnote: `${t("status.accepted")}: ${formatNumber(
        stats.reservations?.accepted || 0
      )} / ${t("status.rejected")}: ${formatNumber(
        stats.reservations?.rejected || 0
      )}`,
      icon: CalendarClock,
      accent: "bg-gradient-to-br from-emerald-500 to-lime-500",
    },
    {
      key: "sessions",
      title: t("admin.stats.sessions"),
      value: formatNumber(stats.sessions?.total || 0),
      subtitle: t("admin.stats.upcomingSessions", {
        count: formatNumber(stats.sessions?.upcoming || 0),
      }),
      footnote: `${t("status.completed")}: ${formatNumber(
        stats.sessions?.completed || 0
      )}`,
      icon: Video,
      accent: "bg-gradient-to-br from-fuchsia-500 to-purple-500",
    },
    {
      key: "content",
      title: t("admin.stats.content"),
      value: formatNumber(stats.content?.total || 0),
      subtitle: t("admin.stats.publishedContent", {
        count: formatNumber(stats.content?.published || 0),
      }),
      footnote: `${t("admin.stats.slots", {
        defaultValue: "Slots",
      })}: ${formatNumber(stats.slots?.total || 0)}`,
      icon: BookOpen,
      accent: "bg-gradient-to-br from-amber-500 to-orange-500",
    },
    {
      key: "evaluations",
      title: t("admin.stats.evaluations"),
      value: stats.evaluations?.averageScore
        ? stats.evaluations.averageScore.toFixed(1)
        : "0.0",
      subtitle: t("admin.stats.avgScore"),
      footnote: `${formatNumber(stats.evaluations?.total || 0)} ${t(
        "admin.stats.records",
        { defaultValue: "records" }
      )}`,
      icon: ShieldCheck,
      accent: "bg-gradient-to-br from-slate-500 to-gray-600",
    },
  ];

  const handleApprove = async (id) => {
    setActioning({ id, type: "approve" });
    try {
      await approveInterviewer.mutateAsync(id);
      toast.success(t("admin.approveSuccess"));
    } catch (mutationError) {
      toast.error(mutationError.response?.data?.message || t("common.error"));
    } finally {
      setActioning(null);
    }
  };

  const handleReject = async (id) => {
    setActioning({ id, type: "reject" });
    try {
      await rejectInterviewer.mutateAsync(id);
      toast.success(t("admin.rejectSuccess"));
    } catch (mutationError) {
      toast.error(mutationError.response?.data?.message || t("common.error"));
    } finally {
      setActioning(null);
    }
  };

  const handleDeleteUser = async (id) => {
    setActioning({ id, type: "delete" });
    try {
      await deleteUser.mutateAsync(id);
      toast.success(
        t("admin.deleteUserSuccess", {
          defaultValue: "User deleted successfully",
        })
      );
      setUserToDelete(null);
      // Refetch users to get updated list
      await refetchUsers();
    } catch (mutationError) {
      toast.error(mutationError.response?.data?.message || t("common.error"));
    } finally {
      setActioning(null);
    }
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    await handleDeleteUser(userToDelete.id);
  };

  const cancelDeleteUser = () => {
    setUserToDelete(null);
  };

  const handleUpdateUser = async (data) => {
    if (!userToEdit) return;

    setActioning({ id: userToEdit.id, type: "edit" });
    try {
      await updateUser.mutateAsync({
        id: userToEdit.id,
        data,
      });
      toast.success(
        t("admin.updateUserSuccess", {
          defaultValue: "User updated successfully",
        })
      );
      setUserToEdit(null);
      await refetchUsers();
    } catch (mutationError) {
      toast.error(mutationError.response?.data?.message || t("common.error"));
    } finally {
      setActioning(null);
    }
  };

  const cancelEditUser = () => {
    setUserToEdit(null);
  };

  const handleDeleteReservation = async (id) => {
    setActioning({ id, type: "deleteReservation" });
    try {
      await deleteAdminReservation.mutateAsync(id);
      toast.success(
        t("admin.deleteReservationSuccess", {
          defaultValue: "Reservation deleted successfully",
        })
      );
      setReservationToDelete(null);
    } catch (mutationError) {
      toast.error(mutationError.response?.data?.message || t("common.error"));
    } finally {
      setActioning(null);
    }
  };

  const handleDeleteSlot = async (id) => {
    setActioning({ id, type: "deleteSlot" });
    try {
      await deleteAdminSlot.mutateAsync(id);
      toast.success(
        t("admin.deleteSlotSuccess", {
          defaultValue: "Slot deleted successfully",
        })
      );
      setSlotToDelete(null);
    } catch (mutationError) {
      toast.error(mutationError.response?.data?.message || t("common.error"));
    } finally {
      setActioning(null);
    }
  };

  const handleDeleteSession = async (id) => {
    setActioning({ id, type: "deleteSession" });
    try {
      await deleteAdminSession.mutateAsync(id);
      toast.success(
        t("admin.deleteSessionSuccess", {
          defaultValue: "Session deleted successfully",
        })
      );
      setSessionToDelete(null);
    } catch (mutationError) {
      toast.error(mutationError.response?.data?.message || t("common.error"));
    } finally {
      setActioning(null);
    }
  };

  const confirmDeleteReservation = async () => {
    if (!reservationToDelete) return;
    await handleDeleteReservation(reservationToDelete.id);
  };

  const confirmDeleteSlot = async () => {
    if (!slotToDelete) return;
    await handleDeleteSlot(slotToDelete.id);
  };

  const confirmDeleteSession = async () => {
    if (!sessionToDelete) return;
    await handleDeleteSession(sessionToDelete.id);
  };

  // Content handlers
  const handleCreateContent = async (formData) => {
    try {
      await createContentMutation.mutateAsync(formData);
      toast.success(
        t("admin.createContentSuccess", {
          defaultValue: "Content created successfully",
        })
      );
      setIsCreateContentOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || t("common.error"));
    }
  };

  const handleUpdateContent = async (formData) => {
    if (!contentToEdit) return;
    try {
      await updateContentMutation.mutateAsync({
        id: contentToEdit._id || contentToEdit.id,
        data: formData,
      });
      toast.success(
        t("admin.updateContentSuccess", {
          defaultValue: "Content updated successfully",
        })
      );
      setContentToEdit(null);
    } catch (error) {
      toast.error(error.response?.data?.message || t("common.error"));
    }
  };

  const handleDeleteContent = async (id) => {
    try {
      await deleteContentMutation.mutateAsync(id);
      toast.success(
        t("admin.deleteContentSuccess", {
          defaultValue: "Content deleted successfully",
        })
      );
      setContentToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.message || t("common.error"));
    }
  };

  const confirmDeleteContent = async () => {
    if (!contentToDelete) return;
    await handleDeleteContent(contentToDelete.id);
  };

  const renderPendingInterviewers = () => {
    if (!pendingInterviewers.length) {
      return (
        <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/60 p-6 text-center text-sm font-medium text-emerald-700">
          {t("admin.pendingSection.empty")}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {pendingInterviewers.map((candidate) => {
          const specializationLabel = candidate.specialization
            ? t(`specializations.${candidate.specialization}`, {
                defaultValue: candidate.specialization,
              })
            : "";
          const yearsOfExperience = candidate.yearsOfExperience ?? 0;
          const cvHref = resolveCvUrl(candidate.cvUrl);
          const isApproveLoading =
            actioning?.id === candidate.id && actioning?.type === "approve";
          const isRejectLoading =
            actioning?.id === candidate.id && actioning?.type === "reject";

          return (
            <div
              key={candidate.id}
              className="flex flex-col gap-4 rounded-2xl border border-secondary-200 p-4 shadow-sm transition hover:border-primary-200 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  {candidate.avatarUrl ? (
                    <AvatarImage
                      src={candidate.avatarUrl}
                      alt={candidate.name}
                    />
                  ) : (
                    <AvatarFallback>
                      {getInitials(candidate.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-secondary-900">
                    {candidate.name}
                  </p>
                  <p className="text-xs text-secondary-500">
                    {candidate.email}
                  </p>
                  <p className="text-xs text-secondary-500">
                    {specializationLabel} · {yearsOfExperience}{" "}
                    {t("common.years")}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {cvHref && (
                  <a
                    href={cvHref}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-cyan-600 underline-offset-4 hover:underline"
                  >
                    {t("admin.pendingSection.cv")}
                  </a>
                )}
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleApprove(candidate.id)}
                  disabled={isApproveLoading}
                >
                  {isApproveLoading
                    ? t("common.loading")
                    : t("admin.actions.approve")}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleReject(candidate.id)}
                  disabled={isRejectLoading}
                >
                  {isRejectLoading
                    ? t("common.loading")
                    : t("admin.actions.reject")}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderRecentList = (items, emptyLabel, renderItem) => {
    if (!items.length) {
      return typeof emptyLabel === "string" ? (
        <p className="text-sm text-secondary-500">{emptyLabel}</p>
      ) : (
        emptyLabel
      );
    }
    return <div className="space-y-4">{items.map(renderItem)}</div>;
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-animated py-8 ${isRTL ? "rtl" : "ltr"}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <PageHeader
            title={t("admin.dashboardTitle")}
            subtitle={t("admin.subtitle")}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-32 rounded-2xl bg-white/70 shadow-sm animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">
          <AlertTriangle className="mx-auto h-10 w-10 text-red-500" />
          <p className="mt-4 text-base font-semibold text-secondary-900">
            {t("errors.serverError")}
          </p>
          <p className="mt-2 text-sm text-secondary-500">
            {error?.message || t("common.error")}
          </p>
        </div>
      </div>
    );
  }

  // Render dashboard tab content
  const renderDashboardTab = () => (
    <div className="space-y-8">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {statCards.map((card) => {
          const { key, ...cardProps } = card;
          return <StatCard key={key} {...cardProps} />;
        })}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <TrendCard
              title={t("admin.trends.users")}
              value={formatNumber(
                (trends.users || []).reduce((sum, value) => sum + value, 0)
              )}
              series={trends.users || []}
              stroke="#0891b2"
              changeLabel={t("admin.trends.vsLastWeek")}
              footnote={t("admin.trends.lastDays", {
                count: trends.labels?.length || 0,
              })}
              icon={TrendingUp}
            />
            <TrendCard
              title={t("admin.trends.reservations")}
              value={formatNumber(
                (trends.reservations || []).reduce(
                  (sum, value) => sum + value,
                  0
                )
              )}
              series={trends.reservations || []}
              stroke="#a855f7"
              changeLabel={t("admin.trends.vsLastWeek")}
              footnote={t("admin.trends.lastDays", {
                count: trends.labels?.length || 0,
              })}
              icon={Activity}
            />
          </div>

          <Card className="border border-secondary-200 shadow-sm">
            <CardHeader>
              <CardTitle>{t("admin.pendingSection.title")}</CardTitle>
              <CardDescription>
                {t("admin.pendingSection.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>{renderPendingInterviewers()}</CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border border-secondary-200 shadow-sm">
            <CardHeader>
              <CardTitle>{t("admin.system.title")}</CardTitle>
              <CardDescription>
                {t("admin.quickActionsDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-secondary-600">
              <div className="rounded-2xl border border-secondary-200 bg-secondary-50/60 p-4">
                <p className="text-xs uppercase tracking-wide text-secondary-500">
                  {t("admin.system.uptime")}
                </p>
                <p className="text-lg font-semibold text-secondary-900">
                  {uptimeLabel}
                </p>
                {system?.lastUpdated && (
                  <p className="text-xs text-secondary-500">
                    {t("admin.system.lastUpdated")}:{" "}
                    {formatDateTime(system.lastUpdated, locale)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border border-secondary-200 shadow-sm">
          <CardHeader>
            <CardTitle>{t("admin.recentActivity.title")}</CardTitle>
            <CardDescription>
              {t("admin.recentActivity.subtitle", {
                defaultValue: t("admin.overview", { defaultValue: "" }),
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-secondary-900">
                  {t("admin.recentActivity.newUsers")}
                </p>
                <span className="text-xs text-secondary-500">
                  {formatNumber(recent.users?.length || 0)}
                </span>
              </div>
              {renderRecentList(
                recent.users || [],
                t("admin.recentActivity.empty"),
                (item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        {item.avatarUrl ? (
                          <AvatarImage src={item.avatarUrl} alt={item.name} />
                        ) : (
                          <AvatarFallback>
                            {getInitials(item.name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-secondary-900">
                          {item.name}
                        </p>
                        <p className="text-xs text-secondary-500">
                          {t(`roles.${item.role}`, {
                            defaultValue: item.role,
                          })}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-secondary-400">
                      {formatDate(item.createdAt, locale)}
                    </span>
                  </div>
                )
              )}
            </div>

            <div className="border-t border-dashed border-secondary-200 pt-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-secondary-900">
                  {t("admin.recentActivity.reservations")}
                </p>
                <span className="text-xs text-secondary-500">
                  {formatNumber(recent.reservations?.length || 0)}
                </span>
              </div>
              {renderRecentList(
                recent.reservations || [],
                t("admin.recentActivity.empty"),
                (reservation) => {
                  const statusKey =
                    statusKeyMap[reservation.status] ||
                    `status.${reservation.status}`;
                  return (
                    <div
                      key={reservation.id}
                      className="flex flex-col gap-2 rounded-2xl border border-secondary-100 bg-secondary-50/40 p-3 text-sm text-secondary-700"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-semibold text-secondary-900">
                          <span>{reservation.candidate?.name}</span>
                          {isRTL ? (
                            <ArrowLeft className="w-5 h-5 text-primary-500 flex-shrink-0" />
                          ) : (
                            <ArrowRight className="w-5 h-5 text-primary-500 flex-shrink-0" />
                          )}
                          <span>{reservation.interviewer?.name}</span>
                        </div>
                        <StatusBadge
                          status={reservation.status}
                          label={t(statusKey, {
                            defaultValue: reservation.status,
                          })}
                        />
                      </div>
                      {reservation.slot && (
                        <p className="text-xs text-secondary-500">
                          {formatDate(reservation.slot.date, locale)} ·{" "}
                          {formatTime(reservation.slot.startTime)} -{" "}
                          {formatTime(reservation.slot.endTime)}
                        </p>
                      )}
                      {reservation.status === "rejected" &&
                        reservation.rejectionReason && (
                          <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
                            <p className="text-xs text-red-700">
                              <span className="font-medium">
                                {t("reservations.rejectionReason", {
                                  defaultValue: "Rejection Reason",
                                })}
                                :
                              </span>{" "}
                              {reservation.rejectionReason}
                            </p>
                          </div>
                        )}
                    </div>
                  );
                }
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-secondary-200 shadow-sm">
          <CardHeader>
            <CardTitle>{t("admin.recentActivity.sessions")}</CardTitle>
            <CardDescription>
              {t("admin.recentActivity.description", {
                defaultValue: t("admin.overview", { defaultValue: "" }),
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderRecentList(
              recent.sessions || [],
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CalendarClock className="h-12 w-12 text-secondary-300 mb-3" />
                <p className="text-sm font-medium text-secondary-500">
                  {t("admin.recentActivity.empty")}
                </p>
              </div>,
              (session) => {
                const labelKey =
                  statusKeyMap[session.status] || `status.${session.status}`;
                return (
                  <div
                    key={session.id}
                    className="flex flex-col gap-3 rounded-2xl border border-secondary-100 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-secondary-900">
                          {session.candidate?.name}
                        </p>
                        <p className="text-xs text-secondary-500">
                          {session.interviewer?.name}
                        </p>
                      </div>
                      <StatusBadge
                        status={session.status}
                        label={t(labelKey, {
                          defaultValue: session.status,
                        })}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-secondary-500">
                      <CalendarClock className="h-4 w-4 text-cyan-600" />
                      <span>
                        {formatDate(session.date, locale)} ·{" "}
                        {formatTime(session.startTime)} -{" "}
                        {formatTime(session.endTime)}
                      </span>
                    </div>
                  </div>
                );
              }
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setRoleFilter("");
    setStatusFilter("");
    setApprovalFilter("");
  };

  const hasActiveFilters =
    searchQuery || roleFilter || statusFilter !== "" || approvalFilter !== "";

  // Render users tab content
  const renderUsersTab = () => (
    <div className="space-y-6">
      <Card className="border border-secondary-200 shadow-sm">
        <CardHeader>
          <CardTitle>
            {t("admin.users", { defaultValue: "All Users" })}
          </CardTitle>
          <CardDescription>
            {t("admin.usersDescription", {
              defaultValue: "Manage user accounts and permissions",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
              <Input
                type="text"
                placeholder={t("admin.searchUsers", {
                  defaultValue: "Search by name or email...",
                })}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
                variant="modern"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-secondary-500" />
                <span className="text-sm font-medium text-secondary-700">
                  {t("common.filter", { defaultValue: "Filters" })}:
                </span>
              </div>

              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="h-10 px-4 text-sm border-2 border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all bg-white"
              >
                <option value="">
                  {t("admin.allRoles", { defaultValue: "All Roles" })}
                </option>
                <option value={USER_ROLES.CANDIDATE}>
                  {t(`roles.${USER_ROLES.CANDIDATE}`)}
                </option>
                <option value={USER_ROLES.INTERVIEWER}>
                  {t(`roles.${USER_ROLES.INTERVIEWER}`)}
                </option>
                <option value={USER_ROLES.ADMIN}>
                  {t(`roles.${USER_ROLES.ADMIN}`)}
                </option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-4 text-sm border-2 border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all bg-white"
              >
                <option value="">
                  {t("admin.allStatuses", { defaultValue: "All Statuses" })}
                </option>
                <option value="active">{t("common.active")}</option>
                <option value="inactive">{t("common.inactive")}</option>
              </select>

              {/* Approval Status Filter (for interviewers) */}
              <select
                value={approvalFilter}
                onChange={(e) => setApprovalFilter(e.target.value)}
                className="h-10 px-4 text-sm border-2 border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all bg-white"
              >
                <option value="">
                  {t("admin.allApprovalStatuses", {
                    defaultValue: "All Approval Statuses",
                  })}
                </option>
                <option value="approved">
                  {t("admin.approved", { defaultValue: "Approved" })}
                </option>
                <option value="pending">
                  {t("admin.pendingApproval", {
                    defaultValue: "Pending Approval",
                  })}
                </option>
              </select>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-secondary-600 hover:text-secondary-900"
                >
                  <X className="h-4 w-4 mr-1" />
                  {t("admin.clearFilters", { defaultValue: "Clear Filters" })}
                </Button>
              )}
            </div>

            {/* Active Filters Info */}
            {hasActiveFilters && (
              <div className="text-xs text-secondary-500">
                {t("admin.showingResults", {
                  defaultValue: "Showing {{count}} users",
                  count: allUsers.length,
                })}
              </div>
            )}
          </div>

          {usersLoading ? (
            <div className="text-center py-8">
              <p className="text-sm text-secondary-500">
                {t("common.loading")}
              </p>
            </div>
          ) : allUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-secondary-500">
                {hasActiveFilters
                  ? t("admin.noUsersFound", {
                      defaultValue: "No users found matching your filters",
                    })
                  : t("admin.recentActivity.empty")}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {allUsers.map((userItem) => {
                const userId = userItem._id || userItem.id;
                const currentUserId = user?._id || user?.id;
                return (
                  <div
                    key={userId}
                    className={`flex items-center justify-between gap-4 rounded-2xl border p-4 transition-colors ${
                      userItem.role === USER_ROLES.INTERVIEWER &&
                      !userItem.isApproved
                        ? "border-amber-300 bg-amber-50/30 hover:border-amber-400"
                        : "border-secondary-200 hover:border-primary-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        {userItem.avatarUrl ? (
                          <AvatarImage
                            src={userItem.avatarUrl}
                            alt={userItem.name}
                          />
                        ) : (
                          <AvatarFallback>
                            {getInitials(userItem.name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-secondary-900">
                          {userItem.name}
                        </p>
                        <p className="text-xs text-secondary-500">
                          {userItem.email}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <StatusBadge
                            status={userItem.role}
                            label={t(`roles.${userItem.role}`, {
                              defaultValue: userItem.role,
                            })}
                          />
                          {userItem.role === USER_ROLES.INTERVIEWER && (
                            <StatusBadge
                              status={
                                userItem.isApproved ? "accepted" : "pending"
                              }
                              label={
                                userItem.isApproved
                                  ? t("admin.approved", {
                                      defaultValue: "Approved",
                                    })
                                  : t("admin.pendingApproval", {
                                      defaultValue: "Pending Approval",
                                    })
                              }
                            />
                          )}
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                              userItem.isActive !== false
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}
                          >
                            {userItem.isActive !== false
                              ? t("common.active")
                              : t("common.inactive")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-secondary-400">
                        {formatDate(userItem.createdAt, locale)}
                      </span>
                      <div className="flex items-center gap-2">
                        {userItem.role === USER_ROLES.INTERVIEWER &&
                          userItem.cvUrl && (
                            <a
                              href={resolveCvUrl(userItem.cvUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-600 bg-cyan-50 border border-cyan-200 rounded-lg hover:bg-cyan-100 hover:border-cyan-300 transition-colors"
                              title={t("admin.viewCV", {
                                defaultValue: "View CV",
                              })}
                            >
                              <FileText className="h-3.5 w-3.5" />
                              {t("admin.cv", { defaultValue: "CV" })}
                            </a>
                          )}
                        {userId !== currentUserId && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setUserToEdit({ id: userId, ...userItem });
                            }}
                            disabled={
                              updateUser.isPending ||
                              (actioning?.id === userId &&
                                actioning?.type === "edit")
                            }
                          >
                            {t("common.edit", { defaultValue: "Edit" })}
                          </Button>
                        )}
                        {userItem.role !== "admin" &&
                          userId !== currentUserId && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setUserToDelete({
                                  id: userId,
                                  name: userItem.name,
                                });
                              }}
                              disabled={
                                deleteUser.isPending ||
                                (actioning?.id === userId &&
                                  actioning?.type === "delete")
                              }
                            >
                              {deleteUser.isPending &&
                              actioning?.id === userId &&
                              actioning?.type === "delete"
                                ? t("common.loading")
                                : t("admin.deleteUser", {
                                    defaultValue: "Delete",
                                  })}
                            </Button>
                          )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // Render content learning tab
  const renderContentTab = () => (
    <div className="space-y-6">
      <Card className="border border-secondary-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {t("admin.content", { defaultValue: "Learning Content" })}
              </CardTitle>
              <CardDescription>
                {t("admin.contentDescription", {
                  defaultValue: "Manage learning content and articles",
                })}
              </CardDescription>
            </div>
            <Button
              onClick={() => setIsCreateContentOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {t("admin.createContent", { defaultValue: "Create Content" })}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
              <Input
                type="text"
                placeholder={t("admin.searchContent", {
                  defaultValue: "Search content...",
                })}
                value={contentSearch}
                onChange={(e) => setContentSearch(e.target.value)}
                className="pl-10 pr-10"
                variant="modern"
              />
              {contentSearch && (
                <button
                  onClick={() => setContentSearch("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-secondary-500" />
                <span className="text-sm font-medium text-secondary-700">
                  {t("common.filter")}:
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-secondary-600">
                    {t("admin.contentType", { defaultValue: "Type" })}
                  </label>
                  <select
                    value={contentTypeFilter}
                    onChange={(e) => setContentTypeFilter(e.target.value)}
                    className="h-10 px-4 text-sm border-2 border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all bg-white"
                  >
                    <option value="">
                      {t("admin.allTypes", { defaultValue: "All Types" })}
                    </option>
                    <option value="faq">
                      {t("learning.faqs", { defaultValue: "FAQ" })}
                    </option>
                    <option value="tip">
                      {t("learning.tips", { defaultValue: "Tip" })}
                    </option>
                    <option value="article">
                      {t("learning.articles", { defaultValue: "Article" })}
                    </option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-secondary-600">
                    {t("learning.categories", { defaultValue: "Category" })}
                  </label>
                  <select
                    value={contentCategoryFilter}
                    onChange={(e) => setContentCategoryFilter(e.target.value)}
                    className="h-10 px-4 text-sm border-2 border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all bg-white"
                  >
                    <option value="">
                      {t("learning.allCategories", {
                        defaultValue: "All Categories",
                      })}
                    </option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {t(`categories.${cat}`, { defaultValue: cat })}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-secondary-600">
                    {t("common.status", { defaultValue: "Status" })}
                  </label>
                  <select
                    value={contentPublishedFilter}
                    onChange={(e) => setContentPublishedFilter(e.target.value)}
                    className="h-10 px-4 text-sm border-2 border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all bg-white"
                  >
                    <option value="">
                      {t("admin.allStatuses", { defaultValue: "All Statuses" })}
                    </option>
                    <option value="published">
                      {t("status.accepted", { defaultValue: "Published" })}
                    </option>
                    <option value="draft">
                      {t("status.pending", { defaultValue: "Draft" })}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {contentLoading ? (
            <div className="text-center py-8">
              <p className="text-sm text-secondary-500">
                {t("common.loading")}
              </p>
            </div>
          ) : allContent.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-secondary-500">
                {t("admin.recentActivity.empty")}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {allContent.map((item) => {
                const currentLocale = i18n.language;
                // Handle title as object {en, ar} or string
                let title = "Untitled";
                if (typeof item.title === "string") {
                  title = item.title;
                } else if (item.title) {
                  title =
                    item.title[currentLocale] ||
                    item.title.en ||
                    item.title.ar ||
                    "Untitled";
                }
                const contentType = item.type || "unknown";
                return (
                  <div
                    key={item._id || item.id}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-secondary-200 p-4 hover:border-primary-200 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-full font-medium">
                          {contentType === "faq"
                            ? t("learning.faqs", { defaultValue: "FAQ" })
                            : contentType === "tip"
                            ? t("learning.tips", { defaultValue: "Tip" })
                            : t("learning.articles", {
                                defaultValue: "Article",
                              })}
                        </span>
                        {item.featured && (
                          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">
                            {t("admin.contentFeatured", {
                              defaultValue: "Featured",
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-secondary-900">
                        {title}
                      </p>
                      <p className="text-xs text-secondary-500 mt-1">
                        {t(`categories.${item.category}`, {
                          defaultValue: item.category,
                        })}
                      </p>
                      {item.thumbnailUrl && (
                        <img
                          src={item.thumbnailUrl}
                          alt={title}
                          className="mt-2 w-24 h-16 object-cover rounded-lg border border-secondary-200"
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge
                        status={item.isPublished ? "accepted" : "pending"}
                        label={
                          item.isPublished
                            ? t("status.accepted")
                            : t("status.pending")
                        }
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setContentToEdit(item)}
                        disabled={
                          createContentMutation.isPending ||
                          updateContentMutation.isPending ||
                          deleteContentMutation.isPending
                        }
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          setContentToDelete({ id: item._id || item.id, title })
                        }
                        disabled={
                          createContentMutation.isPending ||
                          updateContentMutation.isPending ||
                          deleteContentMutation.isPending
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <CreateEditContentDialog
        isOpen={isCreateContentOpen || !!contentToEdit}
        onClose={() => {
          setIsCreateContentOpen(false);
          setContentToEdit(null);
        }}
        onSave={contentToEdit ? handleUpdateContent : handleCreateContent}
        content={contentToEdit}
        isLoading={
          createContentMutation.isPending || updateContentMutation.isPending
        }
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!contentToDelete}
        onClose={() => setContentToDelete(null)}
        onConfirm={confirmDeleteContent}
        title={t("admin.deleteContentConfirmTitle", {
          defaultValue: "Delete Content",
        })}
        message={t("admin.deleteContentConfirm", {
          defaultValue:
            "Are you sure you want to delete this content? This action cannot be undone.",
          title: contentToDelete?.title || "",
        })}
        confirmLabel={t("common.delete")}
        cancelLabel={t("common.cancel")}
        loadingLabel={t("common.deleting", { defaultValue: "Deleting..." })}
        isLoading={deleteContentMutation.isPending}
      />
    </div>
  );

  // Render Sessions tab
  const renderSessionsTab = () => (
    <div className="space-y-6">
      <Card className="border border-secondary-200 shadow-sm">
        <CardHeader>
          <CardTitle>
            {t("admin.sessions", { defaultValue: "All Sessions" })}
          </CardTitle>
          <CardDescription>
            {t("admin.sessionsDescription", {
              defaultValue: "View and manage all interview sessions",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
              <Input
                type="text"
                placeholder={t("admin.searchSessions", {
                  defaultValue: "Search by candidate or interviewer name...",
                })}
                value={sessionSearch}
                onChange={(e) => setSessionSearch(e.target.value)}
                className="pl-10 pr-10"
                variant="modern"
              />
              {sessionSearch && (
                <button
                  onClick={() => setSessionSearch("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-secondary-500" />
                <span className="text-sm font-medium text-secondary-700">
                  {t("common.filter")}:
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-secondary-600">
                    {t("common.status", { defaultValue: "Status" })}
                  </label>
                  <select
                    value={sessionStatusFilter}
                    onChange={(e) => setSessionStatusFilter(e.target.value)}
                    className="h-10 px-4 text-sm border-2 border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all bg-white"
                  >
                    <option value="">{t("admin.allStatuses")}</option>
                    <option value="scheduled">{t("status.scheduled")}</option>
                    <option value="in-progress">
                      {t("status.inProgress")}
                    </option>
                    <option value="completed">{t("status.completed")}</option>
                    <option value="cancelled">{t("status.cancelled")}</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-secondary-600">
                    {t("admin.dateFrom", { defaultValue: "From Date" })}
                  </label>
                  <Input
                    type="date"
                    value={sessionDateFrom}
                    onChange={(e) => setSessionDateFrom(e.target.value)}
                    className="h-10"
                    variant="modern"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-secondary-600">
                    {t("admin.dateTo", { defaultValue: "To Date" })}
                  </label>
                  <Input
                    type="date"
                    value={sessionDateTo}
                    onChange={(e) => setSessionDateTo(e.target.value)}
                    className="h-10"
                    variant="modern"
                  />
                </div>
              </div>
            </div>
          </div>

          {adminSessionsLoading ? (
            <div className="text-center py-8">
              <p className="text-sm text-secondary-500">
                {t("common.loading")}
              </p>
            </div>
          ) : adminSessions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-secondary-500">
                {t("admin.recentActivity.empty")}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {adminSessions.map((session) => (
                <div
                  key={session._id || session.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-secondary-200 p-4 hover:border-primary-200 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm font-semibold text-secondary-900">
                        <span>
                          {session.candidateId?.name || session.candidate?.name}
                        </span>
                        {isRTL ? (
                          <ArrowLeft className="w-5 h-5 text-primary-500 shrink-0" />
                        ) : (
                          <ArrowRight className="w-5 h-5 text-primary-500 shrink-0" />
                        )}
                        <span>
                          {session.interviewerId?.name ||
                            session.interviewer?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap mt-1">
                        <p className="text-xs text-secondary-500">
                          {session.candidateId?.email ||
                            session.candidate?.email}
                        </p>
                        <span className="text-xs text-secondary-400">•</span>
                        <p className="text-xs text-secondary-500">
                          {session.interviewerId?.email ||
                            session.interviewer?.email}
                        </p>
                      </div>
                      <p className="text-xs text-secondary-400 mt-1">
                        {formatDate(session.date, locale)} ·{" "}
                        {formatTime(session.startTime)} -{" "}
                        {formatTime(session.endTime)}
                      </p>
                      {session.notes && (
                        <p className="text-xs text-secondary-500 mt-1 line-clamp-2">
                          {session.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge
                        status={session.status}
                        label={t(`status.${session.status}`, {
                          defaultValue: session.status,
                        })}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const sessionId = String(session._id || session.id);
                        setSessionToViewEvaluation(sessionId);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      {t("admin.viewEvaluation", {
                        defaultValue: "View Evaluation",
                      })}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        setSessionToDelete({
                          id: session._id || session.id,
                          candidateName: session.candidateId?.name,
                        })
                      }
                      disabled={
                        deleteAdminSession.isPending ||
                        (actioning?.id === (session._id || session.id) &&
                          actioning?.type === "deleteSession")
                      }
                    >
                      {t("common.delete")}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // Render Reservations & Slots tab
  const renderReservationsSlotsTab = () => (
    <div className="space-y-8">
      {/* Reservations Section */}
      <Card className="border border-secondary-200 shadow-sm">
        <CardHeader>
          <CardTitle>
            {t("admin.completedReservations", {
              defaultValue: "Completed Reservations",
            })}
          </CardTitle>
          <CardDescription>
            {t("admin.completedReservationsDescription", {
              defaultValue:
                "View and manage reservations from completed sessions",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
              <Input
                type="text"
                placeholder={t("admin.searchReservations", {
                  defaultValue: "Search by candidate or interviewer name...",
                })}
                value={reservationSearch}
                onChange={(e) => setReservationSearch(e.target.value)}
                className="pl-10 pr-10"
                variant="modern"
              />
              {reservationSearch && (
                <button
                  onClick={() => setReservationSearch("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-secondary-500" />
                <span className="text-sm font-medium text-secondary-700">
                  {t("common.filter")}:
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-secondary-600">
                    {t("common.status", { defaultValue: "Status" })}
                  </label>
                  <select
                    value={reservationStatusFilter}
                    onChange={(e) => setReservationStatusFilter(e.target.value)}
                    className="h-10 px-4 text-sm border-2 border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all bg-white"
                  >
                    <option value="">{t("admin.allStatuses")}</option>
                    <option value="pending">{t("status.pending")}</option>
                    <option value="accepted">{t("status.accepted")}</option>
                    <option value="rejected">{t("status.rejected")}</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-secondary-600">
                    {t("admin.dateFrom", { defaultValue: "From Date" })}
                  </label>
                  <Input
                    type="date"
                    value={reservationDateFrom}
                    onChange={(e) => setReservationDateFrom(e.target.value)}
                    className="h-10"
                    variant="modern"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-secondary-600">
                    {t("admin.dateTo", { defaultValue: "To Date" })}
                  </label>
                  <Input
                    type="date"
                    value={reservationDateTo}
                    onChange={(e) => setReservationDateTo(e.target.value)}
                    className="h-10"
                    variant="modern"
                  />
                </div>
              </div>
            </div>
          </div>

          {adminReservationsLoading ? (
            <div className="text-center py-8">
              <p className="text-sm text-secondary-500">
                {t("common.loading")}
              </p>
            </div>
          ) : adminReservations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-secondary-500">
                {t("admin.recentActivity.empty")}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {adminReservations.map((reservation) => (
                <div
                  key={reservation._id || reservation.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-secondary-200 p-4 hover:border-primary-200 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm font-semibold text-secondary-900">
                        <span>
                          {reservation.candidateId?.name ||
                            reservation.candidate?.name}
                        </span>
                        {isRTL ? (
                          <ArrowLeft className="w-5 h-5 text-primary-500 flex-shrink-0" />
                        ) : (
                          <ArrowRight className="w-5 h-5 text-primary-500 flex-shrink-0" />
                        )}
                        <span>
                          {reservation.interviewerId?.name ||
                            reservation.interviewer?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap mt-1">
                        <p className="text-xs text-secondary-500">
                          {reservation.candidateId?.email ||
                            reservation.candidate?.email}
                        </p>
                        {reservation.interviewerId?.specialization && (
                          <>
                            <span className="text-xs text-secondary-400">
                              •
                            </span>
                            <span className="text-xs text-secondary-600 font-medium">
                              {t(
                                `specializations.${reservation.interviewerId.specialization}`,
                                {
                                  defaultValue:
                                    reservation.interviewerId.specialization,
                                }
                              )}
                            </span>
                          </>
                        )}
                      </div>
                      {reservation.slotId && (
                        <p className="text-xs text-secondary-400 mt-1">
                          {formatDate(reservation.slotId.date, locale)} ·{" "}
                          {formatTime(reservation.slotId.startTime)} -{" "}
                          {formatTime(reservation.slotId.endTime)}
                        </p>
                      )}
                      {reservation.status === "rejected" &&
                        reservation.rejectionReason && (
                          <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
                            <p className="text-xs text-red-700">
                              <span className="font-medium">
                                {t("reservations.rejectionReason", {
                                  defaultValue: "Rejection Reason",
                                })}
                                :
                              </span>{" "}
                              {reservation.rejectionReason}
                            </p>
                          </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge
                        status={reservation.status}
                        label={t(`status.${reservation.status}`, {
                          defaultValue: reservation.status,
                        })}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        setReservationToDelete({
                          id: reservation._id || reservation.id,
                          candidateName: reservation.candidateId?.name,
                        })
                      }
                      disabled={
                        deleteAdminReservation.isPending ||
                        (actioning?.id ===
                          (reservation._id || reservation.id) &&
                          actioning?.type === "deleteReservation")
                      }
                    >
                      {t("common.delete")}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Slots Section */}
      <Card className="border border-secondary-200 shadow-sm">
        <CardHeader>
          <CardTitle>
            {t("admin.completedSlots", { defaultValue: "Completed Slots" })}
          </CardTitle>
          <CardDescription>
            {t("admin.completedSlotsDescription", {
              defaultValue: "View and manage slots from completed schedules",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
              <Input
                type="text"
                placeholder={t("admin.searchSlots", {
                  defaultValue:
                    "Search by interviewer name or schedule title...",
                })}
                value={slotSearch}
                onChange={(e) => setSlotSearch(e.target.value)}
                className="pl-10 pr-10"
                variant="modern"
              />
              {slotSearch && (
                <button
                  onClick={() => setSlotSearch("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-secondary-500" />
                <span className="text-sm font-medium text-secondary-700">
                  {t("common.filter")}:
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-secondary-600">
                    {t("common.status", { defaultValue: "Status" })}
                  </label>
                  <select
                    value={slotStatusFilter}
                    onChange={(e) => setSlotStatusFilter(e.target.value)}
                    className="h-10 px-4 text-sm border-2 border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all bg-white"
                  >
                    <option value="">{t("admin.allStatuses")}</option>
                    <option value="available">{t("status.available")}</option>
                    <option value="pending">{t("status.pending")}</option>
                    <option value="booked">{t("status.booked")}</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-secondary-600">
                    {t("admin.dateFrom", { defaultValue: "From Date" })}
                  </label>
                  <Input
                    type="date"
                    value={slotDateFrom}
                    onChange={(e) => setSlotDateFrom(e.target.value)}
                    className="h-10"
                    variant="modern"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-secondary-600">
                    {t("admin.dateTo", { defaultValue: "To Date" })}
                  </label>
                  <Input
                    type="date"
                    value={slotDateTo}
                    onChange={(e) => setSlotDateTo(e.target.value)}
                    className="h-10"
                    variant="modern"
                  />
                </div>
              </div>
            </div>
          </div>

          {adminSlotsLoading ? (
            <div className="text-center py-8">
              <p className="text-sm text-secondary-500">
                {t("common.loading")}
              </p>
            </div>
          ) : adminSlots.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-secondary-500">
                {t("admin.recentActivity.empty")}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {adminSlots.map((slot) => (
                <div
                  key={slot._id || slot.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-secondary-200 p-4 hover:border-primary-200 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-secondary-900">
                        {slot.scheduleId?.title || "N/A"}
                      </p>
                      <p className="text-xs text-secondary-500">
                        {slot.interviewerId?.name || slot.interviewer?.name}
                      </p>
                      <p className="text-xs text-secondary-400 mt-1">
                        {formatDate(slot.date, locale)} ·{" "}
                        {formatTime(slot.startTime)} -{" "}
                        {formatTime(slot.endTime)}
                      </p>
                    </div>
                    <StatusBadge
                      status={slot.status}
                      label={t(`status.${slot.status}`, {
                        defaultValue: slot.status,
                      })}
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      setSlotToDelete({
                        id: slot._id || slot.id,
                        scheduleTitle: slot.scheduleId?.title,
                      })
                    }
                    disabled={
                      deleteAdminSlot.isPending ||
                      (actioning?.id === (slot._id || slot.id) &&
                        actioning?.type === "deleteSlot")
                    }
                  >
                    {t("common.delete")}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // Tab configurations
  const tabs = [
    {
      id: "dashboard",
      label: t("admin.dashboardTitle", { defaultValue: "Dashboard" }),
      icon: <Activity className="h-4 w-4" />,
      content: renderDashboardTab(),
    },
    {
      id: "users",
      label: t("admin.users", { defaultValue: "All Users" }),
      icon: <Users className="h-4 w-4" />,
      badge: formatNumber(allUsers.length),
      content: renderUsersTab(),
    },
    {
      id: "content",
      label: t("admin.content", { defaultValue: "Content Learning" }),
      icon: <BookOpen className="h-4 w-4" />,
      badge: formatNumber(allContent.length),
      content: renderContentTab(),
    },
    {
      id: "reservations-slots",
      label: t("admin.reservationsSlots", {
        defaultValue: "Reservations & Slots",
      }),
      icon: <CalendarClock className="h-4 w-4" />,
      badge: formatNumber(adminReservations.length + adminSlots.length),
      content: renderReservationsSlotsTab(),
    },
    {
      id: "sessions",
      label: t("admin.sessions", { defaultValue: "Sessions" }),
      icon: <Video className="h-4 w-4" />,
      badge: formatNumber(adminSessions.length),
      content: renderSessionsTab(),
    },
  ];

  return (
    <div className={`min-h-screen bg-animated py-8 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <PageHeader
          title={t("admin.dashboardTitle")}
          subtitle={t("admin.subtitle")}
        />

        <Tabs tabs={tabs} defaultTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Edit User Dialog */}
      <EditUserDialog
        isOpen={!!userToEdit}
        onClose={cancelEditUser}
        onSave={handleUpdateUser}
        user={userToEdit}
        isLoading={
          updateUser.isPending ||
          (actioning?.id === userToEdit?.id && actioning?.type === "edit")
        }
      />

      {/* Delete User Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!userToDelete}
        onClose={cancelDeleteUser}
        onConfirm={confirmDeleteUser}
        title={t("admin.deleteUserConfirmTitle", {
          defaultValue: "Delete User",
        })}
        message={t("admin.deleteUserConfirm", {
          defaultValue: `Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`,
          name: userToDelete?.name,
        })}
        confirmLabel={t("common.delete", { defaultValue: "Delete" })}
        cancelLabel={t("common.cancel")}
        loadingLabel={t("common.deleting", { defaultValue: "Deleting..." })}
        isLoading={deleteUser.isPending}
      />

      {/* Delete Reservation Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!reservationToDelete}
        onClose={() => setReservationToDelete(null)}
        onConfirm={confirmDeleteReservation}
        title={t("admin.deleteReservationConfirmTitle", {
          defaultValue: "Delete Reservation",
        })}
        message={t("admin.deleteReservationConfirm", {
          defaultValue: `Are you sure you want to delete this reservation? This action cannot be undone.`,
        })}
        confirmLabel={t("common.delete", { defaultValue: "Delete" })}
        cancelLabel={t("common.cancel")}
        loadingLabel={t("common.deleting", { defaultValue: "Deleting..." })}
        isLoading={
          deleteAdminReservation.isPending ||
          actioning?.type === "deleteReservation"
        }
      />

      {/* Delete Slot Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!slotToDelete}
        onClose={() => setSlotToDelete(null)}
        onConfirm={confirmDeleteSlot}
        title={t("admin.deleteSlotConfirmTitle", {
          defaultValue: "Delete Slot",
        })}
        message={t("admin.deleteSlotConfirm", {
          defaultValue: `Are you sure you want to delete this slot? This action cannot be undone.`,
        })}
        confirmLabel={t("common.delete", { defaultValue: "Delete" })}
        cancelLabel={t("common.cancel")}
        loadingLabel={t("common.deleting", { defaultValue: "Deleting..." })}
        isLoading={
          deleteAdminSlot.isPending || actioning?.type === "deleteSlot"
        }
      />

      {/* Delete Session Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!sessionToDelete}
        onClose={() => setSessionToDelete(null)}
        onConfirm={confirmDeleteSession}
        title={t("admin.deleteSessionConfirmTitle", {
          defaultValue: "Delete Session",
        })}
        message={t("admin.deleteSessionConfirm", {
          defaultValue: `Are you sure you want to delete this session? This action cannot be undone.`,
        })}
        confirmLabel={t("common.delete", { defaultValue: "Delete" })}
        cancelLabel={t("common.cancel")}
        loadingLabel={t("common.deleting", { defaultValue: "Deleting..." })}
        isLoading={
          deleteAdminSession.isPending || actioning?.type === "deleteSession"
        }
      />

      {/* View Evaluation Dialog */}
      {sessionToViewEvaluation && (
        <EvaluationViewDialog
          sessionId={sessionToViewEvaluation}
          onClose={() => setSessionToViewEvaluation(null)}
        />
      )}
    </div>
  );
}

// Evaluation View Dialog Component
function EvaluationViewDialog({ sessionId, onClose }) {
  const { t } = useTranslation();
  const {
    data: evaluation,
    isLoading,
    isError,
    error,
  } = useEvaluationBySession(sessionId);

  // Debug: Log the sessionId and response
  if (import.meta.env.DEV) {
    if (error) {
      console.log("Evaluation fetch error:", {
        sessionId,
        error: error?.response?.data || error?.message,
        status: error?.response?.status,
      });
    }
    if (evaluation) {
      console.log("Evaluation loaded:", { sessionId, evaluation });
    }
  }

  const criteria = evaluation?.criteria
    ? [
        {
          key: "communication",
          label: t("evaluations.communication", {
            defaultValue: "Communication",
          }),
          score: evaluation.criteria?.communication?.score || 0,
          comment: evaluation.criteria?.communication?.comment || "",
        },
        {
          key: "technical",
          label: t("evaluations.technical", {
            defaultValue: "Technical Skills",
          }),
          score: evaluation.criteria?.technical?.score || 0,
          comment: evaluation.criteria?.technical?.comment || "",
        },
        {
          key: "problemSolving",
          label: t("evaluations.problemSolving", {
            defaultValue: "Problem Solving",
          }),
          score: evaluation.criteria?.problemSolving?.score || 0,
          comment: evaluation.criteria?.problemSolving?.comment || "",
        },
        {
          key: "confidence",
          label: t("evaluations.confidence", { defaultValue: "Confidence" }),
          score: evaluation.criteria?.confidence?.score || 0,
          comment: evaluation.criteria?.confidence?.comment || "",
        },
      ]
    : [];

  const getScoreColor = (score) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score) => {
    if (score >= 8) return "bg-green-100 border-green-200";
    if (score >= 6) return "bg-yellow-100 border-yellow-200";
    return "bg-red-100 border-red-200";
  };

  return (
    <div className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-secondary-200">
        <div className="flex items-center justify-between p-6 border-b border-secondary-200">
          <h3 className="text-lg font-semibold text-secondary-900">
            {t("admin.evaluationDetails", {
              defaultValue: "Evaluation Details",
            })}
          </h3>
          <button
            onClick={onClose}
            className="text-secondary-400 hover:text-secondary-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="text-sm text-secondary-600 mt-4">
                {t("sessions.loadingEvaluation", {
                  defaultValue: "Loading evaluation...",
                })}
              </p>
            </div>
          ) : isError ? (
            <div className="text-center py-8">
              <p className="text-sm text-red-600 mb-2">
                {error?.response?.data?.message ||
                  error?.message ||
                  t("common.error", { defaultValue: "An error occurred" })}
              </p>
              <p className="text-xs text-secondary-500">
                {t("sessions.noEvaluation", {
                  defaultValue: "Evaluation not available",
                })}
              </p>
            </div>
          ) : !evaluation ? (
            <div className="text-center py-8">
              <p className="text-sm text-secondary-600">
                {t("sessions.noEvaluation", {
                  defaultValue: "Evaluation not available yet",
                })}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Overall Score */}
              {evaluation.overallScore && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary-900">
                      {t("evaluations.overallScore", {
                        defaultValue: "Overall Score",
                      })}
                    </span>
                    <span
                      className={`text-2xl font-bold ${getScoreColor(
                        evaluation.overallScore
                      )}`}
                    >
                      {evaluation.overallScore}/10
                    </span>
                  </div>
                </div>
              )}

              {/* Criteria Scores */}
              {criteria.map((criterion) => (
                <div
                  key={criterion.key}
                  className={`border rounded-lg p-4 ${getScoreBgColor(
                    criterion.score
                  )}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-secondary-900">
                      {criterion.label}
                    </label>
                    <span
                      className={`text-lg font-bold ${getScoreColor(
                        criterion.score
                      )}`}
                    >
                      {criterion.score}/10
                    </span>
                  </div>
                  {/* Score Bar (Visual) */}
                  <div className="w-full bg-white/50 rounded-full h-2 mb-3">
                    <div
                      className={`h-2 rounded-full ${
                        criterion.score >= 8
                          ? "bg-green-500"
                          : criterion.score >= 6
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${(criterion.score / 10) * 100}%` }}
                    />
                  </div>
                  {/* Comment */}
                  {criterion.comment && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-secondary-700 mb-1">
                        {t("evaluations.comment", { defaultValue: "Comment" })}:
                      </p>
                      <p className="text-sm text-secondary-800 bg-white/50 rounded p-2">
                        {criterion.comment}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {/* General Notes */}
              {evaluation.notes && (
                <div className="mt-4 pt-4 border-t border-secondary-200">
                  <p className="text-xs font-medium text-secondary-700 mb-2">
                    {t("evaluations.notes", {
                      defaultValue: "General Notes",
                    })}
                    :
                  </p>
                  <p className="text-sm text-secondary-800 bg-secondary-50 rounded p-3">
                    {evaluation.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-end p-6 border-t border-secondary-200">
          <Button variant="outline" onClick={onClose}>
            {t("common.close", { defaultValue: "Close" })}
          </Button>
        </div>
      </div>
    </div>
  );
}
