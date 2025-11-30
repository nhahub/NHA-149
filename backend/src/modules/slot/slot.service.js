import Day from "../../DB/models/day.model.js";
import Slot from "../../DB/models/slot.model.js";
import { successResponse } from "../../utils/index.js";
import { isTimeSlotAvailable } from "../../utils/time.js";

// @desc    Create time slot
// @route   POST /api/v1/slots
// @access  Private/Interviewer
export const createSlot = async (req, res, next) => {
  const { dayId, startTime, endTime, maxCandidates = 1, notes } = req.body;

  // Check if day exists
  const day = await Day.findById(dayId);
  if (!day) {
    throw new Error("Interview day not found", { cause: 404 });
  }

  // Check for overlapping slots for the same interviewer
  const existingSlots = await Slot.find({
    dayId,
    interviewerId: req.user._id,
    status: { $in: ["available", "pending"] },
  });

  if (!isTimeSlotAvailable(startTime, endTime, existingSlots)) {
    throw new Error("Time slot overlaps with existing slot", { cause: 400 });
  }

  const slot = await Slot.create({
    dayId,
    startTime,
    endTime,
    interviewerId: req.user._id,
    maxCandidates,
    notes,
  });

  await slot.populate("dayId", "date title");
  await slot.populate("interviewerId", "name email");

  successResponse({
    res,
    message: "Time slot created successfully",
    data: { slot },
    status: 201,
  });
};

// @desc    Get slots by day
// @route   GET /api/v1/slots/:dayId
// @access  Public
export const getSlotsByDay = async (req, res, next) => {
  const { dayId } = req.params;
  const { status, interviewerId } = req.query;

  let query = { dayId };

  if (status) {
    query.status = status;
  }

  if (interviewerId) {
    query.interviewerId = interviewerId;
  }

  const slots = await Slot.find(query)
    .populate("dayId", "date title")
    .populate("interviewerId", "name email avatarUrl")
    .sort({ startTime: 1 });

  successResponse({
    res,
    message: "Time slots retrieved successfully",
    data: { slots },
  });
};

// @desc    Get slots by interviewer
// @route   GET /api/v1/slots/interviewer/:interviewerId
// @access  Public
export const getSlotsByInterviewer = async (req, res, next) => {
  const { interviewerId } = req.params;
  const { status, date, startDate, endDate } = req.query;

  let query = { interviewerId };

  // Filter by status - if status is "all" or not provided, show all slots
  // Otherwise, filter by the specified status
  if (status && status !== "all") {
    query.status = status;
  }
  // If no status or status is "all", don't filter by status (show all)

  // Filter by specific date or date range
  if (date) {
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
    query.date = { $gte: startOfDay, $lte: endOfDay };
  } else if (startDate || endDate) {
    query.date = {};
    if (startDate) {
      query.date.$gte = new Date(startDate);
    }
    if (endDate) {
      query.date.$lte = new Date(endDate);
    }
  } else {
    // By default, only show future slots (date >= today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    query.date = { $gte: today };
  }

  let slots = await Slot.find(query)
    .populate("scheduleId", "date title description")
    .populate("interviewerId", "name email avatarUrl")
    .sort({ date: 1, startTime: 1 });

  // Filter out past slots (slots where date = today AND startTime has passed)
  // This is needed because MongoDB can't directly compare date + time string
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const currentTime = now.toTimeString().slice(0, 5); // "HH:MM" format

  // Check if the query includes today's date
  let shouldFilterPastSlots = false;
  if (!date && !startDate && !endDate) {
    // No date filter - default behavior: filter past slots
    shouldFilterPastSlots = true;
  } else if (date) {
    // Specific date provided - filter if it's today
    const targetDate = new Date(date);
    const targetDateOnly = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate()
    );
    shouldFilterPastSlots = targetDateOnly.getTime() === today.getTime();
  } else {
    // Date range provided - filter if range includes today
    const rangeStart = startDate ? new Date(startDate) : null;
    const rangeEnd = endDate ? new Date(endDate) : null;
    if (
      (!rangeStart || rangeStart <= today) &&
      (!rangeEnd || rangeEnd >= today)
    ) {
      shouldFilterPastSlots = true;
    }
  }

  if (shouldFilterPastSlots) {
    slots = slots.filter((slot) => {
      const slotDate = new Date(slot.date);
      const slotDateOnly = new Date(
        slotDate.getFullYear(),
        slotDate.getMonth(),
        slotDate.getDate()
      );

      // If slot is in the future (date > today), show it
      if (slotDateOnly > today) {
        return true;
      }

      // If slot is today, check if startTime hasn't passed
      if (slotDateOnly.getTime() === today.getTime()) {
        return slot.startTime >= currentTime;
      }

      // If slot is in the past, hide it
      return false;
    });
  }

  successResponse({
    res,
    message: "Time slots retrieved successfully",
    data: { slots },
  });
};

// @desc    Get my slots (for interviewers)
// @route   GET /api/v1/slots/my
// @access  Private/Interviewer
export const getMySlots = async (req, res, next) => {
  const { status, dayId } = req.query;

  let query = { interviewerId: req.user._id };

  if (status) {
    query.status = status;
  }

  if (dayId) {
    query.dayId = dayId;
  }

  const slots = await Slot.find(query)
    .populate("dayId", "date title")
    .sort({ "dayId.date": 1, startTime: 1 });

  successResponse({
    res,
    message: "My time slots retrieved successfully",
    data: { slots },
  });
};

// @desc    Update time slot
// @route   PUT /api/v1/slots/:id
// @access  Private/Interviewer
export const updateSlot = async (req, res, next) => {
  const { startTime, endTime, maxCandidates, notes, status } = req.body;

  const slot = await Slot.findById(req.params.id);
  if (!slot) {
    throw new Error("Time slot not found", { cause: 404 });
  }

  // Check if user owns this slot
  if (slot.interviewerId.toString() !== req.user._id.toString()) {
    throw new Error("Not authorized to update this slot", { cause: 403 });
  }

  // Check for overlapping slots if time is being changed
  if (startTime || endTime) {
    const newStartTime = startTime || slot.startTime;
    const newEndTime = endTime || slot.endTime;

    const existingSlots = await Slot.find({
      dayId: slot.dayId,
      interviewerId: req.user._id,
      _id: { $ne: slot._id },
      status: { $in: ["available", "pending"] },
    });

    if (!isTimeSlotAvailable(newStartTime, newEndTime, existingSlots)) {
      throw new Error("Time slot overlaps with existing slot", { cause: 400 });
    }
  }

  const updatedSlot = await Slot.findByIdAndUpdate(
    req.params.id,
    { startTime, endTime, maxCandidates, notes, status },
    { new: true, runValidators: true }
  )
    .populate("dayId", "date title")
    .populate("interviewerId", "name email");

  successResponse({
    res,
    message: "Time slot updated successfully",
    data: { slot: updatedSlot },
  });
};

// @desc    Delete time slot
// @route   DELETE /api/v1/slots/:id
// @access  Private/Interviewer
export const deleteSlot = async (req, res, next) => {
  const slot = await Slot.findById(req.params.id);
  if (!slot) {
    throw new Error("Time slot not found", { cause: 404 });
  }

  // Check if user owns this slot
  if (slot.interviewerId.toString() !== req.user._id.toString()) {
    throw new Error("Not authorized to delete this slot", { cause: 403 });
  }

  // Check if slot has reservations
  if (slot.status === "booked") {
    throw new Error("Cannot delete slot with existing reservations", {
      cause: 400,
    });
  }

  await Slot.findByIdAndDelete(req.params.id);

  successResponse({
    res,
    message: "Time slot deleted successfully",
  });
};
