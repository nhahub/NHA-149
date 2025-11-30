import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { formatTime } from "../../utils/helpers.js";
import { Button } from "../ui/Button";

export default function SlotCard({ slot, onBook, isBooked, isLoading }) {
  const { t } = useTranslation();

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "booked":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-secondary-100 text-secondary-800 border-secondary-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "available":
        return t("slots.available");
      case "pending":
        return t("slots.pending");
      case "booked":
        return t("slots.booked");
      default:
        return status;
    }
  };

  const isAvailable = slot.status === "available";
  const isPending = slot.status === "pending";
  const isBooked = slot.status === "booked";

  // Get card styling based on status
  const getCardStyles = () => {
    if (isAvailable) {
      return "border-green-200 bg-green-50 hover:border-green-400 hover:shadow-md";
    } else if (isPending) {
      return "border-amber-200 bg-amber-50";
    } else if (isBooked) {
      return "border-red-200 bg-red-50";
    }
    return "border-secondary-200 bg-secondary-50";
  };

  // Get icon color based on status
  const getIconColor = () => {
    if (isAvailable) return "text-green-600";
    if (isPending) return "text-amber-700";
    if (isBooked) return "text-red-600";
    return "text-secondary-400";
  };

  // Get text color based on status
  const getTextColor = () => {
    if (isAvailable) return "text-green-900";
    if (isPending) return "text-amber-900";
    if (isBooked) return "text-red-900";
    return "text-secondary-600";
  };

  return (
    <div
      className={`p-4 rounded-lg border-2 transition-all ${getCardStyles()}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg
            className={`w-5 h-5 ${getIconColor()}`}
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
          <span className={`text-lg font-semibold ${getTextColor()}`}>
            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
          </span>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
            slot.status
          )}`}
        >
          {getStatusText(slot.status)}
        </span>
      </div>

      {/* Schedule Title and Description */}
      {slot.scheduleId?.title && (
        <div className="mb-3">
          <h5 className="font-semibold text-secondary-900 text-sm mb-1">
            {slot.scheduleId.title}
          </h5>
          {slot.scheduleId.description && (
            <p className="text-xs text-secondary-600">
              {slot.scheduleId.description}
            </p>
          )}
        </div>
      )}

      {slot.notes && (
        <p className="text-sm text-secondary-600 mb-3">{slot.notes}</p>
      )}

      {isAvailable && (
        <Button
          variant="default"
          size="sm"
          className="w-full"
          onClick={() => onBook(slot)}
          disabled={isBooked || isLoading}
        >
          {isLoading
            ? t("common.loading")
            : isBooked
            ? t("slots.alreadyBooked")
            : t("slots.bookSlot")}
        </Button>
      )}

      {!isAvailable && slot.status === "pending" && (
        <p className="text-xs text-amber-700 text-center font-medium">
          {t("slots.pendingMessage")}
        </p>
      )}

      {!isAvailable && slot.status === "booked" && (
        <p className="text-xs text-red-600 text-center">
          {t("slots.bookedMessage")}
        </p>
      )}
    </div>
  );
}

SlotCard.propTypes = {
  slot: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    notes: PropTypes.string,
  }).isRequired,
  onBook: PropTypes.func.isRequired,
  isBooked: PropTypes.bool,
  isLoading: PropTypes.bool,
};
