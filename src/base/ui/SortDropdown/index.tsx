import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

export interface SortOption<T extends string = string> {
  label: string;
  value: T;
}

interface SortDropdownProps<T extends string = string> {
  options: SortOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

const EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
const DURATION_IN = 220;
const DURATION_OUT = 150;

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={clsx("flex-shrink-0 transition-transform duration-200", open && "rotate-180")}
    >
      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SortDropdown<T extends string = string>({ options, value, onChange, className }: SortDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? options[0]?.label;

  const startClose = () => setIsClosing(true);
  const toggle = () => {
    if (isOpen) {
      startClose();
    } else {
      setIsClosing(false);
      setIsOpen(true);
    }
  };

  useEffect(() => {
    if (!isClosing) return;
    const t = setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, DURATION_OUT);
    return () => clearTimeout(t);
  }, [isClosing]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setIsClosing(true);
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsClosing(true);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  return (
    <div ref={containerRef} className={clsx("relative inline-block", className)}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen && !isClosing}
        aria-haspopup="true"
        className="flex items-center gap-1 px-4 py-3 rounded-[54px] text-label-m text-grey-black border border-[#EDECEF] whitespace-nowrap active:opacity-70 transition-opacity select-none"
      >
        {selectedLabel}
        <img
          src="/assets/icons/dropdown-arrow.svg"
          alt=""
          className={clsx("flex-shrink-0 transition-transform duration-100", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div
          style={{
            transformOrigin: "top right",
            animation: isClosing
              ? `dropdown-out ${DURATION_OUT}ms ${EASING} both`
              : `dropdown-in ${DURATION_IN}ms ${EASING} both`,
          }}
          className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-[0px_5px_12px_2px_rgba(120,_120,_136,_0.06)] min-w-[140px] py-2 z-50"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                startClose();
              }}
              className={clsx(
                "w-full text-left px-4 py-3 text-label-m transition-colors",
                option.value === value ? "text-grey-black" : "text-grey-light",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export { SortDropdown };
