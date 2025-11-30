import InterviewQuestion from "../../DB/models/interview-question.model.js";
import SessionQuestion from "../../DB/models/session-question.model.js";
import { successResponse } from "../../utils/index.js";

// @desc    Get questions by specialization
// @route   GET /api/v1/interview-questions/:specialization
// @access  Private
export const getQuestionsBySpecialization = async (req, res, next) => {
  const { specialization } = req.params;
  const { category, difficulty } = req.query;

  let query = {
    specialization,
    isActive: true,
  };

  if (category) {
    query.category = category;
  }

  if (difficulty) {
    query.difficulty = difficulty;
  }

  const questions = await InterviewQuestion.find(query).sort({
    category: 1,
    difficulty: 1,
    createdAt: 1,
  });

  successResponse({
    res,
    message: "Questions retrieved successfully",
    data: { questions },
  });
};

// @desc    Get questions asked in a session
// @route   GET /api/v1/interview-questions/session/:sessionId
// @access  Private
export const getSessionQuestions = async (req, res, next) => {
  const { sessionId } = req.params;

  const sessionQuestions = await SessionQuestion.find({ sessionId })
    .populate("questionId")
    .sort({ askedAt: 1 });

  successResponse({
    res,
    message: "Session questions retrieved successfully",
    data: { questions: sessionQuestions },
  });
};

// @desc    Mark question as asked in session
// @route   POST /api/v1/interview-questions/session/:sessionId/ask
// @access  Private/Interviewer
export const markQuestionAsAsked = async (req, res, next) => {
  const { sessionId } = req.params;
  const { questionId, notes } = req.body;

  // Check if question was already asked in this session
  const existing = await SessionQuestion.findOne({
    sessionId,
    questionId,
  });

  if (existing) {
    // Update notes if provided
    if (notes) {
      existing.notes = notes;
      await existing.save();
    }

    successResponse({
      res,
      message: "Question already marked as asked",
      data: { sessionQuestion: existing },
    });
    return;
  }

  const sessionQuestion = await SessionQuestion.create({
    sessionId,
    questionId,
    notes,
  });

  await sessionQuestion.populate("questionId");

  successResponse({
    res,
    message: "Question marked as asked",
    data: { sessionQuestion },
    status: 201,
  });
};

// @desc    Create custom question (for interviewers)
// @route   POST /api/v1/interview-questions
// @access  Private/Interviewer
export const createQuestion = async (req, res, next) => {
  const { specialization, question, category, difficulty, suggestedAnswer } =
    req.body;

  const interviewQuestion = await InterviewQuestion.create({
    specialization,
    question,
    category: category || "technical",
    difficulty: difficulty || "medium",
    suggestedAnswer,
    createdBy: req.user._id,
  });

  successResponse({
    res,
    message: "Question created successfully",
    data: { question: interviewQuestion },
    status: 201,
  });
};





