import { Spinner } from "@base/ui/Spinner";
import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: "primary" | "ghost";
  type?: "button" | "submit";
  className?: string;
}

export function Button({
  children,
  onClick,
  disabled = false,
  isLoading = false,
  variant = "primary",
  type = "button",
  className = "",
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  const baseClasses = "w-full py-4 rounded-lg text-body-m transition-colors flex items-center justify-center";
  const variantClasses =
    variant === "primary"
      ? isDisabled
        ? "bg-grey-disabled text-white cursor-not-allowed"
        : "bg-primary text-white active:opacity-80"
      : isDisabled
        ? "bg-transparent border border-grey-stroke text-grey-light cursor-not-allowed"
        : "bg-transparent border border-grey-stroke text-grey-light active:opacity-80";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      {isLoading ? <Spinner className="border-t-white" /> : children}
    </button>
  );
}
