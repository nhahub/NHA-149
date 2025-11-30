import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { Button } from "./Button.jsx";
import { Input } from "./Input.jsx";
import { USER_ROLES } from "../../config/app.js";

export function EditUserDialog({
  isOpen,
  onClose,
  onSave,
  user,
  isLoading = false,
}) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "candidate",
    language: "en",
    isActive: true,
    isApproved: false,
    yearsOfExperience: "",
    specialization: "",
  });

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "candidate",
        language: user.language || "en",
        isActive: user.isActive !== undefined ? user.isActive : true,
        isApproved: user.isApproved !== undefined ? user.isApproved : false,
        yearsOfExperience: user.yearsOfExperience || "",
        specialization: user.specialization || "",
      });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updateData = { ...formData };
    
    // Clean up data before sending
    if (updateData.role !== "interviewer") {
      updateData.yearsOfExperience = undefined;
      updateData.specialization = undefined;
    } else {
      // Ensure yearsOfExperience is a number for interviewers
      if (updateData.yearsOfExperience === "") {
        updateData.yearsOfExperience = 0;
      }
    }

    onSave(updateData);
  };

  const isInterviewer = formData.role === "interviewer";
  const specializations = [
    "frontend",
    "backend",
    "fullstack",
    "mobile",
    "devops",
    "data-science",
    "ai-ml",
    "cybersecurity",
    "qa",
    "ui-ux",
  ];

  return (
    <div className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-secondary-200">
        <div className="sticky top-0 bg-white border-b border-secondary-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-secondary-900">
            {t("admin.editUser", { defaultValue: "Edit User" })}
          </h3>
          <button
            onClick={onClose}
            className="text-secondary-400 hover:text-secondary-600 transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                {t("auth.name")}
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                {t("auth.email")}
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                {t("auth.role")}
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={isLoading || user?.role === "admin"}
                className="w-full h-12 px-4 py-3 text-sm border-2 border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {Object.values(USER_ROLES).map((role) => (
                  <option key={role} value={role}>
                    {t(`roles.${role}`)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                {t("auth.language")}
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full h-12 px-4 py-3 text-sm border-2 border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>
          </div>

          {isInterviewer && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  {t("auth.yearsOfExperience")}
                </label>
                <Input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  min="0"
                  max="50"
                  required={isInterviewer}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  {t("auth.specialization")}
                </label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required={isInterviewer}
                  disabled={isLoading}
                  className="w-full h-12 px-4 py-3 text-sm border-2 border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">{t("validation.selectSpecialization")}</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>
                      {t(`specializations.${spec}`)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                disabled={isLoading}
                className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-secondary-700">
                {t("common.active", { defaultValue: "Active" })}
              </span>
            </label>

            {formData.role === "interviewer" && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isApproved"
                  checked={formData.isApproved}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-secondary-700">
                  {t("admin.approved", { defaultValue: "Approved" })}
                </span>
              </label>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-secondary-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" variant="default" disabled={isLoading}>
              {isLoading
                ? t("common.updating", { defaultValue: "Updating..." })
                : t("common.save", { defaultValue: "Save" })}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

