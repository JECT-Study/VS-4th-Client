import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  indeterminate?: boolean;
  className?: string;
}

export function Checkbox({ checked, onChange, label, indeterminate = false, className = "" }: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label className={`flex items-center gap-3 cursor-pointer select-none ${className}`}>
      <input
        ref={inputRef}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <div
        className={`w-[22px] h-[22px] rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
          checked || indeterminate ? "bg-primary border-primary" : "border-grey-disabled bg-white"
        }`}
      >
        {checked && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="9"
            viewBox="0 0 14 9"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M0.75 3.65L5.35 8.15L12.75 0.75"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {indeterminate && !checked && <div className="w-2.5 h-0.5 bg-white rounded-full" />}
      </div>
      {label && <span className="text-body-s text-grey-dark">{label}</span>}
    </label>
  );
}
