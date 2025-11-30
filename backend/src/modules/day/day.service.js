import Day from "../../DB/models/day.model.js";
import { successResponse } from "../../utils/index.js";

// @desc    Create interview day
// @route   POST /api/v1/days
// @access  Private/Admin
export const createDay = async (req, res, next) => {
  const { date, title, description } = req.body;

  const day = await Day.create({
    date,
    title,
    description,
    createdBy: req.user._id,
  });

  successResponse({
    res,
    message: "Interview day created successfully",
    data: { day },
    status: 201,
  });
};

// @desc    Get all interview days
// @route   GET /api/v1/days
// @access  Public
export const getDays = async (req, res, next) => {
  const { page = 1, limit = 10, active } = req.query;

  let query = {};
  if (active === "true") {
    query.isActive = true;
  }

  const days = await Day.find(query)
    .populate("createdBy", "name email")
    .sort({ date: 1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Day.countDocuments(query);

  successResponse({
    res,
    message: "Interview days retrieved successfully",
    data: {
      days,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    },
  });
};

// @desc    Get day by ID
// @route   GET /api/v1/days/:id
// @access  Public
export const getDayById = async (req, res, next) => {
  const day = await Day.findById(req.params.id).populate(
    "createdBy",
    "name email"
  );

  if (!day) {
    throw new Error("Interview day not found", { cause: 404 });
  }

  successResponse({
    res,
    message: "Interview day retrieved successfully",
    data: { day },
  });
};

// @desc    Update interview day
// @route   PUT /api/v1/days/:id
// @access  Private/Admin
export const updateDay = async (req, res, next) => {
  const { title, description, isActive } = req.body;

  const day = await Day.findByIdAndUpdate(
    req.params.id,
    { title, description, isActive },
    { new: true, runValidators: true }
  );

  if (!day) {
    throw new Error("Interview day not found", { cause: 404 });
  }

  successResponse({
    res,
    message: "Interview day updated successfully",
    data: { day },
  });
};

// @desc    Delete interview day
// @route   DELETE /api/v1/days/:id
// @access  Private/Admin
export const deleteDay = async (req, res, next) => {
  const day = await Day.findByIdAndDelete(req.params.id);

  if (!day) {
    throw new Error("Interview day not found", { cause: 404 });
  }

  successResponse({
    res,
    message: "Interview day deleted successfully",
  });
};
