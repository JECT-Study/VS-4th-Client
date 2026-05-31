import clsx from "clsx";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Switch({ checked, onChange, disabled = false, className }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={clsx(
        "relative inline-flex h-6 w-[38px] shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        checked ? "bg-primary" : "bg-grey-disabled",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      <span className="sr-only">설정 토글</span>
      <span
        aria-hidden="true"
        className={clsx(
          "pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-white ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-[17px]" : "translate-x-[3px]",
        )}
      />
    </button>
  );
}
