import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import { Avatar } from "../components/ui/Avatar.jsx";
import { Button } from "../components/ui/Button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card.jsx";
import { Input } from "../components/ui/Input.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import { useAuth } from "../hooks/useAuth.js";

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const isRTL = i18n.language === "ar";

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={`min-h-screen bg-animated py-8 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title={t("navigation.profile")}
          subtitle={t("profile.subtitle")}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture Section */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="text-secondary-800 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-primary-600"
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
                {t("profile.profilePicture")}
              </CardTitle>
              <CardDescription>
                {t("profile.profilePictureDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-4">
                <Avatar
                  src={user?.avatar}
                  alt={user?.name || "User"}
                  className="w-24 h-24 mx-auto"
                />
              </div>
              <Button variant="outline" size="sm">
                {t("profile.changePhoto")}
              </Button>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="card-modern lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-secondary-800 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-accent-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                {t("profile.personalInfo")}
              </CardTitle>
              <CardDescription>
                {t("profile.personalInfoDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      {t("auth.name")}
                    </label>
                    <Input
                      defaultValue={user?.name || ""}
                      className="input-modern"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      {t("auth.email")}
                    </label>
                    <Input
                      type="email"
                      defaultValue={user?.email || ""}
                      className="input-modern"
                      disabled
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      {t("profile.phone")}
                    </label>
                    <Input
                      type="tel"
                      defaultValue={user?.phone || ""}
                      className="input-modern"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      {t("profile.role")}
                    </label>
                    <Input
                      defaultValue={user?.role || ""}
                      className="input-modern"
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    {t("profile.bio")}
                  </label>
                  <textarea
                    rows={4}
                    defaultValue={user?.bio || ""}
                    className="input-modern w-full resize-none"
                    placeholder={t("profile.bioPlaceholder")}
                  />
                </div>

                <div className="flex gap-3">
                  <Button variant="default">{t("profile.saveChanges")}</Button>
                  <Button variant="outline">{t("common.cancel")}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Account Settings Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white drop-shadow-lg mb-6">
            {t("profile.accountSettings")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="text-secondary-800 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 7a2 2 0 012 2m0 0v6a2 2 0 01-2 2m0-8V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m0 8v4a2 2 0 002 2h4a2 2 0 002-2v-4m-6 0h6"
                    />
                  </svg>
                  {t("profile.changePassword")}
                </CardTitle>
                <CardDescription>
                  {t("profile.changePasswordDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  {t("profile.updatePassword")}
                </Button>
              </CardContent>
            </Card>

            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="text-secondary-800 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-accent-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {t("profile.preferences")}
                </CardTitle>
                <CardDescription>
                  {t("profile.preferencesDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      {t("profile.language")}
                    </label>
                    <select
                      className="input-modern w-full"
                      defaultValue={i18n.language}
                    >
                      <option value="en">English</option>
                      <option value="ar">العربية</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      {t("profile.timezone")}
                    </label>
                    <select className="input-modern w-full">
                      <option>UTC</option>
                      <option>GMT+2 (Cairo)</option>
                      <option>GMT+3 (Riyadh)</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
