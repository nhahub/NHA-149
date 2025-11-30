import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import ReservationCard from "./ReservationCard";

export default function ReservationsList({
  reservations,
  onAccept,
  onReject,
  isInterviewer,
}) {
  const { t } = useTranslation();

  if (!reservations || reservations.length === 0) {
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-secondary-900">
          {t("reservations.noReservations")}
        </h3>
        <p className="mt-1 text-sm text-secondary-500">
          {t("reservations.noReservationsDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reservations.map((reservation) => (
        <ReservationCard
          key={reservation._id}
          reservation={reservation}
          onAccept={onAccept}
          onReject={onReject}
          isInterviewer={isInterviewer}
        />
      ))}
    </div>
  );
}

ReservationsList.propTypes = {
  reservations: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
    })
  ),
  onAccept: PropTypes.func,
  onReject: PropTypes.func,
  isInterviewer: PropTypes.bool,
};
