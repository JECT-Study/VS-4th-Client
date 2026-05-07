import type { ReactNode } from "react";
import { useState } from "react";

interface InputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputMode?: "text" | "numeric";
  maxLength?: number;
  disabled?: boolean;
  error?: string | null;
  helpText?: string;
  suffix?: ReactNode;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
}

export function Input({
  id,
  value,
  onChange,
  placeholder,
  inputMode = "text",
  maxLength,
  disabled = false,
  error,
  helpText,
  suffix,
  onFocus,
  onBlur,
  onKeyDown,
  className = "",
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasBeenFocused, setHasBeenFocused] = useState(false);

  const borderClass = error ? "border-error" : isFocused ? "border-grey-dark" : "border-grey-stroke";

  const handleFocus = () => {
    setIsFocused(true);
    setHasBeenFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div
        className={`flex items-center border-[1.5px] rounded-lg px-2 py-3 bg-white transition-colors ${borderClass}`}
      >
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          inputMode={inputMode}
          maxLength={maxLength}
          disabled={disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={onKeyDown}
          className="flex-1 text-body-s text-grey-dark placeholder:text-grey-light outline-none bg-white"
        />
        {suffix && <div className="ml-2 shrink-0">{suffix}</div>}
      </div>
      {error ? (
        <p className="text-label-m text-error">{error}</p>
      ) : helpText && hasBeenFocused ? (
        <p className="text-label-m text-[#218830]">{helpText}</p>
      ) : null}
    </div>
  );
}
