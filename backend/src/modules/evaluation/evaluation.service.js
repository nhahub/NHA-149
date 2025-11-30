import Evaluation from "../../DB/models/evaluation.model.js";
import Session from "../../DB/models/session.model.js";
import { successResponse } from "../../utils/index.js";

// @desc    Create evaluation
// @route   POST /api/v1/evaluations
// @access  Private/Interviewer
export const createEvaluation = async (req, res, next) => {
  const { sessionId, criteria, notes } = req.body;

  // Check if session exists
  const session = await Session.findById(sessionId);
  if (!session) {
    throw new Error("Session not found", { cause: 404 });
  }

  // Allow creating evaluations during in-progress or completed sessions
  if (session.status !== "in-progress" && session.status !== "completed") {
    throw new Error("Session must be in progress or completed to create evaluation", {
      cause: 400,
    });
  }

  // Check if user is the interviewer
  if (session.interviewerId.toString() !== req.user._id.toString()) {
    throw new Error("Not authorized to evaluate this session", { cause: 403 });
  }

  // Check if evaluation already exists
  const existingEvaluation = await Evaluation.findOne({ sessionId });
  if (existingEvaluation) {
    throw new Error("Evaluation already exists for this session", {
      cause: 400,
    });
  }

  // Set isCompleted based on session status
  const isCompleted = session.status === "completed";

  // Calculate overallScore from criteria scores
  const scores = [
    criteria.communication?.score,
    criteria.technical?.score,
    criteria.problemSolving?.score,
    criteria.confidence?.score,
  ];
  
  // Validate all scores are present
  if (scores.some(score => score === undefined || score === null)) {
    throw new Error("All criterion scores are required", { cause: 400 });
  }

  const overallScore = Math.round(
    scores.reduce((sum, score) => sum + score, 0) / scores.length
  );

  const evaluation = await Evaluation.create({
    sessionId,
    candidateId: session.candidateId,
    interviewerId: session.interviewerId,
    criteria,
    notes,
    evaluationType: "manual",
    isCompleted,
    overallScore, // Set explicitly to ensure it's present
  });

  await evaluation.populate("sessionId", "date startTime endTime");
  await evaluation.populate("candidateId", "name email");
  await evaluation.populate("interviewerId", "name email");

  successResponse({
    res,
    message: "Evaluation created successfully",
    data: { evaluation },
    status: 201,
  });
};

// @desc    Get evaluation by session ID
// @route   GET /api/v1/evaluations/:sessionId
// @access  Private
export const getEvaluationBySession = async (req, res, next) => {
  const evaluation = await Evaluation.findOne({
    sessionId: req.params.sessionId,
  })
    .populate("sessionId", "date startTime endTime")
    .populate("candidateId", "name email avatarUrl")
    .populate("interviewerId", "name email avatarUrl");

  if (!evaluation) {
    throw new Error("Evaluation not found", { cause: 404 });
  }

  // Check if user is authorized to view this evaluation
  const isAuthorized =
    req.user.role === "admin" ||
    evaluation.candidateId._id.toString() === req.user._id.toString() ||
    evaluation.interviewerId._id.toString() === req.user._id.toString();

  if (!isAuthorized) {
    throw new Error("Not authorized to view this evaluation", { cause: 403 });
  }

  successResponse({
    res,
    message: "Evaluation retrieved successfully",
    data: { evaluation },
  });
};

// @desc    Update evaluation
// @route   PUT /api/v1/evaluations/:id
// @access  Private/Interviewer
export const updateEvaluation = async (req, res, next) => {
  const { criteria, notes, isCompleted } = req.body;

  const evaluation = await Evaluation.findById(req.params.id);
  if (!evaluation) {
    throw new Error("Evaluation not found", { cause: 404 });
  }

  // Check if user is the interviewer
  if (evaluation.interviewerId.toString() !== req.user._id.toString()) {
    throw new Error("Not authorized to update this evaluation", { cause: 403 });
  }

  const updateData = {};
  if (criteria) {
    updateData.criteria = criteria;
    // Recalculate overallScore if criteria is being updated
    const scores = [
      criteria.communication?.score,
      criteria.technical?.score,
      criteria.problemSolving?.score,
      criteria.confidence?.score,
    ];
    
    if (scores.every(score => score !== undefined && score !== null)) {
      updateData.overallScore = Math.round(
        scores.reduce((sum, score) => sum + score, 0) / scores.length
      );
    }
  }
  if (notes !== undefined) updateData.notes = notes;
  if (isCompleted !== undefined) updateData.isCompleted = isCompleted;

  const updatedEvaluation = await Evaluation.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  )
    .populate("sessionId", "date startTime endTime")
    .populate("candidateId", "name email")
    .populate("interviewerId", "name email");

  successResponse({
    res,
    message: "Evaluation updated successfully",
    data: { evaluation: updatedEvaluation },
  });
};

// @desc    Get my evaluations
// @route   GET /api/v1/evaluations/my
// @access  Private
export const getMyEvaluations = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  let query = {};

  if (req.user.role === "candidate") {
    query.candidateId = req.user._id;
  } else if (req.user.role === "interviewer") {
    query.interviewerId = req.user._id;
  } else {
    // Admin or other roles - return empty for now
    return successResponse({
      res,
      message: "Evaluations retrieved successfully",
      data: {
        evaluations: [],
        pagination: {
          current: parseInt(page),
          pages: 0,
          total: 0,
        },
      },
    });
  }

  const evaluations = await Evaluation.find(query)
    .populate("sessionId", "date startTime endTime")
    .populate("candidateId", "name email avatarUrl")
    .populate("interviewerId", "name email avatarUrl")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Evaluation.countDocuments(query);

  successResponse({
    res,
    message: "Evaluations retrieved successfully",
    data: {
      evaluations,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    },
  });
};

// @desc    Get evaluation statistics
// @route   GET /api/v1/evaluations/stats
// @access  Private/Admin
export const getEvaluationStats = async (req, res, next) => {
  const stats = await Evaluation.aggregate([
    {
      $group: {
        _id: null,
        totalEvaluations: { $sum: 1 },
        averageScore: { $avg: "$overallScore" },
        maxScore: { $max: "$overallScore" },
        minScore: { $min: "$overallScore" },
      },
    },
  ]);

  const criteriaStats = await Evaluation.aggregate([
    {
      $group: {
        _id: null,
        avgCommunication: { $avg: "$criteria.communication.score" },
        avgTechnical: { $avg: "$criteria.technical.score" },
        avgProblemSolving: { $avg: "$criteria.problemSolving.score" },
        avgConfidence: { $avg: "$criteria.confidence.score" },
      },
    },
  ]);

  successResponse({
    res,
    message: "Evaluation statistics retrieved successfully",
    data: {
      overall: stats[0] || {},
      criteria: criteriaStats[0] || {},
    },
  });
};
