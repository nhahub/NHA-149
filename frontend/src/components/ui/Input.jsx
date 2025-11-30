import { forwardRef } from "react";
import { cn } from "../../utils/helpers.js";

const Input = forwardRef(
  (
    { className, type, variant = "default", size = "default", ...props },
    ref
  ) => {
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
      <input
        type={type}
        className={cn(
          "flex w-full text-sm transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-secondary-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
