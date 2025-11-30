import Schedule from "../../DB/models/schedule.model.js";
import Slot from "../../DB/models/slot.model.js";
import { successResponse } from "../../utils/index.js";
import {
  deleteScheduleSlots,
  generateAndCreateSlots,
  updateScheduleSlots,
} from "../../utils/slot-generator.js";

// @desc    Create schedule with auto slot generation
// @route   POST /api/v1/schedules
// @access  Private/Interviewer
export const createSchedule = async (req, res, next) => {
  const {
    date,
    startTime,
    endTime,
    duration,
    breakTime = 15,
    title,
    description,
  } = req.body;

  // Parse and validate date
  const scheduleDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (scheduleDate < today) {
    throw new Error("Schedule date must be in the future", { cause: 400 });
  }

  // Check if interviewer already has a schedule for this date
  const startOfDay = new Date(scheduleDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(scheduleDate);
  endOfDay.setHours(23, 59, 59, 999);

  const existingSchedule = await Schedule.findOne({
    interviewerId: req.user._id,
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });

  if (existingSchedule) {
    throw new Error("You already have a schedule for this date", {
      cause: 400,
    });
  }

  // Create schedule
  const schedule = await Schedule.create({
    interviewerId: req.user._id,
    date: scheduleDate,
    startTime,
    endTime,
    duration,
    breakTime,
    title,
    description,
  });

  // Generate and create slots automatically
  const slots = await generateAndCreateSlots(schedule, Slot);

  await schedule.populate("interviewerId", "name email avatarUrl");

  successResponse({
    res,
    message: "Schedule created successfully with auto-generated slots",
    data: {
      schedule,
      slotsGenerated: slots.length,
      slots,
    },
    status: 201,
  });
};

// @desc    Get all schedules
// @route   GET /api/v1/schedules
// @access  Public
export const getSchedules = async (req, res, next) => {
  const { date, interviewerId, isActive } = req.query;

  let query = {};

  if (date) {
    // Query for schedules on a specific date
    const queryDate = new Date(date);
    const startOfDay = new Date(queryDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(queryDate);
    endOfDay.setHours(23, 59, 59, 999);

    query.date = {
      $gte: startOfDay,
      $lte: endOfDay,
    };
  }

  if (interviewerId) {
    query.interviewerId = interviewerId;
  }

  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }

  const schedules = await Schedule.find(query)
    .populate("interviewerId", "name email avatarUrl specialization")
    .sort({ createdAt: -1 });

  successResponse({
    res,
    message: "Schedules retrieved successfully",
    data: { schedules },
  });
};

// @desc    Get schedules by date
// @route   GET /api/v1/schedules/date/:date
// @access  Public
export const getSchedulesByDate = async (req, res, next) => {
  const { date } = req.params;

  // Parse date and create range for the full day
  const queryDate = new Date(date);
  const startOfDay = new Date(queryDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(queryDate);
  endOfDay.setHours(23, 59, 59, 999);

  const schedules = await Schedule.find({
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    isActive: true,
  })
    .populate("interviewerId", "name email avatarUrl specialization")
    .sort({ startTime: 1 });

  successResponse({
    res,
    message: "Schedules retrieved successfully",
    data: { schedules },
  });
};

// @desc    Get my schedules (for interviewers)
// @route   GET /api/v1/schedules/my
// @access  Private/Interviewer
export const getMySchedules = async (req, res, next) => {
  const { date, isActive } = req.query;

  let query = { interviewerId: req.user._id };

  if (date) {
    // Query for schedules on a specific date
    const queryDate = new Date(date);
    const startOfDay = new Date(queryDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(queryDate);
    endOfDay.setHours(23, 59, 59, 999);

    query.date = {
      $gte: startOfDay,
      $lte: endOfDay,
    };
  }

  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }

  const schedules = await Schedule.find(query).sort({ createdAt: -1 });

  successResponse({
    res,
    message: "My schedules retrieved successfully",
    data: { schedules },
  });
};

// @desc    Get schedule by ID
// @route   GET /api/v1/schedules/:id
// @access  Public
export const getScheduleById = async (req, res, next) => {
  const schedule = await Schedule.findById(req.params.id).populate(
    "interviewerId",
    "name email avatarUrl specialization"
  );

  if (!schedule) {
    throw new Error("Schedule not found", { cause: 404 });
  }

  // Get slots for this schedule
  const slots = await Slot.find({
    scheduleId: schedule._id,
  }).sort({ startTime: 1 });

  successResponse({
    res,
    message: "Schedule retrieved successfully",
    data: {
      schedule,
      slots,
    },
  });
};

// @desc    Update schedule
// @route   PUT /api/v1/schedules/:id
// @access  Private/Interviewer
export const updateSchedule = async (req, res, next) => {
  const schedule = await Schedule.findById(req.params.id);

  if (!schedule) {
    throw new Error("Schedule not found", { cause: 404 });
  }

  // Check if user owns this schedule
  if (schedule.interviewerId.toString() !== req.user._id.toString()) {
    throw new Error("Not authorized to update this schedule", { cause: 403 });
  }

  // Check if there are any booked slots before allowing time/duration changes
  if (req.body.startTime || req.body.endTime || req.body.duration) {
    const bookedSlots = await Slot.findOne({
      scheduleId: schedule._id,
      status: "booked",
    });

    if (bookedSlots) {
      throw new Error(
        "Cannot modify schedule times when there are booked slots. Cancel bookings first.",
        { cause: 400 }
      );
    }
  }

  // Update schedule
  Object.assign(schedule, req.body);
  await schedule.save();

  // If time or duration changed, regenerate slots
  if (
    req.body.startTime ||
    req.body.endTime ||
    req.body.duration ||
    req.body.breakTime
  ) {
    await updateScheduleSlots(schedule, Slot);
  }

  await schedule.populate("interviewerId", "name email avatarUrl");

  successResponse({
    res,
    message: "Schedule updated successfully",
    data: { schedule },
  });
};

// @desc    Delete schedule
// @route   DELETE /api/v1/schedules/:id
// @access  Private/Interviewer
export const deleteSchedule = async (req, res, next) => {
  const schedule = await Schedule.findById(req.params.id);

  if (!schedule) {
    throw new Error("Schedule not found", { cause: 404 });
  }

  // Check if user owns this schedule
  if (schedule.interviewerId.toString() !== req.user._id.toString()) {
    throw new Error("Not authorized to delete this schedule", { cause: 403 });
  }

  // Check if there are any booked/pending slots
  const bookedSlots = await Slot.findOne({
    scheduleId: schedule._id,
    status: { $in: ["booked", "pending"] },
  });

  if (bookedSlots) {
    throw new Error("Cannot delete schedule with booked or pending slots", {
      cause: 400,
    });
  }

  // Delete all available slots
  await deleteScheduleSlots(schedule._id, Slot);

  // Delete schedule
  await Schedule.findByIdAndDelete(req.params.id);

  successResponse({
    res,
    message: "Schedule and associated slots deleted successfully",
  });
};

// @desc    Upload schedule image
// @route   PUT /api/v1/schedules/:id/image
// @access  Private/Interviewer
export const uploadScheduleImage = async (req, res, next) => {
  if (!req.file) {
    throw new Error("Please upload an image file", { cause: 400 });
  }

  const schedule = await Schedule.findById(req.params.id);

  if (!schedule) {
    throw new Error("Schedule not found", { cause: 404 });
  }

  // Check if user owns this schedule
  if (schedule.interviewerId.toString() !== req.user._id.toString()) {
    throw new Error("Not authorized to update this schedule", { cause: 403 });
  }

  schedule.imageUrl = req.file.path;
  schedule.imagePublicId = req.file.filename;
  await schedule.save();

  successResponse({
    res,
    message: "Schedule image uploaded successfully",
    data: { schedule },
  });
};
