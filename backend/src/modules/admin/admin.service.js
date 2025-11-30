import EducationalContent from "../../DB/models/educational-content.model.js";
import Evaluation from "../../DB/models/evaluation.model.js";
import Reservation from "../../DB/models/reservation.model.js";
import Schedule from "../../DB/models/schedule.model.js";
import Session from "../../DB/models/session.model.js";
import Slot from "../../DB/models/slot.model.js";
import User from "../../DB/models/user.model.js";
import { successResponse } from "../../utils/index.js";

const DAYS_IN_TREND_WINDOW = 7;

const buildDateRange = (days = DAYS_IN_TREND_WINDOW) => {
  const range = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);
    range.push(new Date(date));
  }
  return range;
};

const formatDateKey = (date) => date.toISOString().split("T")[0];

const mapAggregationToSeries = (aggregation, keys) => {
  const dictionary = aggregation.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  return keys.map((key) => dictionary[key] || 0);
};

export const getDashboard = async (req, res, next) => {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const trendRange = buildDateRange();
  const trendStart = trendRange[0];
  const trendKeys = trendRange.map((date) => formatDateKey(date));

  try {
    const [
      totalUsers,
      activeUsers,
      candidateCount,
      interviewerCount,
      adminCount,
      pendingInterviewersCount,
      totalReservations,
      pendingReservationsCount,
      acceptedReservationsCount,
      rejectedReservationsCount,
      totalSessions,
      completedSessionsCount,
      upcomingSessionsCount,
      totalSchedules,
      activeSchedulesCount,
      totalSlots,
      bookedSlotsCount,
      totalContent,
      publishedContentCount,
      evaluationAggregate,
      userTrendAggregation,
      reservationTrendAggregation,
      latestUsersRaw,
      latestReservationsRaw,
      upcomingSessionsRaw,
      pendingInterviewersRaw,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ role: "candidate" }),
      User.countDocuments({ role: "interviewer" }),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({
        role: "interviewer",
        isApproved: false,
        isActive: true,
      }),
      Reservation.countDocuments(),
      Reservation.countDocuments({ status: "pending" }),
      Reservation.countDocuments({ status: "accepted" }),
      Reservation.countDocuments({ status: "rejected" }),
      Session.countDocuments(),
      Session.countDocuments({ status: "completed" }),
      Session.countDocuments({
        status: { $in: ["scheduled", "in-progress"] },
        date: { $gte: startOfToday },
      }),
      Schedule.countDocuments(),
      Schedule.countDocuments({ isActive: true }),
      Slot.countDocuments(),
      Slot.countDocuments({ status: "booked" }),
      EducationalContent.countDocuments(),
      EducationalContent.countDocuments({ isPublished: true }),
      Evaluation.aggregate([
        {
          $group: {
            _id: null,
            averageScore: { $avg: "$overallScore" },
            totalEvaluations: { $sum: 1 },
          },
        },
      ]),
      User.aggregate([
        { $match: { createdAt: { $gte: trendStart } } },
        {
          $group: {
            _id: {
              $dateToString: { date: "$createdAt", format: "%Y-%m-%d" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Reservation.aggregate([
        { $match: { createdAt: { $gte: trendStart } } },
        {
          $group: {
            _id: {
              $dateToString: { date: "$createdAt", format: "%Y-%m-%d" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      User.find({})
        .sort({ createdAt: -1 })
        .limit(6)
        .select("name email role avatarUrl createdAt")
        .lean(),
      Reservation.find({})
        .sort({ createdAt: -1 })
        .limit(6)
        .populate("candidateId", "name avatarUrl")
        .populate("interviewerId", "name avatarUrl")
        .populate("slotId", "date startTime endTime")
        .lean(),
      Session.find({
        status: { $in: ["scheduled", "in-progress"] },
        date: { $gte: startOfToday },
      })
        .sort({ date: 1 })
        .limit(6)
        .populate("candidateId", "name avatarUrl")
        .populate("interviewerId", "name avatarUrl")
        .lean(),
      User.find({
        role: "interviewer",
        isApproved: false,
        isActive: true,
      })
        .sort({ createdAt: 1 })
        .limit(8)
        .select(
          "name email specialization yearsOfExperience avatarUrl createdAt cvUrl"
        )
        .lean(),
    ]);

    const evaluationStats = {
      total: evaluationAggregate[0]?.totalEvaluations || 0,
      averageScore: Number(
        (evaluationAggregate[0]?.averageScore || 0).toFixed(1)
      ),
    };

    const labels = trendRange.map((date) => date.toISOString());

    const userTrendSeries = mapAggregationToSeries(
      userTrendAggregation,
      trendKeys
    );
    const reservationTrendSeries = mapAggregationToSeries(
      reservationTrendAggregation,
      trendKeys
    );

    const latestUsers = latestUsersRaw.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    }));

    const recentReservations = latestReservationsRaw.map((reservation) => ({
      id: reservation._id,
      status: reservation.status,
      createdAt: reservation.createdAt,
      rejectionReason: reservation.rejectionReason || null,
      candidate: reservation.candidateId
        ? {
            id: reservation.candidateId._id,
            name: reservation.candidateId.name,
            avatarUrl: reservation.candidateId.avatarUrl,
          }
        : null,
      interviewer: reservation.interviewerId
        ? {
            id: reservation.interviewerId._id,
            name: reservation.interviewerId.name,
            avatarUrl: reservation.interviewerId.avatarUrl,
          }
        : null,
      slot: reservation.slotId
        ? {
            date: reservation.slotId.date,
            startTime: reservation.slotId.startTime,
            endTime: reservation.slotId.endTime,
          }
        : null,
    }));

    const upcomingSessions = upcomingSessionsRaw.map((session) => ({
      id: session._id,
      status: session.status,
      date: session.date,
      startTime: session.startTime,
      endTime: session.endTime,
      candidate: session.candidateId
        ? {
            id: session.candidateId._id,
            name: session.candidateId.name,
            avatarUrl: session.candidateId.avatarUrl,
          }
        : null,
      interviewer: session.interviewerId
        ? {
            id: session.interviewerId._id,
            name: session.interviewerId.name,
            avatarUrl: session.interviewerId.avatarUrl,
          }
        : null,
    }));

    const pendingInterviewers = pendingInterviewersRaw.map((interviewer) => ({
      id: interviewer._id,
      name: interviewer.name,
      email: interviewer.email,
      specialization: interviewer.specialization,
      yearsOfExperience: interviewer.yearsOfExperience,
      avatarUrl: interviewer.avatarUrl,
      cvUrl: interviewer.cvUrl,
      createdAt: interviewer.createdAt,
    }));

    successResponse({
      res,
      message: "Admin dashboard data loaded",
      data: {
        stats: {
          users: {
            total: totalUsers,
            active: activeUsers,
            candidates: candidateCount,
            interviewers: interviewerCount,
            admins: adminCount,
            pendingInterviewers: pendingInterviewersCount,
          },
          reservations: {
            total: totalReservations,
            pending: pendingReservationsCount,
            accepted: acceptedReservationsCount,
            rejected: rejectedReservationsCount,
          },
          sessions: {
            total: totalSessions,
            completed: completedSessionsCount,
            upcoming: upcomingSessionsCount,
          },
          schedules: {
            total: totalSchedules,
            active: activeSchedulesCount,
          },
          slots: {
            total: totalSlots,
            booked: bookedSlotsCount,
          },
          content: {
            total: totalContent,
            published: publishedContentCount,
          },
          evaluations: evaluationStats,
        },
        trends: {
          labels,
          users: userTrendSeries,
          reservations: reservationTrendSeries,
        },
        recent: {
          users: latestUsers,
          reservations: recentReservations,
          sessions: upcomingSessions,
        },
        pendingInterviewers,
        system: {
          lastUpdated: now.toISOString(),
          uptimeSeconds: Math.round(process.uptime()),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reservations (Admin only)
// @route   GET /api/v1/admin/reservations
// @access  Private/Admin
export const getAllReservations = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      search,
      interviewerId,
      candidateId,
      startDate,
      endDate,
    } = req.query;

    // Build query - get all reservations (admin has full access)
    let query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by interviewer
    if (interviewerId) {
      query.interviewerId = interviewerId;
    }

    // Filter by candidate
    if (candidateId) {
      query.candidateId = candidateId;
    }

    // Execute query - get all first (for search/date filtering)
    let reservations = await Reservation.find(query)
      .populate("slotId", "date startTime endTime status scheduleId")
      .populate("candidateId", "name email avatarUrl")
      .populate("interviewerId", "name email avatarUrl specialization")
      .sort({ createdAt: -1 });

    // Filter by search (name/email/specialization)
    if (search) {
      const searchLower = search.toLowerCase();
      reservations = reservations.filter((reservation) => {
        const candidateName =
          reservation.candidateId?.name?.toLowerCase() || "";
        const candidateEmail =
          reservation.candidateId?.email?.toLowerCase() || "";
        const interviewerName =
          reservation.interviewerId?.name?.toLowerCase() || "";
        const interviewerEmail =
          reservation.interviewerId?.email?.toLowerCase() || "";
        const interviewerSpecialization =
          reservation.interviewerId?.specialization?.toLowerCase() || "";

        return (
          candidateName.includes(searchLower) ||
          candidateEmail.includes(searchLower) ||
          interviewerName.includes(searchLower) ||
          interviewerEmail.includes(searchLower) ||
          interviewerSpecialization.includes(searchLower)
        );
      });
    }

    // Filter by date range (based on slot date)
    if (startDate || endDate) {
      reservations = reservations.filter((reservation) => {
        if (!reservation.slotId?.date) return false;
        const slotDate = new Date(reservation.slotId.date);
        if (startDate && slotDate < new Date(startDate)) return false;
        if (endDate && slotDate > new Date(endDate)) return false;
        return true;
      });
    }

    const total = reservations.length;

    // Apply pagination after filtering
    const paginatedReservations = reservations.slice(
      (page - 1) * limit,
      page * limit
    );

    successResponse({
      res,
      message: "Reservations retrieved successfully",
      data: {
        reservations: paginatedReservations,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total: total,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all slots (Admin only)
// @route   GET /api/v1/admin/slots
// @access  Private/Admin
export const getAllSlots = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      search,
      interviewerId,
      startDate,
      endDate,
    } = req.query;

    // Build query - get all slots (admin has full access)
    let query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by interviewer
    if (interviewerId) {
      query.interviewerId = interviewerId;
    }

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    // Execute query - get all first (for search filtering)
    let slots = await Slot.find(query)
      .populate("scheduleId", "title description date")
      .populate("interviewerId", "name email avatarUrl")
      .sort({ date: -1, startTime: 1 });

    // Filter by search (interviewer name, schedule title)
    if (search) {
      const searchLower = search.toLowerCase();
      slots = slots.filter((slot) => {
        const interviewerName = slot.interviewerId?.name?.toLowerCase() || "";
        const interviewerEmail = slot.interviewerId?.email?.toLowerCase() || "";
        const scheduleTitle = slot.scheduleId?.title?.toLowerCase() || "";

        return (
          interviewerName.includes(searchLower) ||
          interviewerEmail.includes(searchLower) ||
          scheduleTitle.includes(searchLower)
        );
      });
    }

    const total = slots.length;

    // Apply pagination after filtering
    const paginatedSlots = slots.slice((page - 1) * limit, page * limit);

    successResponse({
      res,
      message: "Slots retrieved successfully",
      data: {
        slots: paginatedSlots,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total: total,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete reservation (Admin only)
// @route   DELETE /api/v1/admin/reservations/:id
// @access  Private/Admin
export const deleteReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate("slotId")
      .populate("candidateId", "name email")
      .populate("interviewerId", "name email");

    if (!reservation) {
      throw new Error("Reservation not found", { cause: 404 });
    }

    // Admin can delete any reservation (no restriction)

    // Delete the reservation
    await Reservation.findByIdAndDelete(req.params.id);

    // Note: We don't delete the session or slot as they are historical records

    successResponse({
      res,
      message: "Reservation deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete slot (Admin only)
// @route   DELETE /api/v1/admin/slots/:id
// @access  Private/Admin
export const deleteSlot = async (req, res, next) => {
  try {
    const slot = await Slot.findById(req.params.id).populate("scheduleId");

    if (!slot) {
      throw new Error("Slot not found", { cause: 404 });
    }

    // Admin can delete any slot (no restriction)

    // Delete the slot
    await Slot.findByIdAndDelete(req.params.id);

    successResponse({
      res,
      message: "Slot deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all sessions (Admin only)
// @route   GET /api/v1/admin/sessions
// @access  Private/Admin
export const getAllSessions = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      search,
      interviewerId,
      candidateId,
      startDate,
      endDate,
    } = req.query;

    // Build query - get all sessions (admin has full access)
    let query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by interviewer
    if (interviewerId) {
      query.interviewerId = interviewerId;
    }

    // Filter by candidate
    if (candidateId) {
      query.candidateId = candidateId;
    }

    // Execute query - get all first (for search/date filtering)
    let sessions = await Session.find(query)
      .populate("candidateId", "name email avatarUrl")
      .populate("interviewerId", "name email avatarUrl")
      .populate("reservationId", "note status")
      .sort({ date: -1, startTime: 1 });

    // Filter by search (name/email)
    if (search) {
      const searchLower = search.toLowerCase();
      sessions = sessions.filter((session) => {
        const candidateName = session.candidateId?.name?.toLowerCase() || "";
        const candidateEmail = session.candidateId?.email?.toLowerCase() || "";
        const interviewerName = session.interviewerId?.name?.toLowerCase() || "";
        const interviewerEmail = session.interviewerId?.email?.toLowerCase() || "";

        return (
          candidateName.includes(searchLower) ||
          candidateEmail.includes(searchLower) ||
          interviewerName.includes(searchLower) ||
          interviewerEmail.includes(searchLower)
        );
      });
    }

    // Filter by date range
    if (startDate || endDate) {
      sessions = sessions.filter((session) => {
        if (!session.date) return false;
        const sessionDate = new Date(session.date);
        if (startDate && sessionDate < new Date(startDate)) return false;
        if (endDate && sessionDate > new Date(endDate)) return false;
        return true;
      });
    }

    const total = sessions.length;

    // Apply pagination after filtering
    const paginatedSessions = sessions.slice(
      (page - 1) * limit,
      page * limit
    );

    successResponse({
      res,
      message: "Sessions retrieved successfully",
      data: {
        sessions: paginatedSessions,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total: total,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete session (Admin only)
// @route   DELETE /api/v1/admin/sessions/:id
// @access  Private/Admin
export const deleteSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("candidateId", "name email")
      .populate("interviewerId", "name email");

    if (!session) {
      throw new Error("Session not found", { cause: 404 });
    }

    // Admin can delete any session (no restriction)

    // Delete the session
    await Session.findByIdAndDelete(req.params.id);

    successResponse({
      res,
      message: "Session deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
