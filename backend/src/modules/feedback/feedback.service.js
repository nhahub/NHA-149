import Feedback from "../../DB/models/feedback.model.js";
import Session from "../../DB/models/session.model.js";
import { successResponse } from "../../utils/index.js";

// @desc    Create feedback
// @route   POST /api/v1/feedbacks
// @access  Private
export const createFeedback = async (req, res, next) => {
  const {
    sessionId,
    text,
    feedbackType = "general",
    isPublic = false,
    isAnonymous = false,
  } = req.body;

  // Check if session exists
  const session = await Session.findById(sessionId);
  if (!session) {
    throw new Error("Session not found", { cause: 404 });
  }

  // Check if user is authorized to provide feedback
  const isAuthorized =
    req.user.role === "admin" ||
    session.candidateId.toString() === req.user._id.toString() ||
    session.interviewerId.toString() === req.user._id.toString();

  if (!isAuthorized) {
    throw new Error("Not authorized to provide feedback for this session", {
      cause: 403,
    });
  }

  const feedback = await Feedback.create({
    sessionId,
    text,
    createdBy: req.user._id,
    feedbackType,
    isPublic,
    isAnonymous,
  });

  await feedback.populate("sessionId", "date startTime endTime");
  await feedback.populate("createdBy", "name email");

  successResponse({
    res,
    message: "Feedback created successfully",
    data: { feedback },
    status: 201,
  });
};

// @desc    Get feedbacks by session ID
// @route   GET /api/v1/feedbacks/:sessionId
// @access  Private
export const getFeedbacksBySession = async (req, res, next) => {
  const session = await Session.findById(req.params.sessionId);
  if (!session) {
    throw new Error("Session not found", { cause: 404 });
  }

  // Check if user is authorized to view feedbacks
  const isAuthorized =
    req.user.role === "admin" ||
    session.candidateId.toString() === req.user._id.toString() ||
    session.interviewerId.toString() === req.user._id.toString();

  if (!isAuthorized) {
    throw new Error("Not authorized to view feedbacks for this session", {
      cause: 403,
    });
  }

  const feedbacks = await Feedback.find({ sessionId: req.params.sessionId })
    .populate("createdBy", "name email avatarUrl")
    .sort({ createdAt: -1 });

  successResponse({
    res,
    message: "Feedbacks retrieved successfully",
    data: { feedbacks },
  });
};

// @desc    Get my feedbacks
// @route   GET /api/v1/feedbacks/my
// @access  Private
export const getMyFeedbacks = async (req, res, next) => {
  const { feedbackType, isPublic } = req.query;

  let query = { createdBy: req.user._id };

  if (feedbackType) {
    query.feedbackType = feedbackType;
  }

  if (isPublic !== undefined) {
    query.isPublic = isPublic === "true";
  }

  const feedbacks = await Feedback.find(query)
    .populate("sessionId", "date startTime endTime")
    .populate("candidateId", "name email")
    .populate("interviewerId", "name email")
    .sort({ createdAt: -1 });

  successResponse({
    res,
    message: "My feedbacks retrieved successfully",
    data: { feedbacks },
  });
};

// @desc    Update feedback
// @route   PUT /api/v1/feedbacks/:id
// @access  Private
export const updateFeedback = async (req, res, next) => {
  const { text, feedbackType, isPublic, isAnonymous } = req.body;

  const feedback = await Feedback.findById(req.params.id);
  if (!feedback) {
    throw new Error("Feedback not found", { cause: 404 });
  }

  // Check if user is the creator
  if (feedback.createdBy.toString() !== req.user._id.toString()) {
    throw new Error("Not authorized to update this feedback", { cause: 403 });
  }

  const updatedFeedback = await Feedback.findByIdAndUpdate(
    req.params.id,
    { text, feedbackType, isPublic, isAnonymous },
    { new: true, runValidators: true }
  )
    .populate("sessionId", "date startTime endTime")
    .populate("createdBy", "name email");

  successResponse({
    res,
    message: "Feedback updated successfully",
    data: { feedback: updatedFeedback },
  });
};

// @desc    Delete feedback
// @route   DELETE /api/v1/feedbacks/:id
// @access  Private
export const deleteFeedback = async (req, res, next) => {
  const feedback = await Feedback.findById(req.params.id);
  if (!feedback) {
    throw new Error("Feedback not found", { cause: 404 });
  }

  // Check if user is the creator or admin
  if (
    feedback.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new Error("Not authorized to delete this feedback", { cause: 403 });
  }

  await Feedback.findByIdAndDelete(req.params.id);

  successResponse({
    res,
    message: "Feedback deleted successfully",
  });
};

// @desc    Get public feedbacks
// @route   GET /api/v1/feedbacks/public
// @access  Public
export const getPublicFeedbacks = async (req, res, next) => {
  const { feedbackType, page = 1, limit = 10 } = req.query;

  let query = { isPublic: true };

  if (feedbackType) {
    query.feedbackType = feedbackType;
  }

  const feedbacks = await Feedback.find(query)
    .populate("sessionId", "date")
    .populate("createdBy", "name")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Feedback.countDocuments(query);

  successResponse({
    res,
    message: "Public feedbacks retrieved successfully",
    data: {
      feedbacks,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    },
  });
};
