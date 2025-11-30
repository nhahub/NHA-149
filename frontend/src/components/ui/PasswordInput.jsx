import { forwardRef, useState } from "react";
import { cn } from "../../utils/helpers.js";

const PasswordInput = forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const variants = {
      default: "input-modern",
      glass:
        "bg-white/10 backdrop-blur-lg border-2 border-white/20 rounded-xl focus:border-primary-300 focus:bg-white/20",
      filled:
        "bg-secondary-50/80 backdrop-blur-sm border-2 border-secondary-200 rounded-xl focus:bg-white focus:border-primary-500",
      error:
        "bg-white/90 backdrop-blur-sm border-2 border-error-300 rounded-xl focus:border-error-500",
      success:
        "bg-white/90 backdrop-blur-sm border-2 border-success-300 rounded-xl focus:border-success-500",
      modern:
        "bg-white/95 backdrop-blur-md border-2 border-secondary-200/60 rounded-xl focus:border-primary-400 shadow-sm",
    };

    const sizes = {
      default: "h-12 px-4 py-3",
      sm: "h-10 px-3 py-2 text-sm",
      lg: "h-14 px-5 py-4 text-base",
    };

    return (
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className={cn(
            "flex w-full pr-12 text-sm transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-secondary-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            variants[variant],
            sizes[size],
            className
          )}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute end-3 top-1/2 -translate-y-1/2 text-secondary-500 hover:text-secondary-700 transition-colors duration-200"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M14.12 14.12l1.415 1.415M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          )}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
