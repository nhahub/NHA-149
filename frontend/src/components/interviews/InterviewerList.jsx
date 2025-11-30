import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import InterviewerCard from "./InterviewerCard";

export default function InterviewerList({ interviewers, onSelectInterviewer }) {
  const { t } = useTranslation();

  if (!interviewers || interviewers.length === 0) {
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-secondary-900">
          {t("interviews.noInterviewers")}
        </h3>
        <p className="mt-1 text-sm text-secondary-500">
          {t("interviews.noInterviewersDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {interviewers.map((interviewer) => (
        <InterviewerCard
          key={interviewer._id}
          interviewer={interviewer}
          onSelect={onSelectInterviewer}
        />
      ))}
    </div>
  );
}

InterviewerList.propTypes = {
  interviewers: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  onSelectInterviewer: PropTypes.func.isRequired,
};
