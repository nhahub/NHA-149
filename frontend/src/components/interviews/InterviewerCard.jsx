import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/Button";
import { Card, CardContent, CardFooter } from "../ui/Card";

export default function InterviewerCard({ interviewer, onSelect }) {
  const { t } = useTranslation();

  const specializationMap = {
    frontend: t("specializations.frontend"),
    backend: t("specializations.backend"),
    fullstack: t("specializations.fullstack"),
    mobile: t("specializations.mobile"),
    devops: t("specializations.devops"),
    "data-science": t("specializations.dataScience"),
    "ai-ml": t("specializations.aiMl"),
    cybersecurity: t("specializations.cybersecurity"),
    qa: t("specializations.qa"),
    "ui-ux": t("specializations.uiUx"),
  };

  return (
    <Card className="card-modern hover:shadow-lg transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {interviewer.avatarUrl ? (
              <img
                src={interviewer.avatarUrl}
                alt={interviewer.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-primary-100 group-hover:ring-primary-300 transition-all"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold text-xl ring-2 ring-primary-100 group-hover:ring-primary-300 transition-all">
                {interviewer.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-secondary-900 truncate group-hover:text-primary-600 transition-colors">
              {interviewer.name}
            </h3>
            <p className="text-sm text-secondary-600 mb-2">
              {specializationMap[interviewer.specialization] ||
                interviewer.specialization}
            </p>
            <div className="flex items-center gap-4 text-xs text-secondary-500">
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {interviewer.yearsOfExperience} {t("common.years")}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-6 py-4 bg-secondary-50 border-t border-secondary-100">
        <Button
          variant="default"
          size="sm"
          className="w-full"
          onClick={() => onSelect(interviewer)}
        >
          {t("interviews.viewSchedule")}
        </Button>
      </CardFooter>
    </Card>
  );
}

InterviewerCard.propTypes = {
  interviewer: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string,
    specialization: PropTypes.string.isRequired,
    yearsOfExperience: PropTypes.number.isRequired,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};
