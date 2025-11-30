import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import { Video } from "lucide-react";
import InterviewerList from "../components/interviews/InterviewerList.jsx";
import ReservationsList from "../components/interviews/ReservationsList.jsx";
import ScheduleForm from "../components/interviews/ScheduleForm.jsx";
import SessionsList from "../components/interviews/SessionsList.jsx";
import SlotsCalendar from "../components/interviews/SlotsCalendar.jsx";
import { Button } from "../components/ui/Button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import { ConfirmDialog } from "../components/ui/ConfirmDialog.jsx";
import { RejectReservationDialog } from "../components/ui/RejectReservationDialog.jsx";
import { formatTime } from "../utils/helpers.js";
import {
  useAcceptReservation,
  useCreateReservation,
  useDeleteSchedule,
  useInterviewers,
  useMyReservations,
  useMySchedules,
  useMySessions,
  usePendingReservations,
  useRejectReservation,
  useSlotsByInterviewer,
} from "../hooks/api.js";
import { useAuth } from "../hooks/useAuth.js";

export default function InterviewsPage() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const isRTL = i18n.language === "ar";

  const [selectedInterviewer, setSelectedInterviewer] = useState(null);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);
  const [reservationToReject, setReservationToReject] = useState(null);

  const isInterviewer = user?.role === "interviewer";
  const isCandidate = user?.role === "candidate";

  // Fetch data based on user role
  // For candidates, only fetch interviewers who have active schedules
  const interviewerParams = isCandidate ? { hasSchedules: "true" } : {};

  const { data: interviewersData } = useInterviewers(interviewerParams);
  const { data: myReservations } = useMyReservations();
  const { data: mySchedules } = useMySchedules(undefined, {
    enabled: isInterviewer,
  });
  const { data: mySessions } = useMySessions();
  const { data: pendingReservations } = usePendingReservations(
    user?.role === "interviewer"
  );

  // For candidates, show all slots (available, pending, booked) with color coding
  // For interviewers, they can still filter if needed
  const slotParams = isCandidate ? {} : { status: "available" };
  const { data: slots } = useSlotsByInterviewer(selectedInterviewer?._id, slotParams);

  const createReservation = useCreateReservation();
  const acceptReservation = useAcceptReservation();
  const rejectReservation = useRejectReservation();
  const deleteSchedule = useDeleteSchedule();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleSelectInterviewer = (interviewer) => {
    setSelectedInterviewer(interviewer);
  };

  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule);
    setShowScheduleForm(true);
  };

  const handleScheduleFormClose = () => {
    setShowScheduleForm(false);
    setEditingSchedule(null);
  };

  const handleDeleteSchedule = async (scheduleId, scheduleTitle) => {
    setScheduleToDelete({ id: scheduleId, title: scheduleTitle });
  };

  const confirmDeleteSchedule = async () => {
    if (!scheduleToDelete) return;

    try {
      await deleteSchedule.mutateAsync(scheduleToDelete.id);
      toast.success(t("schedules.deleteSuccess"), { duration: 4000 });
      setScheduleToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.message || t("common.error"), {
        duration: 5000,
      });
    }
  };

  const cancelDeleteSchedule = () => {
    setScheduleToDelete(null);
  };

  const handleBookSlot = async (slot) => {
    try {
      await createReservation.mutateAsync({
        slotId: slot._id,
      });
      toast.success(t("reservations.bookingSuccess"), { duration: 4000 });
    } catch (error) {
      toast.error(error.response?.data?.message || t("common.error"), {
        duration: 5000,
      });
    }
  };

  const handleAcceptReservation = async (id) => {
    try {
      await acceptReservation.mutateAsync(id);
      toast.success(t("reservations.acceptSuccess"), { duration: 4000 });
    } catch (error) {
      toast.error(error.response?.data?.message || t("common.error"), {
        duration: 5000,
      });
    }
  };

  const handleRejectReservation = (id) => {
    // Find reservation to get candidate name (check both lists)
    const reservation =
      pendingReservations?.find((r) => r._id === id) ||
      myReservations?.find((r) => r._id === id);
    setReservationToReject({
      id,
      candidateName: reservation?.candidateId?.name || reservation?.candidate?.name,
    });
  };

  const confirmRejectReservation = async (reason) => {
    if (!reservationToReject) return;

    try {
      await rejectReservation.mutateAsync({
        id: reservationToReject.id,
        data: { rejectionReason: reason },
      });
      toast.success(t("reservations.rejectSuccess"), { duration: 4000 });
      setReservationToReject(null);
    } catch (error) {
      toast.error(error.response?.data?.message || t("common.error"), {
        duration: 5000,
      });
    }
  };

  const cancelRejectReservation = () => {
    setReservationToReject(null);
  };

  // Separate pending and accepted reservations for proper color coding
  const pendingReservationSlotIds =
    myReservations
      ?.filter((r) => r.status === "pending")
      .map((r) => r.slotId?._id) || [];
  const acceptedReservationSlotIds =
    myReservations
      ?.filter((r) => r.status === "accepted")
      .map((r) => r.slotId?._id) || [];
  // bookedSlotIds includes all reserved slots (for disabling clicks), but we use separate arrays for coloring
  const bookedSlotIds = [...pendingReservationSlotIds, ...acceptedReservationSlotIds];

  return (
    <div className={`min-h-screen bg-animated py-8 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title={t("navigation.interviews")}
          subtitle={
            isInterviewer
              ? t("interviews.interviewerSubtitle")
              : t("interviews.candidateSubtitle")
          }
        />

        {/* CANDIDATE VIEW */}
        {isCandidate && (
          <div className="space-y-8">
            {/* My Sessions */}
            {mySessions && mySessions.length > 0 && (
              <Card className="card-modern">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-primary-600" />
                    {t("interviews.mySessions")}
                  </CardTitle>
                  <CardDescription>
                    {t("interviews.mySessionsDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SessionsList sessions={mySessions} isInterviewer={false} />
                </CardContent>
              </Card>
            )}

            {/* My Reservations */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {t("interviews.myReservations")}
                </CardTitle>
                <CardDescription>
                  {t("interviews.myReservationsDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReservationsList
                  reservations={myReservations}
                  isInterviewer={false}
                />
              </CardContent>
            </Card>

            {/* Browse Interviewers */}
            {!selectedInterviewer && (
              <Card className="card-modern">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-secondary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {t("interviews.browseInterviewers")}
                  </CardTitle>
                  <CardDescription>
                    {t("interviews.browseInterviewersDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <InterviewerList
                    interviewers={interviewersData?.interviewers}
                    onSelectInterviewer={handleSelectInterviewer}
                  />
                </CardContent>
              </Card>
            )}

            {/* Selected Interviewer - Choose Day & Book Slots */}
            {selectedInterviewer && (
              <Card className="card-modern">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {selectedInterviewer.name}
                      </CardTitle>
                      <CardDescription>
                        {t("interviews.selectSlot")}
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedInterviewer(null);
                      }}
                    >
                      {t("common.back")}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Slots */}
                  <div>
                    <h3 className="text-sm font-medium text-secondary-700 mb-3">
                      {t("interviews.availableSlots")}
                    </h3>
                    {slots && slots.length > 0 ? (
                      <SlotsCalendar
                        slots={slots}
                        onBookSlot={handleBookSlot}
                        bookedSlotIds={bookedSlotIds}
                        pendingReservationSlotIds={pendingReservationSlotIds}
                        acceptedReservationSlotIds={acceptedReservationSlotIds}
                      />
                    ) : (
                      <div className="text-center py-8 text-secondary-500">
                        {t("interviews.noSlotsAvailable")}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* INTERVIEWER VIEW */}
        {isInterviewer && (
          <div className="space-y-8">
            {/* Pending Reservations */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {t("interviews.pendingReservations")}
                </CardTitle>
                <CardDescription>
                  {t("interviews.pendingReservationsDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReservationsList
                  reservations={pendingReservations}
                  onAccept={handleAcceptReservation}
                  onReject={handleRejectReservation}
                  isInterviewer={true}
                />
              </CardContent>
            </Card>

            {/* My Sessions */}
            {mySessions && mySessions.length > 0 && (
              <Card className="card-modern">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-primary-600" />
                    {t("interviews.mySessions")}
                  </CardTitle>
                  <CardDescription>
                    {t("interviews.mySessionsDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SessionsList sessions={mySessions} isInterviewer={true} />
                </CardContent>
              </Card>
            )}

            {/* All My Reservations */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-cyan-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                  {t("interviews.allReservations")}
                </CardTitle>
                <CardDescription>
                  {t("interviews.allReservationsDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReservationsList
                  reservations={myReservations}
                  isInterviewer={true}
                />
              </CardContent>
            </Card>

            {/* My Schedules */}
            <Card className="card-modern">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-primary-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {t("interviews.mySchedules")}
                    </CardTitle>
                    <CardDescription>
                      {t("interviews.mySchedulesDescription")}
                    </CardDescription>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      if (showScheduleForm) {
                        handleScheduleFormClose();
                      } else {
                        setShowScheduleForm(true);
                      }
                    }}
                  >
                    {showScheduleForm
                      ? t("common.cancel")
                      : t("schedules.createSchedule")}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showScheduleForm && (
                  <div className="mb-6">
                    <ScheduleForm
                      schedule={editingSchedule}
                      onSuccess={handleScheduleFormClose}
                      onCancel={handleScheduleFormClose}
                    />
                  </div>
                )}

                {mySchedules && mySchedules.length > 0 ? (
                  <div className="space-y-4">
                    {mySchedules.map((schedule) => (
                      <div
                        key={schedule._id}
                        className="p-4 border border-secondary-200 rounded-lg hover:border-primary-300 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-secondary-900">
                                {schedule.title}
                              </h4>
                              <span className="text-sm font-medium text-cyan-600 bg-cyan-50 px-2 py-1 rounded">
                                {new Date(schedule.date).toLocaleDateString(
                                  i18n.language === "ar" ? "ar-EG" : "en-US",
                                  {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                            <p className="text-sm text-secondary-600 mt-1">
                              {schedule.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-secondary-500">
                              <span>
                                {formatTime(schedule.startTime)} -{" "}
                                {formatTime(schedule.endTime)}
                              </span>
                              <span>•</span>
                              <span>
                                {schedule.duration} {t("common.minutes")}
                              </span>
                              <span>•</span>
                              <span>
                                {t("schedules.break")}: {schedule.breakTime}{" "}
                                {t("common.minutes")}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditSchedule(schedule)}
                              className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50"
                            >
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              {t("common.edit")}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDeleteSchedule(
                                  schedule._id,
                                  schedule.title
                                )
                              }
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              {t("common.delete")}
                            </Button>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                schedule.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-secondary-100 text-secondary-800"
                              }`}
                            >
                              {schedule.isActive
                                ? t("common.active")
                                : t("common.inactive")}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-secondary-600 text-center py-8">
                    {t("schedules.noSchedules")}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!scheduleToDelete}
        onClose={cancelDeleteSchedule}
        onConfirm={confirmDeleteSchedule}
        title={t("schedules.confirmDeleteTitle")}
        message={t("schedules.confirmDelete", { title: scheduleToDelete?.title })}
        confirmLabel={t("common.delete")}
        cancelLabel={t("common.cancel")}
        loadingLabel={t("common.deleting")}
        isLoading={deleteSchedule.isPending}
      />

      {/* Reject Reservation Dialog */}
      <RejectReservationDialog
        isOpen={!!reservationToReject}
        onClose={cancelRejectReservation}
        onConfirm={confirmRejectReservation}
        candidateName={reservationToReject?.candidateName}
        isLoading={rejectReservation.isPending}
      />
    </div>
  );
}
