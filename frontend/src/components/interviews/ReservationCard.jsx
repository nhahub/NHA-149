import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Video } from "lucide-react";
import { formatDate, formatTime } from "../../utils/helpers.js";
import { Button } from "../ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import { useQuery } from "@tanstack/react-query";
import { sessionsAPI } from "../../api/index.js";

export default function ReservationCard({
  reservation,
  onAccept,
  onReject,
  isInterviewer,
}) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Get sessionId from reservation (added by backend) or find it from sessions
  const { data: sessions } = useQuery({
    queryKey: ["my-sessions"],
    queryFn: () => sessionsAPI.getMySessions(),
    select: (data) => data.data.data?.sessions || [],
  });

  // First try to use sessionId from reservation (if backend added it)
  // Otherwise, find session by matching reservationId
  const sessionId = reservation.sessionId;
  const session = sessionId
    ? sessions?.find((s) => s._id === sessionId)
    : sessions?.find(
        (s) =>
          (s.reservationId?._id?.toString() || s.reservationId?.toString()) ===
          (reservation._id?.toString() || reservation._id)
      );

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-secondary-100 text-secondary-800 border-secondary-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return t("reservations.pending");
      case "accepted":
        return t("reservations.accepted");
      case "rejected":
        return t("reservations.rejected");
      default:
        return status;
    }
  };

  const user = isInterviewer
    ? reservation.candidateId
    : reservation.interviewerId;
  const slot = reservation.slotId;
  const formattedStartTime = slot?.startTime ? formatTime(slot.startTime) : "--";
  const formattedEndTime = slot?.endTime ? formatTime(slot.endTime) : "--";

  return (
    <Card className="card-modern">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <CardTitle className="text-base">{user?.name}</CardTitle>
              <CardDescription className="text-sm">
                {user?.email}
                {reservation.interviewerId?.specialization && (
                  <>
                    {" · "}
                    <span className="font-medium">
                      {t(`specializations.${reservation.interviewerId.specialization}`, {
                        defaultValue: reservation.interviewerId.specialization,
                      })}
                    </span>
                  </>
                )}
              </CardDescription>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              reservation.status
            )}`}
          >
            {getStatusText(reservation.status)}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {slot?.date && (
            <div className="flex items-center gap-2 text-sm text-secondary-700">
              <svg
                className="w-4 h-4 text-primary-500"
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
              <span className="font-medium">
                {formatDate(slot.date, i18n.language)}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-secondary-700">
            <svg
              className="w-4 h-4 text-primary-500"
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
            <span className="font-medium">
              {formattedStartTime} - {formattedEndTime}
            </span>
          </div>

          {reservation.note && (
            <div className="p-3 bg-secondary-50 rounded-lg">
              <p className="text-sm text-secondary-700">
                <span className="font-medium">{t("reservations.note")}:</span>{" "}
                {reservation.note}
              </p>
            </div>
          )}

          {reservation.status === "rejected" && reservation.rejectionReason && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-700">
                <span className="font-medium">
                  {t("reservations.rejectionReason")}:
                </span>{" "}
                {reservation.rejectionReason}
              </p>
            </div>
          )}

          {isInterviewer && reservation.status === "pending" && (
            <div className="flex gap-2 pt-2">
              <Button
                variant="default"
                size="sm"
                className="flex-1"
                onClick={() => onAccept(reservation._id)}
              >
                {t("reservations.accept")}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={() => onReject(reservation._id)}
              >
                {t("reservations.reject")}
              </Button>
            </div>
          )}

          {reservation.status === "accepted" && (
            <div className="flex gap-2 pt-2">
              {(sessionId || session?._id) ? (
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    const idToUse = sessionId || session?._id;
                    if (idToUse) {
                      navigate(`/session/${idToUse}`);
                    }
                  }}
                >
                  <Video className="w-4 h-4 mr-2" />
                  {session?.status === "in-progress"
                    ? t("reservations.joinSession")
                    : t("reservations.viewSession")}
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="flex-1" disabled>
                  {t("reservations.sessionLoading")}
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

ReservationCard.propTypes = {
  reservation: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    note: PropTypes.string,
    rejectionReason: PropTypes.string,
    candidateId: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      avatarUrl: PropTypes.string,
    }),
    interviewerId: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      avatarUrl: PropTypes.string,
    }),
    slotId: PropTypes.shape({
      startTime: PropTypes.string,
      endTime: PropTypes.string,
    }),
  }).isRequired,
  onAccept: PropTypes.func,
  onReject: PropTypes.func,
  isInterviewer: PropTypes.bool,
};
