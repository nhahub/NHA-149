import moment from "moment";

export const formatDate = (date, format = "YYYY-MM-DD") => {
  return moment(date).format(format);
};

export const formatTime = (time) => {
  return moment(time, "HH:mm").format("h:mm A");
};

export const isTimeSlotAvailable = (startTime, endTime, existingSlots) => {
  const start = moment(startTime, "HH:mm");
  const end = moment(endTime, "HH:mm");

  for (const slot of existingSlots) {
    const slotStart = moment(slot.startTime, "HH:mm");
    const slotEnd = moment(slot.endTime, "HH:mm");

    if (start.isBefore(slotEnd) && end.isAfter(slotStart)) {
      return false;
    }
  }

  return true;
};

export const calculateDuration = (startTime, endTime) => {
  const start = moment(startTime, "HH:mm");
  const end = moment(endTime, "HH:mm");
  return end.diff(start, "minutes");
};
