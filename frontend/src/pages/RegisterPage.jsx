import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AppName } from "../components/AppName.jsx";
import { Button } from "../components/ui/Button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card.jsx";
import { Input } from "../components/ui/Input.jsx";
import { PasswordInput } from "../components/ui/PasswordInput.jsx";
import { ROUTES } from "../config/app.js";
import { useRegister } from "../hooks/api.js";
import { useAuth } from "../hooks/useAuth.js";
import { createValidationSchemas, validateFile } from "../utils/validation.js";

export default function RegisterPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";
  const registerMutation = useRegister();
  const { login } = useAuth();
  const [cvFile, setCvFile] = useState(null);

  // Create validation schemas with translation function
  const validationSchemas = useMemo(() => createValidationSchemas(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    setValue,
    clearErrors,
  } = useForm({
    resolver: zodResolver(validationSchemas.registerSchema),
    defaultValues: {
      role: "candidate",
      language: i18n.language,
    },
  });
  const selectedRole = watch("role");

  useEffect(() => {
    if (selectedRole !== "interviewer") {
      setValue("yearsOfExperience", undefined);
      setValue("specialization", undefined);
      setCvFile(null);
      clearErrors(["yearsOfExperience", "specialization", "cv"]);
    }
  }, [selectedRole, setValue, clearErrors]);

  const onSubmit = async (data) => {
    try {
      // Validate interviewer-specific fields
      if (data.role === "interviewer") {
        // Validate CV file
        if (!cvFile) {
          setError("cv", {
            type: "manual",
            message: t("auth.cvRequired"),
          });
          toast.error(t("auth.cvRequired"), { duration: 4000 });
          return;
        }

        const fileValidation = validateFile(cvFile, {}, t);
        if (!fileValidation.valid) {
          setError("cv", {
            type: "manual",
            message: fileValidation.error,
          });
          toast.error(fileValidation.error, { duration: 4000 });
          return;
        }

        // Validate years of experience
        if (!data.yearsOfExperience && data.yearsOfExperience !== 0) {
          setError("yearsOfExperience", {
            type: "manual",
            message: t("validation.yearsOfExperienceRequired"),
          });
          toast.error(t("validation.yearsOfExperienceRequired"), {
            duration: 4000,
          });
          return;
        }

        // Validate specialization
        if (!data.specialization) {
          setError("specialization", {
            type: "manual",
            message: t("validation.specializationRequired"),
          });
          toast.error(t("validation.specializationRequired"), {
            duration: 4000,
          });
          return;
        }
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("role", data.role);
      formData.append("language", data.language || i18n.language);

      // Add interviewer-specific fields
      if (data.role === "interviewer") {
        formData.append("yearsOfExperience", data.yearsOfExperience);
        formData.append("specialization", data.specialization);
        formData.append("cv", cvFile);
      }

      const response = await registerMutation.mutateAsync(formData);

      console.log("RegisterPage - Response:", response);

      // Check different possible response structures
      const userData =
        response?.data?.user || response?.data?.data?.user || response?.user;
      const token =
        response?.data?.access_token ||
        response?.data?.data?.access_token ||
        response?.data?.token ||
        response?.access_token;

      // For interviewers, they might not get a token (pending approval)
      if (data.role === "interviewer") {
        toast.success(
          response?.data?.message ||
            "Registration successful. Your account is pending admin approval.",
          { duration: 5000 }
        );
        navigate(ROUTES.LOGIN);
      } else {
        if (userData && token) {
          // Update the auth context with the registration data
          login(userData, token);
          toast.success(t("auth.registerSuccess"), { duration: 4000 });
          navigate(ROUTES.DASHBOARD);
        } else {
          toast.success(response?.data?.message || t("auth.registerSuccess"), {
            duration: 4000,
          });
          navigate(ROUTES.LOGIN);
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        t("errors.genericError");
      toast.error(errorMessage, { duration: 5000 });
    }
  };

  const handleCvChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validation = validateFile(file, {}, t);
      if (!validation.valid) {
        toast.error(validation.error, { duration: 4000 });
        e.target.value = "";
        setCvFile(null);
        return;
      }
      setCvFile(file);
      toast.success(`✓ ${file.name}`, { duration: 3000 });
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-animated py-12 px-4 sm:px-6 lg:px-8 ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <AppName showDescription className="mb-8" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("auth.register")}</CardTitle>
            <CardDescription>{t("auth.registerDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-secondary-700 mb-2"
                >
                  {t("auth.name")}
                </label>
                <Input
                  id="name"
                  type="text"
                  {...register("name")}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-secondary-700 mb-2"
                >
                  {t("auth.email")}
                </label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-secondary-700 mb-2"
                >
                  {t("auth.password")}
                </label>
                <PasswordInput
                  id="password"
                  {...register("password")}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-secondary-700 mb-2"
                >
                  {t("auth.confirmPassword")}
                </label>
                <PasswordInput
                  id="confirmPassword"
                  {...register("confirmPassword")}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-secondary-700 mb-2"
                >
                  {t("auth.role")}
                </label>
                <select
                  id="role"
                  {...register("role")}
                  className="input-modern flex h-12 w-full"
                >
                  <option value="candidate">{t("roles.candidate")}</option>
                  <option value="interviewer">{t("roles.interviewer")}</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Interviewer-specific fields */}
              {selectedRole === "interviewer" && (
                <>
                  <div className="border-t border-secondary-200 pt-4">
                    <p className="text-sm font-medium text-secondary-700 mb-4">
                      {t("auth.interviewerFieldsNote")}
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="yearsOfExperience"
                          className="block text-sm font-medium text-secondary-700 mb-2"
                        >
                          {t("auth.yearsOfExperience")}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="yearsOfExperience"
                          type="number"
                          min="0"
                          max="50"
                          {...register("yearsOfExperience", {
                            valueAsNumber: true,
                          })}
                          className={
                            errors.yearsOfExperience ? "border-red-500" : ""
                          }
                        />
                        {errors.yearsOfExperience && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.yearsOfExperience.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="specialization"
                          className="block text-sm font-medium text-secondary-700 mb-2"
                        >
                          {t("auth.specialization")}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="specialization"
                          {...register("specialization")}
                          className="input-modern flex h-12 w-full"
                        >
                          <option value="">
                            {t("validation.selectSpecialization")}
                          </option>
                          <option value="frontend">
                            {t("specializations.frontend")}
                          </option>
                          <option value="backend">
                            {t("specializations.backend")}
                          </option>
                          <option value="fullstack">
                            {t("specializations.fullstack")}
                          </option>
                          <option value="mobile">
                            {t("specializations.mobile")}
                          </option>
                          <option value="devops">
                            {t("specializations.devops")}
                          </option>
                          <option value="data-science">
                            {t("specializations.data-science")}
                          </option>
                          <option value="ai-ml">
                            {t("specializations.ai-ml")}
                          </option>
                          <option value="cybersecurity">
                            {t("specializations.cybersecurity")}
                          </option>
                          <option value="qa">{t("specializations.qa")}</option>
                          <option value="ui-ux">
                            {t("specializations.ui-ux")}
                          </option>
                        </select>
                        {errors.specialization && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.specialization.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="cv"
                          className="block text-sm font-medium text-secondary-700 mb-2"
                        >
                          {t("auth.cv")} <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="cv"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleCvChange}
                          className="block w-full text-sm text-secondary-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-primary-50 file:text-primary-700
                            hover:file:bg-primary-100"
                        />
                        <p className="mt-1 text-xs text-secondary-500">
                          PDF or Word document, max 5MB
                        </p>
                        {cvFile && (
                          <p className="mt-1 text-sm text-green-600">
                            ✓ {cvFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending
                  ? t("common.loading")
                  : t("auth.register")}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-secondary-700">
                {t("auth.alreadyHaveAccount")}{" "}
                <a
                  href={ROUTES.LOGIN}
                  className="text-primary-600 hover:text-primary-500 font-medium underline"
                >
                  {t("auth.login")}
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
