import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Circle, Plus, X } from "lucide-react";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Input } from "../ui/Input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  interviewQuestionsAPI,
  sessionsAPI,
} from "../../api/index.js";
import toast from "react-hot-toast";

export default function QuestionsSidebar({ sessionId, specialization }) {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [customQuestion, setCustomQuestion] = useState("");

  // Fetch questions for specialization
  const { data: questions = [] } = useQuery({
    queryKey: ["interview-questions", specialization],
    queryFn: () =>
      interviewQuestionsAPI.getQuestionsBySpecialization(specialization),
    select: (response) => response.data.data.questions,
    enabled: !!specialization,
  });

  // Fetch asked questions
  const { data: askedQuestions = [] } = useQuery({
    queryKey: ["session-questions", sessionId],
    queryFn: () => interviewQuestionsAPI.getSessionQuestions(sessionId),
    select: (response) => response.data.data.questions,
    enabled: !!sessionId,
  });

  const markAsAsked = useMutation({
    mutationFn: ({ questionId, notes }) =>
      interviewQuestionsAPI.markQuestionAsAsked(sessionId, {
        questionId,
        notes,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["session-questions", sessionId]);
      toast.success(
        t("sessions.questionMarked", { defaultValue: "Question marked as asked" })
      );
    },
  });

  const askedQuestionIds = askedQuestions.map((sq) => sq.questionId._id);

  const filteredQuestions = questions.filter((q) => {
    if (selectedCategory === "all") return true;
    return q.category === selectedCategory;
  });

  const handleMarkAsAsked = (questionId) => {
    markAsAsked.mutate({ questionId });
  };

  const handleAddCustomQuestion = () => {
    if (!customQuestion.trim()) return;
    // For now, just show a toast - you can implement custom question creation later
    toast.success(
      t("sessions.customQuestionAdded", {
        defaultValue: "Custom question added (feature coming soon)",
      })
    );
    setCustomQuestion("");
  };

  const categories = [
    { value: "all", label: t("sessions.allCategories", { defaultValue: "All" }) },
    {
      value: "technical",
      label: t("sessions.technical", { defaultValue: "Technical" }),
    },
    {
      value: "behavioral",
      label: t("sessions.behavioral", { defaultValue: "Behavioral" }),
    },
    {
      value: "problem-solving",
      label: t("sessions.problemSolving", { defaultValue: "Problem Solving" }),
    },
    {
      value: "system-design",
      label: t("sessions.systemDesign", { defaultValue: "System Design" }),
    },
  ];

  return (
    <div className="h-full flex flex-col bg-white border-l border-secondary-200">
      <Card className="rounded-none border-0 border-b h-full flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span>📋</span>
            {t("sessions.interviewQuestions", {
              defaultValue: "Interview Questions",
            })}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-4">
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.value)}
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {/* Questions List */}
          <div className="space-y-2">
            {filteredQuestions.length === 0 ? (
              <p className="text-sm text-secondary-500 text-center py-4">
                {t("sessions.noQuestions", {
                  defaultValue: "No questions available",
                })}
              </p>
            ) : (
              filteredQuestions.map((question) => {
                const isAsked = askedQuestionIds.includes(question._id);
                const questionText =
                  question.question[i18n.language] || question.question.en;

                return (
                  <div
                    key={question._id}
                    className={`p-3 rounded-lg border ${
                      isAsked
                        ? "bg-green-50 border-green-200"
                        : "bg-secondary-50 border-secondary-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm flex-1">{questionText}</p>
                      <button
                        onClick={() => handleMarkAsAsked(question._id)}
                        className="flex-shrink-0"
                        disabled={isAsked}
                      >
                        {isAsked ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-secondary-400 hover:text-primary-500" />
                        )}
                      </button>
                    </div>
                    {isAsked && (
                      <p className="text-xs text-green-600 mt-1">
                        {t("sessions.asked", { defaultValue: "Asked" })}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Custom Question Input */}
          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-2">
              {t("sessions.addCustomQuestion", {
                defaultValue: "Add Custom Question",
              })}
            </p>
            <div className="flex gap-2">
              <Input
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder={t("sessions.questionPlaceholder", {
                  defaultValue: "Enter your question...",
                })}
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={handleAddCustomQuestion}
                disabled={!customQuestion.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}





