import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ROUTES } from "../../config/app.js";
import { useAuth } from "../../hooks/useAuth.js";
import { AppName } from "../AppName.jsx";
import { LanguageToggle, UserMenu } from "../LanguageToggle.jsx";
import { Button } from "../ui/Button.jsx";

export function Header() {
  const { isAuthenticated } = useAuth();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const navItemVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  return (
    <header className={`sticky top-0 z-50 nav-modern ${isRTL ? "rtl" : "ltr"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <NavLink
              to={ROUTES.HOME}
              className="hover:opacity-80 transition-opacity duration-200"
            >
              <AppName className="text-xl font-bold text-gradient" />
            </NavLink>
          </motion.div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <motion.div variants={navItemVariants} whileHover="hover" whileTap="tap">
              <NavLink
                to={ROUTES.HOME}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "nav-link-active" : ""}`
                }
              >
                {t("navigation.home")}
              </NavLink>
            </motion.div>
            <motion.div variants={navItemVariants} whileHover="hover" whileTap="tap">
              <NavLink
                to={ROUTES.LEARNING}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "nav-link-active" : ""}`
                }
              >
                {t("navigation.learning")}
              </NavLink>
            </motion.div>
            {isAuthenticated && (
              <>
                <motion.div variants={navItemVariants} whileHover="hover" whileTap="tap">
                  <NavLink
                    to={ROUTES.DASHBOARD}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "nav-link-active" : ""}`
                    }
                  >
                    {t("navigation.dashboard")}
                  </NavLink>
                </motion.div>
                <motion.div variants={navItemVariants} whileHover="hover" whileTap="tap">
                  <NavLink
                    to={ROUTES.INTERVIEWS}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "nav-link-active" : ""}`
                    }
                  >
                    {t("navigation.interviews")}
                  </NavLink>
                </motion.div>
              </>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <LanguageToggle />
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" asChild>
                    <NavLink to={ROUTES.LOGIN}>{t("navigation.login")}</NavLink>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="sm" asChild>
                    <NavLink to={ROUTES.REGISTER}>
                      {t("navigation.register")}
                    </NavLink>
                  </Button>
                </motion.div>
              </div>
            )}

            {/* Mobile menu button */}
            <motion.button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="sr-only">Open main menu</span>
              <motion.svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
                animate={{ rotate: isMobileMenuOpen ? 45 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  initial={false}
                  animate={{
                    d: isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden"
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-secondary-200">
                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <NavLink
                    to={ROUTES.HOME}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-base font-medium ${
                        isActive
                          ? "text-primary-600 bg-primary-50"
                          : "text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50"
                      }`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("navigation.home")}
                  </NavLink>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <NavLink
                    to={ROUTES.LEARNING}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-base font-medium ${
                        isActive
                          ? "text-primary-600 bg-primary-50"
                          : "text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50"
                      }`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("navigation.learning")}
                  </NavLink>
                </motion.div>
                {isAuthenticated && (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <NavLink
                        to={ROUTES.DASHBOARD}
                        className={({ isActive }) =>
                          `block px-3 py-2 rounded-md text-base font-medium ${
                            isActive
                              ? "text-primary-600 bg-primary-50"
                              : "text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50"
                          }`
                        }
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {t("navigation.dashboard")}
                      </NavLink>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <NavLink
                        to={ROUTES.INTERVIEWS}
                        className={({ isActive }) =>
                          `block px-3 py-2 rounded-md text-base font-medium ${
                            isActive
                              ? "text-primary-600 bg-primary-50"
                              : "text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50"
                          }`
                        }
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {t("navigation.interviews")}
                      </NavLink>
                    </motion.div>
                  </>
                )}
                {!isAuthenticated && (
                  <motion.div
                    className="px-3 py-2 space-y-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <NavLink to={ROUTES.LOGIN} onClick={() => setIsMobileMenuOpen(false)}>
                          {t("navigation.login")}
                        </NavLink>
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button size="sm" className="w-full" asChild>
                        <NavLink to={ROUTES.REGISTER} onClick={() => setIsMobileMenuOpen(false)}>
                          {t("navigation.register")}
                        </NavLink>
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
