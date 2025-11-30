import moment from "moment";

/**
 * Generate time slots from a schedule
 * @param {Object} schedule - Schedule object with startTime, endTime, duration, breakTime
 * @returns {Array} Array of slot time objects with start and end times
 */
export const generateSlots = (schedule) => {
  const { startTime, endTime, duration, breakTime = 15 } = schedule;

  const slots = [];
  let currentTime = moment(startTime, "HH:mm");
  const endMoment = moment(endTime, "HH:mm");

  while (currentTime.isBefore(endMoment)) {
    const slotEnd = moment(currentTime).add(duration, "minutes");

    // Check if the slot end time exceeds the schedule end time
    if (slotEnd.isAfter(endMoment)) {
      break;
    }

    slots.push({
      startTime: currentTime.format("HH:mm"),
      endTime: slotEnd.format("HH:mm"),
    });

    // Move to next slot start time (slot duration + break time)
    currentTime = slotEnd.add(breakTime, "minutes");
  }

  return slots;
};

/**
 * Generate slots and create them in the database
 * @param {Object} schedule - Schedule object with all required fields
 * @param {Model} SlotModel - Mongoose Slot model
 * @returns {Promise<Array>} Array of created slot documents
 */
export const generateAndCreateSlots = async (schedule, SlotModel) => {
  const slotTimes = generateSlots(schedule);

  const slotDocuments = slotTimes.map((slotTime) => ({
    scheduleId: schedule._id,
    date: schedule.date,
    interviewerId: schedule.interviewerId,
    startTime: slotTime.startTime,
    endTime: slotTime.endTime,
    status: "available",
    maxCandidates: 1,
    currentCandidates: 0,
  }));

  // Create all slots in batch
  const createdSlots = await SlotModel.insertMany(slotDocuments);

  return createdSlots;
};

/**
 * Delete all slots for a schedule
 * @param {String} scheduleId - Schedule ID
 * @param {Model} SlotModel - Mongoose Slot model
 * @returns {Promise<Number>} Number of deleted slots
 */
export const deleteScheduleSlots = async (scheduleId, SlotModel) => {
  // Only delete available slots (don't delete slots with reservations)
  const result = await SlotModel.deleteMany({
    scheduleId,
    status: "available",
  });

  return result.deletedCount;
};

/**
 * Update schedule slots - delete old available ones and create new ones
 * @param {Object} schedule - Updated schedule object
 * @param {Model} SlotModel - Mongoose Slot model
 * @returns {Promise<Object>} Object with deletedCount and created slots
 */
export const updateScheduleSlots = async (schedule, SlotModel) => {
  // Delete old available slots
  const deletedCount = await deleteScheduleSlots(schedule._id, SlotModel);

  // Generate and create new slots
  const createdSlots = await generateAndCreateSlots(schedule, SlotModel);

  return {
    deletedCount,
    createdSlots,
  };
};
