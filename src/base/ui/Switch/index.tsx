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
                "relative inline-flex h-[32px] w-[52px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-purple focus-visible:ring-offset-2",
                checked ? "bg-primary-purple" : "bg-grey-divider",
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
        >
            <span className="sr-only">설정 토글</span>
            <span
                aria-hidden="true"
                className={clsx(
                    "pointer-events-none inline-block h-[28px] w-[28px] transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                    checked ? "translate-x-[20px]" : "translate-x-0"
                )}
            />
        </button>
    );
}