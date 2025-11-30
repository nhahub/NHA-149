import { forwardRef } from "react";
import { cn } from "../../utils/helpers.js";

const Card = forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default:
      "bg-white/95 backdrop-blur-sm rounded-3xl border border-secondary-200/60 shadow-lg hover:shadow-xl transition-all duration-300",
    glass: "bg-white/10 backdrop-blur-lg border-white/20 shadow-xl rounded-3xl",
    elevated: "card-elevated",
    gradient:
      "bg-gradient-to-br from-white via-primary-50/30 to-accent-50/30 border-primary-200/50 shadow-lg hover:shadow-xl rounded-3xl",
    accent:
      "bg-gradient-to-br from-accent-50/50 via-white to-primary-50/50 border-accent-200/50 shadow-lg hover:shadow-xl rounded-3xl",
    modern: "card-modern",
    professional:
      "bg-gradient-to-br from-white to-secondary-50/30 border-secondary-200/50 shadow-lg hover:shadow-xl rounded-3xl",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "text-secondary-900 relative overflow-hidden group",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

Card.displayName = "Card";

const CardHeader = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 p-6 text-center", className)}
    {...props}
  />
));

CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-bold leading-tight tracking-tight text-secondary-900",
      className
    )}
    {...props}
  />
));

CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-secondary-700 leading-relaxed", className)}
    {...props}
  />
));

CardDescription.displayName = "CardDescription";

const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));

CardContent.displayName = "CardContent";

const CardFooter = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between p-6 pt-0", className)}
    {...props}
  />
));

CardFooter.displayName = "CardFooter";

// New Card components for enhanced functionality
const CardIcon = forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "w-12 h-12 rounded-xl bg-cyan-500 flex items-center justify-center text-white mb-4 shadow-lg hover:bg-cyan-600 transition-colors duration-200",
      className
    )}
    {...props}
  >
    {children}
  </div>
));

CardIcon.displayName = "CardIcon";

const CardBadge = forwardRef(
  ({ className, children, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-primary-100 text-primary-700",
      success: "bg-success-100 text-success-700",
      warning: "bg-warning-100 text-warning-700",
      error: "bg-error-100 text-error-700",
      accent: "bg-accent-100 text-accent-700",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

CardBadge.displayName = "CardBadge";

export {
  Card,
  CardBadge,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardIcon,
  CardTitle,
};
