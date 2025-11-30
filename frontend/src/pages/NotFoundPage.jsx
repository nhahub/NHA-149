import { AlertCircle, ArrowLeft, ArrowRight, Home } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card.jsx";

export default function NotFoundPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";

  return (
    <div
      className={`h-screen bg-animated flex items-center justify-center px-4 sm:px-6 relative ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      {/* Animated background gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-primary-100/30 via-white/50 to-secondary-100/30 pointer-events-none"></div>

      <div className="max-w-xl w-full relative z-10">
        {/* Main Content Card */}
        <Card variant="modern" className="overflow-hidden animate-slide-up">
          <CardHeader className="text-center pb-4 pt-8">
            {/* 404 Display - Smaller */}
            <div className="relative mb-4">
              <div className="text-6xl md:text-7xl font-black leading-none">
                <span className="bg-linear-to-r from-primary-500 via-cyan-500 to-secondary-500 bg-clip-text text-transparent">
                  4
                </span>
                <span className="bg-linear-to-r from-cyan-500 via-primary-500 to-accent-500 bg-clip-text text-transparent">
                  0
                </span>
                <span className="bg-linear-to-r from-secondary-500 via-primary-500 to-cyan-500 bg-clip-text text-transparent">
                  4
                </span>
              </div>
            </div>

            {/* Icon Badge - Smaller */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="relative bg-linear-to-br from-primary-500 to-cyan-500 p-3 rounded-full shadow-lg">
                  <AlertCircle
                    className="w-6 h-6 text-white"
                    strokeWidth={2.5}
                  />
                </div>
              </div>
            </div>

            <CardTitle className="text-2xl md:text-3xl font-bold text-secondary-900 mb-2">
              {t("errors.notFound")}
            </CardTitle>
            <CardDescription className="text-base text-secondary-600">
              {t("errors.pageNotFound")}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            {/* Short Description */}
            <p
              className={`text-secondary-600 text-sm leading-relaxed mb-6 text-center ${
                isRTL ? "font-arabic" : "font-sans"
              }`}
            >
              {t("errors.pageNotFoundDescription")}
            </p>

            {/* Action Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-3 justify-center ${
                isRTL ? "sm:flex-row-reverse" : ""
              }`}
            >
              {isRTL ? (
                <>
                  {/* Home button first in RTL */}
                  <Button
                    onClick={() => navigate("/")}
                    variant="default"
                    size="lg"
                    className="flex-1 sm:flex-none min-w-[160px]"
                  >
                    <Home className="w-4 h-4 ml-2" />
                    {t("common.backToHome")}
                  </Button>
                  {/* Back button second in RTL */}
                  <Button
                    onClick={() => navigate(-1)}
                    variant="outline"
                    size="lg"
                    className="flex-1 sm:flex-none min-w-[160px]"
                  >
                    <ArrowRight className="w-4 h-4 ml-2" />
                    {t("common.back")}
                  </Button>
                </>
              ) : (
                <>
                  {/* Back button first in LTR */}
                  <Button
                    onClick={() => navigate(-1)}
                    variant="outline"
                    size="lg"
                    className="flex-1 sm:flex-none min-w-[160px]"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t("common.back")}
                  </Button>
                  {/* Home button second in LTR */}
                  <Button
                    onClick={() => navigate("/")}
                    variant="default"
                    size="lg"
                    className="flex-1 sm:flex-none min-w-[160px]"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    {t("common.backToHome")}
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
