import { useTranslation } from "react-i18next";
import { ROUTES } from "../../config/app.js";
import { AppName } from "../AppName.jsx";

export function Footer() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <footer
      className={`bg-mesh backdrop-blur-sm border-t border-white/20 ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <AppName showDescription className="text-gradient" />
            <p
              className={`mt-4 text-sm text-secondary-700 leading-relaxed ${
                isRTL ? "font-arabic" : "font-sans"
              }`}
            >
              {t("app.tagline")}
            </p>
            <div className="mt-6 flex space-x-4">
              {/* Twitter/X Icon */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center hover:-translate-y-1 transition-all duration-200 group"
                aria-label="Twitter"
              >
                <svg
                  className="w-6 h-6 text-[#1DA1F2] group-hover:text-[#0d8bd9] transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              {/* LinkedIn Icon */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center hover:-translate-y-1 transition-all duration-200 group"
                aria-label="LinkedIn"
              >
                <svg
                  className="w-6 h-6 text-[#0077B5] group-hover:text-[#005885] transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className={`text-sm font-bold text-primary-700 uppercase tracking-wider mb-4 ${
                isRTL ? "font-arabic" : "font-sans"
              }`}
            >
              {t("common.quickLinks")}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={ROUTES.HOME}
                  className="text-sm text-primary-800 hover:text-primary-600 transition-all duration-200 font-medium flex items-center gap-2 relative group"
                >
                  <svg
                    className="w-5 h-5 text-primary-600 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6m-6 0v6m0 0H7m6 0h6"
                    />
                  </svg>
                  {t("navigation.home")}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-primary-500 to-primary-700 transition-all duration-200 group-hover:w-full"></span>
                </a>
              </li>
              <li>
                <a
                  href={ROUTES.INTERVIEWS}
                  className="text-sm text-primary-800 hover:text-primary-600 transition-all duration-200 font-medium flex items-center gap-2 relative group"
                >
                  <svg
                    className="w-5 h-5 text-primary-600 shrink-0"
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
                  {t("navigation.interviews")}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-primary-500 to-primary-700 transition-all duration-200 group-hover:w-full"></span>
                </a>
              </li>
              <li>
                <a
                  href={ROUTES.LEARNING}
                  className="text-sm text-primary-800 hover:text-primary-600 transition-all duration-200 font-medium flex items-center gap-2 relative group"
                >
                  <svg
                    className="w-5 h-5 text-primary-600 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  {t("navigation.learning")}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-primary-500 to-primary-700 transition-all duration-200 group-hover:w-full"></span>
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3
              className={`text-sm font-bold text-primary-700 uppercase tracking-wider mb-4 ${
                isRTL ? "font-arabic" : "font-sans"
              }`}
            >
              {t("common.support")}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/help"
                  className="text-sm text-primary-800 hover:text-primary-600 transition-all duration-200 font-medium flex items-center gap-2 relative group"
                >
                  <svg
                    className="w-5 h-5 text-primary-600 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {t("common.help")}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-primary-500 to-primary-700 transition-all duration-200 group-hover:w-full"></span>
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-sm text-gray-600 hover:text-primary-600 transition-all duration-200 font-medium relative group"
                >
                  {t("common.contact")}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-primary-500 to-primary-700 transition-all duration-200 group-hover:w-full"></span>
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="text-sm text-gray-600 hover:text-primary-600 transition-all duration-200 font-medium relative group"
                >
                  {t("common.privacy")}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-primary-500 to-primary-700 transition-all duration-200 group-hover:w-full"></span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200/50">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p
              className={`text-sm text-secondary-600 ${
                isRTL ? "font-arabic" : "font-sans"
              }`}
            >
              © 2024 Taqyeem. {t("common.allRightsReserved")}
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a
                href="/terms"
                className="text-sm text-secondary-600 hover:text-primary-600 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="/privacy"
                className="text-sm text-secondary-600 hover:text-primary-600 transition-colors"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
