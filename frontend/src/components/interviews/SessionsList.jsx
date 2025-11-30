import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Video, Calendar, Clock, User } from "lucide-react";
import { formatDate, formatTime } from "../../utils/helpers.js";
import { Button } from "../ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card";

export default function SessionsList({ sessions, isInterviewer }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  if (!sessions || sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <Video className="mx-auto h-12 w-12 text-secondary-400" />
        <h3 className="mt-2 text-sm font-medium text-secondary-900">
          {t("sessions.noSessions")}
        </h3>
        <p className="mt-1 text-sm text-secondary-500">
          {t("sessions.noSessionsDescription")}
        </p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-secondary-100 text-secondary-800 border-secondary-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "scheduled":
        return t("sessions.scheduled");
      case "in-progress":
        return t("sessions.inProgress");
      case "completed":
        return t("sessions.completed");
      case "cancelled":
        return t("sessions.cancelled");
      default:
        return status;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sessions.map((session) => {
        const otherUser = isInterviewer
          ? session.candidateId
          : session.interviewerId;

        return (
          <Card key={session._id} className="card-modern">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {otherUser?.avatarUrl ? (
                    <img
                      src={otherUser.avatarUrl}
                      alt={otherUser.name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {otherUser?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-base">{otherUser?.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {otherUser?.email}
                    </CardDescription>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    session.status
                  )}`}
                >
                  {getStatusText(session.status)}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-secondary-700">
                  <Calendar className="w-4 h-4 text-primary-500" />
                  <span className="font-medium">
                    {formatDate(session.date, i18n.language)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-secondary-700">
                  <Clock className="w-4 h-4 text-primary-500" />
                  <span className="font-medium">
                    {formatTime(session.startTime)} - {formatTime(session.endTime)}
                  </span>
                </div>

                {(session.status === "scheduled" ||
                  session.status === "in-progress") && (
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate(`/session/${session._id}`)}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    {session.status === "in-progress"
                      ? t("sessions.joinSession")
                      : t("sessions.viewSession")}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

SessionsList.propTypes = {
  sessions: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      startTime: PropTypes.string,
      endTime: PropTypes.string,
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
    })
  ),
  isInterviewer: PropTypes.bool,
};





