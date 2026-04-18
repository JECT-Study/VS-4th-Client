import { Toaster } from "sonner";

type ToastProps = React.ComponentProps<typeof Toaster>;

const BASE_SHADOW = "0_4px_8px_-2px_rgba(0,0,0,0.08),0_16px_32px_-8px_rgba(0,0,0,0.1)";

const Toast = ({ ...props }: ToastProps) => {
  return (
    <Toaster
      position="top-center"
      duration={3000}
      gap={8}
      offset={16}
      className="flex flex-col items-center "
      style={{ "--width": "448px" } as React.CSSProperties}
      toastOptions={{
        classNames: {
          toast: [
            "!font-sans !antialiased",
            "!flex !items-center !gap-3",
            "!w-full !rounded-2xl !max-w-[calc(100%-32px)]",
            "!border !border-zinc-200/80",
            "!bg-white !text-zinc-900",
            "!px-4 !py-3.5",
            `!shadow-[${BASE_SHADOW}]`,
          ].join(" "),
          title: "!text-[14px] !font-semibold !text-zinc-900 !leading-snug !tracking-[-0.015em]",
          description: "!text-[13px] !font-normal !text-zinc-500 !leading-relaxed !mt-0.5",
          icon: "!shrink-0 !size-[18px]",
          closeButton: [
            "!absolute !right-3 !top-1/2 !-translate-y-1/2 !left-auto !translate-x-0",
            "!size-[26px] !rounded-full !border-0",
            "!bg-zinc-100 !text-zinc-400",
            "hover:!bg-zinc-200 hover:!text-zinc-600",
            "!transition-colors !duration-150",
          ].join(" "),
          actionButton: [
            "!rounded-lg !px-3 !py-1.5 !ml-auto !shrink-0",
            "!text-[12px] !font-semibold !tracking-wide",
            "!bg-zinc-900 !text-white",
            "hover:!bg-zinc-700 !transition-colors !duration-150",
          ].join(" "),
          cancelButton: [
            "!rounded-lg !px-3 !py-1.5",
            "!text-[12px] !font-semibold",
            "!bg-zinc-100 !text-zinc-600",
            "hover:!bg-zinc-200 !transition-colors !duration-150",
          ].join(" "),
          success: [
            "!bg-[#f6fef9] !border-emerald-200/70",
            `!shadow-[${BASE_SHADOW}]`,
            "[&_[data-icon]]:!text-emerald-600",
          ].join(" "),
          error: [
            "!bg-[#fff6f6] !border-rose-200/70",
            `!shadow-[${BASE_SHADOW}]`,
            "[&_[data-icon]]:!text-rose-500",
          ].join(" "),
          warning: [
            "!bg-[#fffdf5] !border-amber-200/70",
            `!shadow-[${BASE_SHADOW}]`,
            "[&_[data-icon]]:!text-amber-500",
          ].join(" "),
          info: [
            "!bg-[#f5f9ff] !border-blue-200/70",
            `!shadow-[${BASE_SHADOW}]`,
            "[&_[data-icon]]:!text-blue-500",
          ].join(" "),
          loading: ["!bg-white !border-zinc-200/80", "[&_[data-icon]]:!text-zinc-400"].join(" "),
        },
      }}
      {...props}
    />
  );
};

export { Toast };
