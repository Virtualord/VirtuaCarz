import React from "react";

const VARIANTS = {
  primary:
    "border border-ink bg-ink text-cream hover:border-accent hover:bg-accent hover:text-white",
  accent:
    "border border-accent bg-accent text-white hover:border-accent-deep hover:bg-accent-deep",
  outline:
    "border border-line bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-cream",
};

const SIZES = {
  sm: "px-4 py-2.5 text-xs",
  md: "px-5 py-3 text-sm",
  lg: "px-6 py-3.5 text-sm",
};

/**
 * Editorial action button.
 * Variants: "primary" (ink), "accent" (orange), "outline" (hairline).
 */
const Button = ({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  ...rest
}) => {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2.5 rounded-md font-bold tracking-tight transition-all duration-300 ease-editorial focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cream active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
