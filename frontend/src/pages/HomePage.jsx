import { useTranslation } from "react-i18next";
import { AppName } from "../components/AppName.jsx";
import { Button } from "../components/ui/Button.jsx";
import {
  Card,
  CardDescription,
  CardHeader,
  CardIcon,
  CardTitle,
} from "../components/ui/Card.jsx";
import { ROUTES } from "../config/app.js";
import { useAuth } from "../hooks/useAuth.js";

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const isRTL = i18n.language === "ar";

  return (
    <div className={`min-h-screen ${isRTL ? "rtl" : "ltr"}`}>
      {/* Hero Section */}
      <section className="bg-linear-to-br from-primary-100 via-accent-100 to-secondary-100 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8 animate-fade-in">
              <AppName
                showDescription
                className="bg-linear-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent"
              />
            </div>
            <h1
              className={`text-5xl md:text-6xl font-black text-secondary-900 mb-6 animate-slide-up ${
                isRTL ? "font-arabic" : "font-sans"
              }`}
            >
              {t("app.tagline")}
            </h1>
            <p
              className={`text-xl md:text-2xl text-secondary-700 mb-12 max-w-4xl mx-auto leading-relaxed animate-slide-up ${
                isRTL ? "font-arabic" : "font-sans"
              }`}
              style={{ animationDelay: "0.2s" }}
            >
              {t("home.description")}
            </p>
            <div
              className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              {isAuthenticated ? (
                <Button size="xl" asChild className="pulse-glow">
                  <a href={ROUTES.DASHBOARD}>{t("navigation.dashboard")}</a>
                </Button>
              ) : (
                <>
                  <Button
                    variant="glass"
                    size="xl"
                    asChild
                    className="pulse-glow"
                  >
                    <a href={ROUTES.REGISTER}>{t("navigation.register")}</a>
                  </Button>
                  <Button variant="outline" size="xl" asChild>
                    <a href={ROUTES.LOGIN}>{t("navigation.login")}</a>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2
              className={`text-4xl md:text-5xl font-bold text-secondary-900 mb-6 ${
                isRTL ? "font-arabic" : "font-sans"
              }`}
            >
              {t("home.features.title")}
            </h2>
            <p
              className={`text-xl text-secondary-700 max-w-3xl mx-auto ${
                isRTL ? "font-arabic" : "font-sans"
              }`}
            >
              {t("home.features.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="accent" className="text-center group">
              <CardHeader>
                <CardIcon className="mx-auto group-hover:animate-bounce-subtle">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </CardIcon>
                <CardTitle className="text-xl">
                  {t("home.features.interviews.title")}
                </CardTitle>
                <CardDescription className="text-base">
                  {t("home.features.interviews.description")}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card variant="gradient" className="text-center group cursor-pointer hover:shadow-lg transition-shadow" asChild>
              <a href={ROUTES.LEARNING}>
                <CardHeader>
                  <CardIcon
                    className="mx-auto group-hover:animate-bounce-subtle"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-secondary-500) 0%, var(--color-secondary-700) 100%)",
                    }}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </CardIcon>
                  <CardTitle className="text-xl">
                    {t("home.features.learning.title")}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {t("home.features.learning.description")}
                  </CardDescription>
                </CardHeader>
              </a>
            </Card>

            <Card variant="glass" className="text-center group">
              <CardHeader>
                <CardIcon
                  className="mx-auto group-hover:animate-bounce-subtle"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-accent-500) 0%, var(--color-accent-700) 100%)",
                  }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </CardIcon>
                <CardTitle className="text-xl">
                  {t("home.features.evaluation.title")}
                </CardTitle>
                <CardDescription className="text-base">
                  {t("home.features.evaluation.description")}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className={`text-4xl md:text-5xl font-bold text-white mb-6 ${
              isRTL ? "font-arabic" : "font-sans"
            }`}
          >
            {t("home.cta.title")}
          </h2>
          <p
            className={`text-xl text-primary-100 mb-12 max-w-3xl mx-auto ${
              isRTL ? "font-arabic" : "font-sans"
            }`}
          >
            {t("home.cta.description")}
          </p>
          {!isAuthenticated && (
            <Button
              variant="secondary"
              size="xl"
              asChild
              className="shadow-2xl"
            >
              <a href={ROUTES.REGISTER}>{t("home.cta.button")}</a>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
