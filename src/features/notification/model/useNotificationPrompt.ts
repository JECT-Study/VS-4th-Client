import { useState } from "react";
import { dismissNotificationPrompt, getNotificationPromptStatus } from "../api/notificationPrompt";

const isPwa = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  ("standalone" in window.navigator && (window.navigator as Navigator & { standalone?: boolean }).standalone === true);

export function useNotificationPrompt() {
  const [isOpen, setIsOpen] = useState(false);

  const checkAndShow = async () => {
    if (!isPwa()) return;
    try {
      const { shouldShow } = await getNotificationPromptStatus();
      if (shouldShow) setIsOpen(true);
    } catch {
      // 알림 프롬프트 상태 조회 실패는 무시
    }
  };

  const handleDismiss = () => {
    setIsOpen(false);
    dismissNotificationPrompt().catch(() => {});
  };

  return { isOpen, checkAndShow, handleDismiss };
}
