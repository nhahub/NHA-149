import { forwardRef } from "react";
import { cn } from "../../utils/helpers.js";

const Button = forwardRef(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? "span" : "button";

    const baseClasses =
      "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group cursor-pointer";

    const variants = {
      default:
        "bg-cyan-500 hover:bg-cyan-600 text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
      destructive:
        "bg-red-500 hover:bg-red-600 text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
      outline:
        "border-2 border-secondary-300 bg-white text-secondary-700 hover:bg-secondary-50 hover:border-secondary-400 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
      secondary:
        "bg-slate-600 hover:bg-slate-700 text-white hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
      ghost:
        "text-cyan-700 hover:bg-cyan-50 hover:text-cyan-800 hover:shadow-sm",
      link: "text-cyan-600 underline-offset-4 hover:underline hover:text-cyan-700",
      success:
        "bg-emerald-500 hover:bg-emerald-600 text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
      warning:
        "bg-amber-500 hover:bg-amber-600 text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
      accent:
        "bg-orange-500 hover:bg-orange-600 text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
      glass:
        "bg-white/20 backdrop-blur-md border border-white/30 text-cyan-700 hover:bg-white/30 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
    };

    const sizes = {
      default: "h-11 px-6 py-2.5",
      sm: "h-9 rounded-lg px-4 text-xs",
      lg: "h-12 rounded-xl px-8 text-base",
      xl: "h-14 rounded-2xl px-10 text-lg",
      icon: "h-11 w-11 rounded-xl",
      "icon-sm": "h-9 w-9 rounded-lg",
      "icon-lg": "h-12 w-12 rounded-xl",
    };

    return (
      <Comp
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      >
        {/* Shimmer effect for primary buttons */}
        {variant === "default" && (
          <span className="absolute inset-0 -top-1 left-0 h-full w-full bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-300" />
        )}
        <span className="relative z-10">{props.children}</span>
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button };
