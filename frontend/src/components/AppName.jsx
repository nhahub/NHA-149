import { useTranslation } from "react-i18next";
import { APP_CONFIG } from "../config/app.js";

export function AppName({ className = "", showDescription = false }) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <div
      className={`flex flex-col items-center ${
        isRTL ? "text-right" : "text-left"
      } ${className}`}
    >
      <h1
        className={`text-3xl font-bold text-primary-600 ${
          isRTL ? "font-arabic" : "font-sans"
        }`}
      >
        {isRTL ? APP_CONFIG.nameAr : APP_CONFIG.name}
      </h1>
      {showDescription && (
        <p
          className={`text-sm text-gray-600 mt-1 ${
            isRTL ? "font-arabic" : "font-sans"
          }`}
        >
          {isRTL ? APP_CONFIG.descriptionAr : APP_CONFIG.description}
        </p>
      )}
    </div>
  );
}
