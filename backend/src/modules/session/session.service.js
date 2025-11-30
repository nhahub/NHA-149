import Session from "../../DB/models/session.model.js";
import { successResponse } from "../../utils/index.js";

// @desc    Get my sessions
// @route   GET /api/v1/sessions/me
// @access  Private
export const getMySessions = async (req, res, next) => {
  const { status } = req.query;

  let query = {};

  if (req.user.role === "candidate") {
    query.candidateId = req.user._id;
  } else if (req.user.role === "interviewer") {
    query.interviewerId = req.user._id;
  }

  if (status) {
    query.status = status;
  }

  const sessions = await Session.find(query)
    .populate("candidateId", "name email avatarUrl")
    .populate("interviewerId", "name email avatarUrl")
    .populate("reservationId", "note")
    .sort({ date: 1, startTime: 1 });

  successResponse({
    res,
    message: "Sessions retrieved successfully",
    data: { sessions },
  });
};

// @desc    Get session by ID
// @route   GET /api/v1/sessions/:id
// @access  Private
export const getSessionById = async (req, res, next) => {
  const session = await Session.findById(req.params.id)
    .populate("candidateId", "name email avatarUrl")
    .populate("interviewerId", "name email avatarUrl")
    .populate("reservationId", "note");

  if (!session) {
    throw new Error("Session not found", { cause: 404 });
  }

  // Check if user is authorized to view this session
  const isAuthorized =
    req.user.role === "admin" ||
    session.candidateId._id.toString() === req.user._id.toString() ||
    session.interviewerId._id.toString() === req.user._id.toString();

  if (!isAuthorized) {
    throw new Error("Not authorized to view this session", { cause: 403 });
  }

  successResponse({
    res,
    message: "Session retrieved successfully",
    data: { session },
  });
};


// @desc    Start session
// @route   POST /api/v1/sessions/:id/start
// @access  Private/Interviewer
export const startSession = async (req, res, next) => {
  const session = await Session.findById(req.params.id);
  if (!session) {
    throw new Error("Session not found", { cause: 404 });
  }

  // Check if user is the interviewer
  if (session.interviewerId.toString() !== req.user._id.toString()) {
    throw new Error("Not authorized to start this session", { cause: 403 });
  }

  if (session.status !== "scheduled") {
    throw new Error("Session is not scheduled", { cause: 400 });
  }

  // WebRTC doesn't require pre-creating channels, but we can store session ID for reference
  if (!session.meetingLink) {
    session.meetingLink = `session-${session._id.toString()}`;
  }

  session.status = "in-progress";
  session.actualStartTime = new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
  await session.save();

  successResponse({
    res,
    message: "Session started successfully",
    data: { session },
  });
};

// @desc    Upload session recording
// @route   POST /api/v1/sessions/:id/recording
// @desc    Upload session recording
// @route   POST /api/v1/sessions/:id/recording
// @access  Private/Interviewer
export const uploadRecording = async (req, res, next) => {
  const session = await Session.findById(req.params.id);
  if (!session) {
    throw new Error("Session not found", { cause: 404 });
  }

  // Check if user is the interviewer
  if (session.interviewerId.toString() !== req.user._id.toString()) {
    throw new Error("Not authorized to upload recording for this session", {
      cause: 403,
    });
  }

  if (!req.file) {
    throw new Error("Please upload a recording file", { cause: 400 });
  }

  session.recordingUrl = req.file.path;
  await session.save();

  successResponse({
    res,
    message: "Recording uploaded successfully",
    data: { session },
  });
};

// @desc    Complete session
// @route   POST /api/v1/sessions/:id/complete
// @access  Private/Interviewer
export const completeSession = async (req, res, next) => {
  const { notes } = req.body;

  const session = await Session.findById(req.params.id);
  if (!session) {
    throw new Error("Session not found", { cause: 404 });
  }

  // Check if user is the interviewer
  if (session.interviewerId.toString() !== req.user._id.toString()) {
    throw new Error("Not authorized to complete this session", { cause: 403 });
  }

  if (session.status !== "in-progress") {
    throw new Error("Session is not in progress", { cause: 400 });
  }

  session.status = "completed";
  session.actualEndTime = new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
  session.notes = notes;
  await session.save();

  successResponse({
    res,
    message: "Session completed successfully",
    data: { session },
  });
};

// @desc    Cancel session
// @route   POST /api/v1/sessions/:id/cancel
// @access  Private
export const cancelSession = async (req, res, next) => {
  const { cancelledReason } = req.body;

  const session = await Session.findById(req.params.id);
  if (!session) {
    throw new Error("Session not found", { cause: 404 });
  }

  // Check if user is authorized to cancel
  const isAuthorized =
    req.user.role === "admin" ||
    session.candidateId.toString() === req.user._id.toString() ||
    session.interviewerId.toString() === req.user._id.toString();

  if (!isAuthorized) {
    throw new Error("Not authorized to cancel this session", { cause: 403 });
  }

  if (session.status === "completed") {
    throw new Error("Cannot cancel completed session", { cause: 400 });
  }

  session.status = "cancelled";
  session.cancelledReason = cancelledReason;
  await session.save();

  successResponse({
    res,
    message: "Session cancelled successfully",
    data: { session },
  });
};
