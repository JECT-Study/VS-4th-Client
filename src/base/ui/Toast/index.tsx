import type { ReactNode } from "react";
import { Toaster, toast } from "sonner";

type ToastProps = React.ComponentProps<typeof Toaster>;

type ToastType = "info" | "success" | "warning" | "hot";

const toastIcons: Record<ToastType, string> = {
  info: "/assets/icons/logo-toast.svg",
  success: "/assets/icons/check-toast.svg",
  warning: "/assets/icons/fallback-toast.svg",
  hot: "/assets/icons/fire-toast.svg",
};

const CustomToast = ({ type, message }: { type: ToastType; message: string }) => {
  const icon = toastIcons[type];

  return (
    <div className="flex items-center gap-3 py-[10px] px-5 bg-[#6C777F] rounded-2xl w-full">
      {icon && <img src={icon} alt="" className="shrink-0" />}
      <span className="text-body-s text-white">{message}</span>
    </div>
  );
};

const showToast = {
  info: (message: string) => toast.custom(() => <CustomToast type="info" message={message} />),
  success: (message: string) => toast.custom(() => <CustomToast type="success" message={message} />),
  warning: (message: string) => toast.custom(() => <CustomToast type="warning" message={message} />),
  hot: (message: string) => toast.custom(() => <CustomToast type="hot" message={message} />),
};

const Toast = ({ ...props }: ToastProps) => {
  return (
    <Toaster
      position="top-center"
      duration={2000}
      gap={8}
      offset={16}
      className="flex flex-col items-center"
      style={{ "--width": "408px" } as React.CSSProperties}
      {...props}
    />
  );
};

export { Toast, showToast };
