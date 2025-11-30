import { useTranslation } from "react-i18next";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { useEvaluationBySession } from "../../hooks/api.js";

/**
 * Read-only evaluation display component for candidates
 * Shows the evaluation results after the session is completed
 */
export default function EvaluationDisplay({ sessionId }) {
  const { t } = useTranslation();
  const { data: evaluation, isLoading, isError } = useEvaluationBySession(sessionId);

  if (isLoading) {
    return (
      <Card className="rounded-none border-0 border-t h-full flex flex-col">
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-2" />
            <p className="text-sm text-secondary-600">
              {t("sessions.loadingEvaluation", { defaultValue: "Loading evaluation..." })}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !evaluation) {
    return (
      <Card className="rounded-none border-0 border-t h-full flex flex-col">
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-secondary-600">
              {t("sessions.noEvaluation", {
                defaultValue: "Evaluation not available yet",
              })}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const criteria = [
    {
      key: "communication",
      label: t("evaluations.communication", { defaultValue: "Communication" }),
      score: evaluation.criteria?.communication?.score || 0,
      comment: evaluation.criteria?.communication?.comment || "",
    },
    {
      key: "technical",
      label: t("evaluations.technical", { defaultValue: "Technical Skills" }),
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
  ];

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
    <Card className="rounded-none border-0 border-t h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          {t("sessions.evaluationResults", { defaultValue: "Evaluation Results" })}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-4">
        {/* Overall Score */}
        {evaluation.overallScore && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-primary-900">
                {t("sessions.overallScore", { defaultValue: "Overall Score" })}
              </span>
              <span
                className={`text-2xl font-bold ${getScoreColor(evaluation.overallScore)}`}
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
            className={`border rounded-lg p-4 ${getScoreBgColor(criterion.score)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-secondary-900">
                {criterion.label}
              </label>
              <span
                className={`text-lg font-bold ${getScoreColor(criterion.score)}`}
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
                  {t("sessions.comment", { defaultValue: "Comment" })}:
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
              {t("sessions.generalNotes", { defaultValue: "General Notes" })}:
            </p>
            <p className="text-sm text-secondary-800 bg-secondary-50 rounded p-3">
              {evaluation.notes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

