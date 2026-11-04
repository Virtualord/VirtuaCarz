import React from "react";

const VARIANTS = {
  primary:
    "bg-[#18181b] text-[#fbfbf8] hover:bg-[#000000] hover:shadow-[0_8px_24px_-8px_rgba(24,24,27,0.45)]",
  accent:
    "bg-[#fa520f] text-white hover:bg-[#d94400] hover:shadow-[0_8px_24px_-8px_rgba(250,82,15,0.5)]",
  outline:
    "border border-[#d5d2c8] bg-transparent text-[#18181b] hover:border-[#18181b] hover:bg-[#18181b] hover:text-[#fbfbf8]",
};

const SIZES = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-3 text-sm",
  lg: "px-7 py-4 text-sm",
};

/**
 * Editorial primary action button.
 * Variants: "primary" (ink), "accent" (orange), "outline" (ghost ink).
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
      className={`inline-flex items-center justify-center gap-2 rounded-md font-semibold tracking-tight transition-all duration-300 ease-editorial active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
