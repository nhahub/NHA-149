// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { ROUTES, USER_ROLES } from "../config/app.js";
import { useAuth } from "../hooks/useAuth.js";
import { getInitials } from "../utils/helpers.js";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar.jsx";
import { Button } from "./ui/Button.jsx";

export function LanguageToggle() {
  const { language, setLanguage } = useAuth();
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "ar" : "en";
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant="outline"
        size="sm"
        onClick={toggleLanguage}
        className="min-w-[60px]"
      >
        {language === "en" ? "العربية" : "English"}
      </Button>
    </motion.div>
  );
}

export function UserMenu() {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isDropdownOpen]);

  if (!user) return null;

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    window.location.href = ROUTES.LOGIN;
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: "easeIn",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: isRTL ? 20 : -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`flex items-center gap-2 md:gap-3 rounded-xl px-2 py-1.5 md:px-3 md:py-2 transition-colors ${
          isDropdownOpen ? "bg-primary-50" : ""
        }`}
        aria-label={t("navigation.profile")}
        aria-expanded={isDropdownOpen}
      >
        <Avatar className="h-8 w-8 md:h-9 md:w-9">
          {user.avatarUrl ? (
            <AvatarImage src={user.avatarUrl} alt={user.name} />
          ) : (
            <AvatarFallback className="bg-linear-to-br from-primary-500 to-secondary-500 text-white text-xs md:text-sm font-semibold">
              {getInitials(user.name)}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="hidden md:block text-left">
          <p className="text-xs text-secondary-600 font-medium uppercase tracking-wide">
            {user.role ? t(`roles.${user.role}`) : t("roles.candidate")}
          </p>
          <p className="text-sm font-semibold text-secondary-900 capitalize">
            {user.name || t("auth.user")}
          </p>
        </div>
        <svg
          className={`w-5 h-5 text-secondary-400 transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            className={`absolute ${
              isRTL ? "left-0" : "right-0"
            } mt-2 w-72 md:w-80 bg-white rounded-xl border border-secondary-200 shadow-2xl z-50 overflow-hidden`}
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* User Info Header */}
            <motion.div
              variants={itemVariants}
              className="px-4 py-3 border-b border-secondary-200 bg-linear-to-r from-primary-50/50 to-secondary-50/50"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 shadow-sm ring-2 ring-primary-200">
                  {user.avatarUrl ? (
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                  ) : (
                    <AvatarFallback className="bg-linear-to-br from-primary-500 to-secondary-500 text-white text-sm font-semibold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-secondary-800 capitalize truncate">
                    {user.name || t("auth.user")}
                  </p>
                  <p className="text-xs text-secondary-500 truncate">
                    {user.email}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                    {user.role ? t(`roles.${user.role}`) : t("roles.candidate")}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Menu Items */}
            <div className="py-2">
              <motion.div variants={itemVariants}>
                <NavLink
                  to={ROUTES.PROFILE}
                  onClick={() => setIsDropdownOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary-50 text-primary-700"
                        : "text-secondary-700 hover:bg-secondary-50 hover:text-secondary-900"
                    }`
                  }
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-100 text-primary-600">
                    <svg
                      className="h-4 w-4"
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
                  </div>
                  {t("navigation.profile")}
                </NavLink>
              </motion.div>

              {user.role === USER_ROLES.ADMIN && (
                <motion.div variants={itemVariants}>
                  <NavLink
                    to={ROUTES.ADMIN}
                    onClick={() => setIsDropdownOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-amber-50 text-amber-700"
                          : "text-secondary-700 hover:bg-secondary-50 hover:text-secondary-900"
                      }`
                    }
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 text-amber-600">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    {t("navigation.admin")}
                  </NavLink>
                </motion.div>
              )}

              {/* Evaluations - Show for candidates and interviewers */}
              {(user.role === USER_ROLES.CANDIDATE || user.role === USER_ROLES.INTERVIEWER) && (
                <motion.div variants={itemVariants}>
                  <NavLink
                    to={ROUTES.EVALUATIONS}
                    onClick={() => setIsDropdownOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-accent-50 text-accent-700"
                          : "text-secondary-700 hover:bg-secondary-50 hover:text-secondary-900"
                      }`
                    }
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-100 text-accent-600">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    {t("navigation.evaluations")}
                  </NavLink>
                </motion.div>
              )}

              <div className="h-px bg-secondary-200 mx-4 my-2"></div>

              <motion.div variants={itemVariants}>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-600">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </div>
                  {t("navigation.logout")}
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
