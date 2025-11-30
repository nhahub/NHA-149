import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Video, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { ConfirmDialog } from "../components/ui/ConfirmDialog.jsx";
import VideoCall from "../components/sessions/VideoCall.jsx";
import QuestionsSidebar from "../components/sessions/QuestionsSidebar.jsx";
import LiveEvaluationForm from "../components/sessions/LiveEvaluationForm.jsx";
import EvaluationDisplay from "../components/sessions/EvaluationDisplay.jsx";
import {
  useSession,
  useStartSession,
  useCompleteSession,
} from "../hooks/api.js";
import { useAuth } from "../hooks/useAuth.js";
import toast from "react-hot-toast";
import { formatDate, formatTime } from "../utils/helpers.js";

export default function SessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isRTL = i18n.language === "ar";

  const {
    data: session,
    isLoading: sessionLoading,
    isError: sessionError,
    error: sessionErrorData,
  } = useSession(id);
  
  const startSession = useStartSession();
  const completeSession = useCompleteSession();

  const [isCallActive, setIsCallActive] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);

  const isInterviewer = user?.role === "interviewer";
  const isCandidate = user?.role === "candidate";

  const handleStartSession = async () => {
    try {
      await startSession.mutateAsync(id);
      toast.success(
        t("sessions.sessionStarted", { defaultValue: "Session started!" })
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          t("sessions.startError", { defaultValue: "Failed to start session" })
      );
    }
  };

  const handleJoinCall = () => {
    if (session?.status === "in-progress") {
      setIsCallActive(true);
    } else {
      toast.error(
        t("sessions.joinError", {
          defaultValue: "Session is not in progress. Please wait for the interviewer to start the session.",
        })
      );
    }
  };

  const handleCallEnd = async () => {
    setIsCallActive(false);
    if (isInterviewer) {
      // Show completion dialog
      setShowCompleteDialog(true);
    }
  };

  const handleConfirmComplete = async () => {
    try {
      await completeSession.mutateAsync({
        id,
        data: { notes: "" },
      });
      toast.success(
        t("sessions.sessionCompleted", {
          defaultValue: "Session completed!",
        })
      );
      setShowCompleteDialog(false);
      navigate("/interviews");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          t("sessions.completeError", {
            defaultValue: "Failed to complete session",
          })
      );
    }
  };

  const handleEvaluationSubmit = () => {
    // Evaluation submitted - can show success message
    toast.success(
      t("sessions.evaluationSubmitted", {
        defaultValue: "Evaluation submitted successfully!",
      })
    );
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (sessionError || (!sessionLoading && !session)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-secondary-600 mb-4">
            {sessionErrorData?.response?.data?.message ||
              t("sessions.notFound", { defaultValue: "Session not found" })}
          </p>
          <Button onClick={() => navigate("/interviews")}>
            {t("common.back", { defaultValue: "Back" })}
          </Button>
        </div>
      </div>
    );
  }

  const canJoinCall =
    session?.status === "in-progress" && !isCallActive;
  const showVideoCall = isCallActive && session?.status === "in-progress";
  const showEvaluation = session?.status === "completed" && isCandidate;

  return (
    <div className={`min-h-screen bg-animated py-8 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/interviews")}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">
                {t("sessions.interviewSession", {
                  defaultValue: "Interview Session",
                })}
              </h1>
              <p className="text-sm text-secondary-600">
                {formatDate(session.date, i18n.language)} ·{" "}
                {formatTime(session.startTime)} - {formatTime(session.endTime)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {session.status === "scheduled" && isInterviewer && (
              <Button onClick={handleStartSession} disabled={startSession.isPending}>
                <Video className="w-4 h-4 mr-2" />
                {t("sessions.startInterview", {
                  defaultValue: "Start Interview",
                })}
              </Button>
            )}

            {canJoinCall && (
              <Button onClick={handleJoinCall}>
                <Video className="w-4 h-4 mr-2" />
                {t("sessions.joinCall", { defaultValue: "Join Call" })}
              </Button>
            )}

          </div>
        </div>

        {/* Main Content */}
        {showVideoCall ? (
          <div className="flex gap-4 h-[calc(100vh-200px)]">
            {/* Video Call - Takes 70% width */}
            <div className="flex-1">
              <VideoCall
                sessionId={id}
                onCallEnd={handleCallEnd}
                userName={user?.name}
                isOwner={isInterviewer}
              />
            </div>

            {/* Sidebar - Only for interviewer, 30% width */}
            {isInterviewer && (
              <div className="w-80 flex flex-col gap-4">
                <QuestionsSidebar
                  sessionId={id}
                  specialization={session.interviewerId?.specialization}
                />
                <LiveEvaluationForm
                  sessionId={id}
                  onEvaluationSubmit={handleEvaluationSubmit}
                />
              </div>
            )}
          </div>
        ) : showEvaluation ? (
          <div className="flex gap-4 h-[calc(100vh-200px)]">
            {/* Session Info - Takes 70% width */}
            <div className="flex-1 bg-white rounded-2xl border border-secondary-200 p-8">
              <div className="flex flex-col items-center justify-center h-full text-center">
                <CheckCircle2 className="w-16 h-16 text-green-600 mb-4" />
                <h3 className="text-2xl font-semibold text-secondary-900 mb-2">
                  {t("sessions.sessionCompleted", {
                    defaultValue: "Session Completed",
                  })}
                </h3>
                <p className="text-secondary-600 mb-4">
                  {t("sessions.evaluationAvailable", {
                    defaultValue: "Your evaluation results are available in the sidebar.",
                  })}
                </p>
                <div className="text-sm text-secondary-500">
                  <p>
                    {formatDate(session.date, i18n.language)} ·{" "}
                    {formatTime(session.startTime)} - {formatTime(session.endTime)}
                  </p>
                </div>
              </div>
            </div>

            {/* Evaluation Display - 30% width */}
            <div className="w-80">
              <EvaluationDisplay sessionId={id} />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-secondary-200 p-8 text-center">
            <Video className="w-16 h-16 mx-auto text-secondary-400 mb-4" />
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              {session.status === "scheduled"
                ? t("sessions.waitingToStart", {
                    defaultValue: "Waiting for interview to start",
                  })
                : t("sessions.joinToStart", {
                    defaultValue: "Click 'Join Call' to start the interview",
                  })}
            </h3>
            <p className="text-secondary-600">
              {session.status === "scheduled"
                ? t("sessions.interviewerWillStart", {
                    defaultValue:
                      "The interviewer will start the session when ready",
                  })
                : t("sessions.readyToJoin", {
                    defaultValue: "The video call is ready. Click 'Join Call' to connect.",
                  })}
            </p>
          </div>
        )}

        {/* Complete Session Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showCompleteDialog}
          onClose={() => setShowCompleteDialog(false)}
          onConfirm={handleConfirmComplete}
          title={t("sessions.completeSessionTitle", {
            defaultValue: "Complete Session",
          })}
          message={t("sessions.completeSession", {
            defaultValue: "Do you want to complete this session?",
          })}
          confirmLabel={t("sessions.complete", {
            defaultValue: "Complete",
          })}
          cancelLabel={t("common.cancel", { defaultValue: "Cancel" })}
          loadingLabel={t("common.loading", { defaultValue: "Loading..." })}
          isLoading={completeSession.isPending}
        />
      </div>
    </div>
  );
}

