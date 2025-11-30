import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
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
import { useLogin } from "../hooks/api.js";
import { useAuth } from "../hooks/useAuth.js";
import { createValidationSchemas } from "../utils/validation.js";

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";
  const loginMutation = useLogin();
  const { login } = useAuth();

  // Create validation schemas with translation function
  const validationSchemas = useMemo(() => createValidationSchemas(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validationSchemas.loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      console.log("LoginPage - Submitting login for:", data.email);
      const response = await loginMutation.mutateAsync(data);

      console.log("LoginPage - Full response object:", response);
      console.log("LoginPage - Response data:", response?.data);

      // Backend returns: { success: true, message: "...", data: { user, access_token, refresh_token } }
      const userData = response?.data?.data?.user;
      const token = response?.data?.data?.access_token;

      console.log("LoginPage - Extracted data:", {
        userData,
        token,
        tokenLength: token?.length,
      });

      if (!userData || !token) {
        console.error("LoginPage - Missing user data or token in response");
        toast.error("Invalid response from server");
        return;
      }

      // Update the auth context with the login data
      console.log("LoginPage - Calling login function with:", {
        user: userData,
        token: token,
      });

      await login(userData, token);

      console.log("LoginPage - Auth context updated, showing success toast");
      toast.success(t("auth.loginSuccess"), { duration: 4000 });

      // Small delay to ensure context update completes
      setTimeout(() => {
        console.log("LoginPage - Navigating to dashboard");
        navigate(ROUTES.DASHBOARD, { replace: true });
      }, 100);
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        t("errors.genericError");
      toast.error(errorMessage, { duration: 5000 });
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
            <CardTitle>{t("auth.login")}</CardTitle>
            <CardDescription>{t("auth.loginDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending
                  ? t("common.loading")
                  : t("auth.login")}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-secondary-700">
                {t("auth.dontHaveAccount")}{" "}
                <a
                  href={ROUTES.REGISTER}
                  className="text-primary-600 hover:text-primary-500 font-medium underline"
                >
                  {t("auth.register")}
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
