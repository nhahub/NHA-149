import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export default function DayCalendar({ days, selectedDayId, onSelectDay }) {
  const { t, i18n } = useTranslation();

  if (!days || days.length === 0) {
    return (
      <div className="text-center py-8">
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
          {t("schedules.noDaysAvailable")}
        </h3>
        <p className="mt-1 text-sm text-secondary-500">
          {t("schedules.noDaysAvailableDescription")}
        </p>
      </div>
    );
  }

  // Group days by month for better organization
  const daysByMonth = days.reduce((acc, day) => {
    const date = new Date(day.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: date.toLocaleDateString(
          i18n.language === "ar" ? "ar-EG" : "en-US",
          {
            year: "numeric",
            month: "long",
          }
        ),
        days: [],
      };
    }
    acc[monthKey].days.push(day);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.values(daysByMonth).map((monthGroup) => (
        <div key={monthGroup.month}>
          <h3 className="text-sm font-semibold text-secondary-700 mb-3 px-1">
            {monthGroup.month}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {monthGroup.days.map((day) => {
              const date = new Date(day.date);
              const isSelected = selectedDayId === day._id;
              const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

              return (
                <button
                  key={day._id}
                  type="button"
                  onClick={() => !isPast && onSelectDay(day)}
                  disabled={isPast}
                  className={`
                    relative p-4 rounded-lg border-2 transition-all duration-200
                    ${
                      isSelected
                        ? "border-primary-500 bg-primary-50 shadow-md ring-2 ring-primary-200"
                        : isPast
                        ? "border-secondary-200 bg-secondary-50 cursor-not-allowed opacity-50"
                        : "border-secondary-200 bg-white hover:border-primary-300 hover:shadow-sm"
                    }
                  `}
                >
                  {/* Day Number */}
                  <div
                    className={`text-3xl font-bold mb-1 ${
                      isSelected
                        ? "text-primary-700"
                        : isPast
                        ? "text-secondary-400"
                        : "text-secondary-900"
                    }`}
                  >
                    {date.getDate()}
                  </div>

                  {/* Day Name */}
                  <div
                    className={`text-xs font-medium uppercase tracking-wide mb-1 ${
                      isSelected
                        ? "text-primary-600"
                        : isPast
                        ? "text-secondary-400"
                        : "text-secondary-600"
                    }`}
                  >
                    {date.toLocaleDateString(
                      i18n.language === "ar" ? "ar-EG" : "en-US",
                      { weekday: "short" }
                    )}
                  </div>

                  {/* Month/Year (if different from header) */}
                  <div
                    className={`text-xs ${
                      isSelected
                        ? "text-primary-500"
                        : isPast
                        ? "text-secondary-400"
                        : "text-secondary-500"
                    }`}
                  >
                    {date.toLocaleDateString(
                      i18n.language === "ar" ? "ar-EG" : "en-US",
                      { month: "short", year: "numeric" }
                    )}
                  </div>

                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <svg
                        className="w-5 h-5 text-primary-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Past Date Indicator */}
                  {isPast && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                      <span className="text-xs font-medium text-secondary-500">
                        {t("common.past")}
                      </span>
                    </div>
                  )}

                  {/* Title Preview (if available) */}
                  {day.title && !isPast && (
                    <div
                      className={`mt-2 pt-2 border-t text-xs truncate ${
                        isSelected
                          ? "border-primary-200 text-primary-600"
                          : "border-secondary-200 text-secondary-500"
                      }`}
                      title={
                        i18n.language === "ar" ? day.title.ar : day.title.en
                      }
                    >
                      {i18n.language === "ar" ? day.title.ar : day.title.en}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

DayCalendar.propTypes = {
  days: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      title: PropTypes.shape({
        en: PropTypes.string,
        ar: PropTypes.string,
      }),
    })
  ),
  selectedDayId: PropTypes.string,
  onSelectDay: PropTypes.func.isRequired,
};
