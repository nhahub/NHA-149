import { useTranslation } from "react-i18next";

const PageHeader = ({ title, subtitle, className = "" }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <div
      className={`mb-8 bg-white/95 backdrop-blur-sm rounded-lg p-6 shadow-lg ${className}`}
    >
      <h1
        className={`text-3xl font-bold text-primary-800 ${
          isRTL ? "font-arabic" : "font-sans"
        }`}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className={`text-primary-600 mt-2 text-lg ${
            isRTL ? "font-arabic" : "font-sans"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default PageHeader;
