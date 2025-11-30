import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import SlotCard from "./SlotCard";

export default function SlotsList({ slots, onBookSlot, bookedSlotIds = [] }) {
  const { t } = useTranslation();
  const [bookingSlotId, setBookingSlotId] = useState(null);

  const handleBook = async (slot) => {
    setBookingSlotId(slot._id);
    try {
      await onBookSlot(slot);
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
          {t("slots.noSlots")}
        </h3>
        <p className="mt-1 text-sm text-secondary-500">
          {t("slots.noSlotsDescription")}
        </p>
      </div>
    );
  }

  // Group slots by status for better organization
  const availableSlots = slots.filter((s) => s.status === "available");
  const pendingSlots = slots.filter((s) => s.status === "pending");
  const bookedSlots = slots.filter((s) => s.status === "booked");

  return (
    <div className="space-y-6">
      {availableSlots.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            {t("slots.availableSlots")} ({availableSlots.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableSlots.map((slot) => (
              <SlotCard
                key={slot._id}
                slot={slot}
                onBook={handleBook}
                isBooked={bookedSlotIds.includes(slot._id)}
                isLoading={bookingSlotId === slot._id}
              />
            ))}
          </div>
        </div>
      )}

      {pendingSlots.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-amber-700 mb-3 flex items-center gap-2">
            <span className="w-3 h-3 bg-amber-500 rounded-full"></span>
            {t("slots.pendingSlots")} ({pendingSlots.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingSlots.map((slot) => (
              <SlotCard
                key={slot._id}
                slot={slot}
                onBook={handleBook}
                isBooked={bookedSlotIds.includes(slot._id)}
                isLoading={bookingSlotId === slot._id}
              />
            ))}
          </div>
        </div>
      )}

      {bookedSlots.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            {t("slots.bookedSlots")} ({bookedSlots.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookedSlots.map((slot) => (
              <SlotCard
                key={slot._id}
                slot={slot}
                onBook={handleBook}
                isBooked={true}
                isLoading={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

SlotsList.propTypes = {
  slots: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
    })
  ),
  onBookSlot: PropTypes.func.isRequired,
  bookedSlotIds: PropTypes.arrayOf(PropTypes.string),
};
