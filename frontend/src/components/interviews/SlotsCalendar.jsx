import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { formatTime } from "../../utils/helpers.js";

// Helper function to format date
const formatDate = (dateString, locale) => {
  const date = new Date(dateString);
  const options = { weekday: "short", month: "short", day: "numeric" };
  return date.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", options);
};

// Helper function to group slots by date
const groupSlotsByDate = (slots) => {
  const grouped = {};

  slots.forEach((slot) => {
    const dateKey = new Date(slot.date).toDateString();
    if (!grouped[dateKey]) {
      grouped[dateKey] = {
        date: slot.date,
        slots: [],
      };
    }
    grouped[dateKey].slots.push(slot);
  });

  // Sort slots within each day by start time
  Object.values(grouped).forEach((day) => {
    day.slots.sort((a, b) => {
      const timeA = a.startTime.split(":").map(Number);
      const timeB = b.startTime.split(":").map(Number);
      return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
    });
  });

  // Convert to array and sort by date
  return Object.values(grouped).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
};

export default function SlotsCalendar({
  slots,
  onBookSlot,
  bookedSlotIds = [],
  pendingReservationSlotIds = [],
  acceptedReservationSlotIds = [], // eslint-disable-line no-unused-vars
}) {
  const { t, i18n } = useTranslation();
  const [bookingSlotId, setBookingSlotId] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleSlotClick = (slot) => {
    if (slot.status !== "available") return;
    if (bookedSlotIds.includes(slot._id)) return;
    setSelectedSlot(slot);
  };

  const handleBookNow = async () => {
    if (!selectedSlot) return;

    setBookingSlotId(selectedSlot._id);
    try {
      await onBookSlot(selectedSlot);
      setSelectedSlot(null);
    } finally {
      setBookingSlotId(null);
    }
  };

  if (!slots || slots.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-secondary-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-secondary-900">
          {t("interviews.noSlotsAvailable")}
        </h3>
      </div>
    );
  }

  const groupedSlots = groupSlotsByDate(slots);

  // Get date range for header
  const firstDate = groupedSlots[0]?.date;
  const lastDate = groupedSlots[groupedSlots.length - 1]?.date;
  const dateRangeText =
    firstDate && lastDate
      ? `${formatDate(firstDate, i18n.language)} - ${formatDate(
          lastDate,
          i18n.language
        )}`
      : "";

  // Get slot class based on status
  // Priority: pending reservations (amber), slot status, then accepted reservations (red)
  const getSlotClass = (slot) => {
    // First check if slot has a pending reservation (should be amber/orange)
    if (pendingReservationSlotIds.includes(slot._id)) {
      return "bg-amber-100 text-amber-900 border border-amber-200 cursor-not-allowed font-medium";
    }
    // Then check the slot's actual status
    if (slot.status === "pending") {
      return "bg-amber-100 text-amber-900 border border-amber-200 cursor-not-allowed font-medium";
    }
    if (slot.status === "booked") {
      return "bg-red-500 text-white cursor-not-allowed font-medium";
    }
    // If slot is available but has an accepted reservation (bookedSlotIds), show as red
    if (bookedSlotIds.includes(slot._id)) {
      return "bg-red-500 text-white cursor-not-allowed font-medium";
    }
    // Selected slot highlight
    if (selectedSlot?._id === slot._id) {
      return "bg-cyan-600 text-white cursor-pointer hover:bg-cyan-700 shadow-lg font-semibold";
    }
    // Available slot
    return "bg-cyan-100 text-cyan-900 hover:bg-cyan-200 cursor-pointer border border-cyan-300 font-medium";
  };

  return (
    <div className="space-y-6">
      {/* Color Legend */}
      <div className="bg-white rounded-lg border border-secondary-200 p-4 shadow-sm">
        <h4 className="text-sm font-semibold text-secondary-700 mb-3">
          {t("slots.colorLegend")}:
        </h4>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-cyan-100 border border-cyan-300"></div>
            <span className="text-secondary-600">
              {t("slots.availableSlot")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-100 border border-amber-200"></div>
            <span className="text-secondary-600">{t("slots.pendingSlot")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500"></div>
            <span className="text-secondary-600">{t("slots.bookedSlot")}</span>
          </div>
        </div>
      </div>

      {/* Date Range Header */}
      {dateRangeText && (
        <div className="text-center text-sm font-medium text-secondary-600 mb-4">
          {dateRangeText}
        </div>
      )}

      {/* Slots Grid - Days in Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {groupedSlots.map((day, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-secondary-200 overflow-hidden shadow-sm"
          >
            {/* Day Header */}
            <div className="bg-cyan-600 px-4 py-3 border-b border-cyan-700">
              <h3 className="text-center font-semibold text-white mb-1">
                {formatDate(day.date, i18n.language)}
              </h3>
              {/* Show schedule title if available (from first slot) */}
              {day.slots[0]?.scheduleId?.title && (
                <p className="text-center text-xs text-cyan-100 mt-1 line-clamp-1">
                  {day.slots[0].scheduleId.title}
                </p>
              )}
            </div>

            {/* Slots */}
            <div className="p-3 space-y-2 bg-white">
              {day.slots.map((slot) => (
                <button
                  key={slot._id}
                  onClick={() => handleSlotClick(slot)}
                  disabled={
                    slot.status !== "available" ||
                    bookedSlotIds.includes(slot._id)
                  }
                  className={`w-full px-4 py-2.5 rounded-md text-sm font-medium transition-all ${getSlotClass(
                    slot
                  )}`}
                >
                  {formatTime(slot.startTime)}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Slot Info & Book Button - Below the grid */}
      {selectedSlot && (
        <div className="bg-cyan-50 rounded-lg border-2 border-cyan-600 p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-start flex-1">
              <h4 className="font-semibold text-lg text-cyan-900 mb-2">
                {t("slots.slotSelected")}
              </h4>
              {/* Schedule Title and Description */}
              {selectedSlot.scheduleId?.title && (
                <div className="mb-3">
                  <h5 className="font-semibold text-cyan-900 text-base mb-1">
                    {selectedSlot.scheduleId.title}
                  </h5>
                  {selectedSlot.scheduleId.description && (
                    <p className="text-sm text-cyan-700">
                      {selectedSlot.scheduleId.description}
                    </p>
                  )}
                </div>
              )}
              <p className="text-cyan-800 font-medium">
                📅 {formatDate(selectedSlot.date, i18n.language)}
              </p>
              <p className="text-cyan-800 font-medium">
                ⏰ {formatTime(selectedSlot.startTime)} -{" "}
                {formatTime(selectedSlot.endTime)}
              </p>
              {selectedSlot.notes && (
                <p className="text-sm text-cyan-700 mt-1">
                  {selectedSlot.notes}
                </p>
              )}
            </div>
            <button
              onClick={handleBookNow}
              disabled={bookingSlotId === selectedSlot._id}
              className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all disabled:cursor-not-allowed"
            >
              {bookingSlotId === selectedSlot._id
                ? t("common.loading") + "..."
                : t("slots.bookNow")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

SlotsCalendar.propTypes = {
  slots: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      startTime: PropTypes.string.isRequired,
      endTime: PropTypes.string.isRequired,
      status: PropTypes.oneOf(["available", "pending", "booked"]).isRequired,
      notes: PropTypes.string,
    })
  ),
  onBookSlot: PropTypes.func.isRequired,
  bookedSlotIds: PropTypes.arrayOf(PropTypes.string),
  pendingReservationSlotIds: PropTypes.arrayOf(PropTypes.string),
  acceptedReservationSlotIds: PropTypes.arrayOf(PropTypes.string),
};
