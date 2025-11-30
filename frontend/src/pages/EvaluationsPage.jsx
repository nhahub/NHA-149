import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Loader2, ArrowLeft, Star } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { useMyEvaluations } from "../hooks/api.js";
import { useAuth } from "../hooks/useAuth.js";
import { formatDate, formatTime } from "../utils/helpers.js";
import { ROUTES } from "../config/app.js";

export default function EvaluationsPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isRTL = i18n.language === "ar";

  const { data, isLoading, isError } = useMyEvaluations({ page: 1, limit: 100 });

  const evaluations = data?.evaluations || [];
  const isCandidate = user?.role === "candidate";

  const getScoreColor = (score) => {
    if (score >= 8) return "text-green-600 bg-green-100 border-green-200";
    if (score >= 6) return "text-yellow-600 bg-yellow-100 border-yellow-200";
    return "text-red-600 bg-red-100 border-red-200";
  };

  const handleViewSession = (sessionId) => {
    navigate(`/session/${sessionId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-animated py-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-secondary-600">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-animated py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl border border-red-200 p-8 text-center">
            <p className="text-red-600 mb-4">{t("common.error")}</p>
            <Button onClick={() => navigate(ROUTES.DASHBOARD)}>
              {t("common.back")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-animated py-8 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.DASHBOARD)}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <PageHeader
            title={t("evaluations.myEvaluations", {
              defaultValue: "My Evaluations",
            })}
            subtitle={
              isCandidate
                ? t("evaluations.candidateSubtitle", {
                    defaultValue: "View all your interview evaluation results",
                  })
                : t("evaluations.interviewerSubtitle", {
                    defaultValue: "View all evaluations you've created",
                  })
            }
          />
        </div>

        {evaluations.length === 0 ? (
          <Card className="card-modern">
            <CardContent className="py-12 text-center">
              <CheckCircle2 className="w-16 h-16 mx-auto text-secondary-400 mb-4" />
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                {t("evaluations.noEvaluations", {
                  defaultValue: "No evaluations yet",
                })}
              </h3>
              <p className="text-secondary-600 mb-6">
                {isCandidate
                  ? t("evaluations.noEvaluationsDescription", {
                      defaultValue:
                        "Your interview evaluations will appear here once your sessions are completed.",
                    })
                  : t("evaluations.noEvaluationsDescriptionInterviewer", {
                      defaultValue:
                        "Evaluations you create will appear here.",
                    })}
              </p>
              <Button onClick={() => navigate(ROUTES.INTERVIEWS)}>
                {t("navigation.interviews")}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {evaluations.map((evaluation) => (
              <Card key={evaluation._id} className="card-modern">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        {isCandidate
                          ? evaluation.interviewerId?.name ||
                            t("evaluations.interviewer", {
                              defaultValue: "Interviewer",
                            })
                          : evaluation.candidateId?.name ||
                            t("evaluations.candidate", {
                              defaultValue: "Candidate",
                            })}
                      </CardTitle>
                      {evaluation.sessionId && (
                        <div className="text-sm text-secondary-600 space-y-1">
                          <p>
                            📅{" "}
                            {formatDate(
                              evaluation.sessionId.date,
                              i18n.language
                            )}
                          </p>
                          <p>
                            ⏰ {formatTime(evaluation.sessionId.startTime)} -{" "}
                            {formatTime(evaluation.sessionId.endTime)}
                          </p>
                        </div>
                      )}
                    </div>
                    <div
                      className={`px-4 py-2 rounded-lg border-2 font-bold text-lg ${getScoreColor(
                        evaluation.overallScore || 0
                      )}`}
                    >
                      {evaluation.overallScore || 0}/10
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {evaluation.criteria?.communication && (
                      <div className="p-3 bg-secondary-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-secondary-700">
                            {t("evaluations.communication", {
                              defaultValue: "Communication",
                            })}
                          </span>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-semibold">
                              {evaluation.criteria.communication.score}/10
                            </span>
                          </div>
                        </div>
                        {evaluation.criteria.communication.comment && (
                          <p className="text-xs text-secondary-600 mt-2 pt-2 border-t border-secondary-200">
                            {evaluation.criteria.communication.comment}
                          </p>
                        )}
                      </div>
                    )}
                    {evaluation.criteria?.technical && (
                      <div className="p-3 bg-secondary-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-secondary-700">
                            {t("evaluations.technical", {
                              defaultValue: "Technical Skills",
                            })}
                          </span>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-semibold">
                              {evaluation.criteria.technical.score}/10
                            </span>
                          </div>
                        </div>
                        {evaluation.criteria.technical.comment && (
                          <p className="text-xs text-secondary-600 mt-2 pt-2 border-t border-secondary-200">
                            {evaluation.criteria.technical.comment}
                          </p>
                        )}
                      </div>
                    )}
                    {evaluation.criteria?.problemSolving && (
                      <div className="p-3 bg-secondary-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-secondary-700">
                            {t("evaluations.problemSolving", {
                              defaultValue: "Problem Solving",
                            })}
                          </span>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-semibold">
                              {evaluation.criteria.problemSolving.score}/10
                            </span>
                          </div>
                        </div>
                        {evaluation.criteria.problemSolving.comment && (
                          <p className="text-xs text-secondary-600 mt-2 pt-2 border-t border-secondary-200">
                            {evaluation.criteria.problemSolving.comment}
                          </p>
                        )}
                      </div>
                    )}
                    {evaluation.criteria?.confidence && (
                      <div className="p-3 bg-secondary-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-secondary-700">
                            {t("evaluations.confidence", {
                              defaultValue: "Confidence",
                            })}
                          </span>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-semibold">
                              {evaluation.criteria.confidence.score}/10
                            </span>
                          </div>
                        </div>
                        {evaluation.criteria.confidence.comment && (
                          <p className="text-xs text-secondary-600 mt-2 pt-2 border-t border-secondary-200">
                            {evaluation.criteria.confidence.comment}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {evaluation.notes && (
                    <div className="mb-4 p-3 bg-primary-50 rounded-lg">
                      <p className="text-xs font-medium text-primary-700 mb-1">
                        {t("evaluations.notes", {
                          defaultValue: "Notes",
                        })}
                      </p>
                      <p className="text-sm text-primary-900">
                        {evaluation.notes}
                      </p>
                    </div>
                  )}

                  {evaluation.sessionId && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewSession(evaluation.sessionId._id)}
                      className="w-full"
                    >
                      {t("evaluations.viewSession", {
                        defaultValue: "View Session",
                      })}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

