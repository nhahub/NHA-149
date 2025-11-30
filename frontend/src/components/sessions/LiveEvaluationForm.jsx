import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Save, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { evaluationsAPI } from "../../api/index.js";
import toast from "react-hot-toast";
import { useSocket } from "../../hooks/useSocket";

export default function LiveEvaluationForm({ sessionId, onEvaluationSubmit }) {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const socket = useSocket();
  const [scores, setScores] = useState({
    communication: 5,
    technical: 5,
    problemSolving: 5,
    confidence: 5,
  });
  const [comments, setComments] = useState({
    communication: "",
    technical: "",
    problemSolving: "",
    confidence: "",
  });
  const [notes, setNotes] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  // Check if evaluation already exists
  const { data: existingEvaluation } = useQuery({
    queryKey: ["evaluation", sessionId],
    queryFn: () => evaluationsAPI.getEvaluationBySession(sessionId),
    select: (data) => data.data.data?.evaluation,
    enabled: !!sessionId,
    onSuccess: (evaluation) => {
      if (evaluation) {
        setScores({
          communication: evaluation.criteria?.communication?.score || 5,
          technical: evaluation.criteria?.technical?.score || 5,
          problemSolving: evaluation.criteria?.problemSolving?.score || 5,
          confidence: evaluation.criteria?.confidence?.score || 5,
        });
        setComments({
          communication: evaluation.criteria?.communication?.comment || "",
          technical: evaluation.criteria?.technical?.comment || "",
          problemSolving: evaluation.criteria?.problemSolving?.comment || "",
          confidence: evaluation.criteria?.confidence?.comment || "",
        });
        setNotes(evaluation.notes || "");
      }
    },
  });

  const createEvaluation = useMutation({
    mutationFn: evaluationsAPI.createEvaluation,
    onSuccess: () => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries(["evaluation", sessionId]);
      queryClient.invalidateQueries(["my-evaluations"]);
      queryClient.refetchQueries(["my-evaluations"]);
      toast.success(
        t("sessions.evaluationSaved", { defaultValue: "Evaluation saved!" })
      );
      if (onEvaluationSubmit) {
        onEvaluationSubmit();
      }
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          t("sessions.evaluationError", {
            defaultValue: "Failed to save evaluation",
          })
      );
    },
  });

  const updateEvaluation = useMutation({
    mutationFn: ({ id, data }) => evaluationsAPI.updateEvaluation(id, data),
    onSuccess: () => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries(["evaluation", sessionId]);
      queryClient.invalidateQueries(["my-evaluations"]);
      queryClient.refetchQueries(["my-evaluations"]);
      toast.success(
        t("sessions.evaluationUpdated", {
          defaultValue: "Evaluation updated!",
        })
      );
      if (onEvaluationSubmit) {
        onEvaluationSubmit();
      }
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          t("sessions.evaluationError", {
            defaultValue: "Failed to update evaluation",
          })
      );
    },
  });

  // Listen for real-time evaluation updates via Socket.io
  useEffect(() => {
    if (!socket || !sessionId) return;

    const handleEvaluationUpdate = ({ evaluationData, updatedBy, updatedByRole }) => {
      // Only sync if updated by interviewer (or if you want to allow candidate to see updates)
      if (updatedByRole === "interviewer" && updatedBy !== socket.userId) {
        setIsSyncing(true);
        if (evaluationData.scores) {
          setScores((prev) => ({ ...prev, ...evaluationData.scores }));
        }
        if (evaluationData.comments) {
          setComments((prev) => ({ ...prev, ...evaluationData.comments }));
        }
        if (evaluationData.notes !== undefined) {
          setNotes(evaluationData.notes);
        }
        setTimeout(() => setIsSyncing(false), 500);
      }
    };

    socket.on("evaluation-update", handleEvaluationUpdate);

    return () => {
      socket.off("evaluation-update", handleEvaluationUpdate);
    };
  }, [socket, sessionId]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (existingEvaluation) {
        handleSaveDraft();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [scores, comments, notes, existingEvaluation]);

  const handleScoreChange = (criterion, value) => {
    const newScores = { ...scores, [criterion]: parseInt(value) };
    setScores(newScores);

    // Emit real-time update via Socket.io
    if (socket && sessionId) {
      socket.emit("evaluation-update", {
        sessionId,
        evaluationData: {
          scores: newScores,
          comments,
          notes,
        },
      });
    }
  };

  const handleCommentChange = (criterion, value) => {
    const newComments = { ...comments, [criterion]: value };
    setComments(newComments);

    // Emit real-time update via Socket.io
    if (socket && sessionId) {
      socket.emit("evaluation-update", {
        sessionId,
        evaluationData: {
          scores,
          comments: newComments,
          notes,
        },
      });
    }
  };

  const handleSaveDraft = () => {
    if (existingEvaluation) {
      updateEvaluation.mutate({
        id: existingEvaluation._id,
        data: {
          criteria: {
            communication: {
              score: scores.communication,
              comment: comments.communication,
            },
            technical: {
              score: scores.technical,
              comment: comments.technical,
            },
            problemSolving: {
              score: scores.problemSolving,
              comment: comments.problemSolving,
            },
            confidence: {
              score: scores.confidence,
              comment: comments.confidence,
            },
          },
          notes,
        },
      });
    }
  };

  const handleSubmit = () => {
    const evaluationData = {
      criteria: {
        communication: {
          score: scores.communication,
          comment: comments.communication || "",
        },
        technical: {
          score: scores.technical,
          comment: comments.technical || "",
        },
        problemSolving: {
          score: scores.problemSolving,
          comment: comments.problemSolving || "",
        },
        confidence: {
          score: scores.confidence,
          comment: comments.confidence || "",
        },
      },
      notes: notes || "",
    };

    if (existingEvaluation) {
      // Update existing
      updateEvaluation.mutate({
        id: existingEvaluation._id,
        data: {
          ...evaluationData,
          isCompleted: true,
        },
      });
    } else {
      // Create new
      createEvaluation.mutate({
        sessionId,
        ...evaluationData,
      });
    }
  };

  const criteria = [
    {
      key: "communication",
      label: t("evaluations.communication", { defaultValue: "Communication" }),
    },
    {
      key: "technical",
      label: t("evaluations.technical", { defaultValue: "Technical Skills" }),
    },
    {
      key: "problemSolving",
      label: t("evaluations.problemSolving", {
        defaultValue: "Problem Solving",
      }),
    },
    {
      key: "confidence",
      label: t("evaluations.confidence", { defaultValue: "Confidence" }),
    },
  ];

  return (
    <Card className="rounded-none border-0 border-t h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <span>✍️</span>
          {t("sessions.liveEvaluation", { defaultValue: "Live Evaluation" })}
          {isSyncing && (
            <span className="text-xs text-secondary-500 ml-2">
              {t("sessions.syncing", { defaultValue: "Syncing..." })}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-4">
        {criteria.map((criterion) => (
          <div key={criterion.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">{criterion.label}</label>
              <span className="text-sm text-secondary-600">
                {scores[criterion.key]}/10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={scores[criterion.key]}
              onChange={(e) => handleScoreChange(criterion.key, e.target.value)}
              className="w-full"
            />
            <textarea
              value={comments[criterion.key]}
              onChange={(e) =>
                handleCommentChange(criterion.key, e.target.value)
              }
              placeholder={t("sessions.addComment", {
                defaultValue: "Add comment...",
              })}
              className="w-full p-2 border border-secondary-200 rounded-lg text-sm resize-none"
              rows="2"
            />
          </div>
        ))}

        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t("sessions.generalNotes", { defaultValue: "General Notes" })}
          </label>
          <textarea
            value={notes}
            onChange={(e) => {
              const newNotes = e.target.value;
              setNotes(newNotes);

              // Emit real-time update via Socket.io
              if (socket && sessionId) {
                socket.emit("evaluation-update", {
                  sessionId,
                  evaluationData: {
                    scores,
                    comments,
                    notes: newNotes,
                  },
                });
              }
            }}
            placeholder={t("sessions.notesPlaceholder", {
              defaultValue: "Additional notes...",
            })}
            className="w-full p-2 border border-secondary-200 rounded-lg text-sm resize-none"
            rows="3"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveDraft}
            disabled={updateEvaluation.isPending}
            className="flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            {t("sessions.saveDraft", { defaultValue: "Save Draft" })}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleSubmit}
            disabled={
              createEvaluation.isPending || updateEvaluation.isPending
            }
            className="flex-1"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            {t("sessions.submitEvaluation", {
              defaultValue: "Submit",
            })}
          </Button>
        </div>

        {existingEvaluation?.isCompleted && (
          <div className="p-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
            ✓ {t("sessions.evaluationSubmitted", {
              defaultValue: "Evaluation submitted",
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}




