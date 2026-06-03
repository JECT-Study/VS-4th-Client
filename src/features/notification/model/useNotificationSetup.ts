import { useCallback, useEffect, useState } from "react";

export type OSType = "android" | "ios" | "ios-outdated" | "other";

interface BeforeInstallPromptEvent extends Event {
  prompt(): void;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function useNotificationSetup() {
  const [osType, setOsType] = useState<OSType>("other");
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>("default");

  // 안드로이드 설치 팝업 제어를 위한 이벤트 객체 저장
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // 1. 기기 OS 및 iOS 버전(웹 푸시 지원 여부) 감지
    const userAgent = window.navigator.userAgent.toLowerCase();

    if (/android/i.test(userAgent)) {
      setOsType("android");
    } else if (/iphone|ipad|ipod/i.test(userAgent)) {
      // iOS 16.4 이상부터 window.Notification 객체를 지원합니다.
      if ("Notification" in window) {
        setOsType("ios");
      } else {
        setOsType("ios-outdated");
      }
    }

    // 2. PWA(홈 화면) 설치 여부 감지
    const checkIsStandalone = () =>
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in window.navigator && (window.navigator as any).standalone === true);

    const syncInstallState = () => {
      setIsPwaInstalled(checkIsStandalone());
    };
    syncInstallState();

    // 3. 기존 알림 권한 상태 동기화
    if ("Notification" in window) {
      setPushPermission(Notification.permission);
    }

    // 4. 안드로이드 전용: 설치 가능 상태일 때 이벤트 가로채기
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault(); // 크롬의 기본 하단 설치 배너 방지
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 사용자가 독립된 앱(Standalone) 모드로 진입하는 것을 감지
    const handleAppInstalled = () => setIsPwaInstalled(true);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("focus", syncInstallState);
    document.addEventListener("visibilitychange", syncInstallState);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("focus", syncInstallState);
      document.removeEventListener("visibilitychange", syncInstallState);
    };
  }, []);

  // 안드로이드 네이티브 설치 프롬프트 띄우기
  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return false;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsPwaInstalled(true);
    }
    setDeferredPrompt(null);
    return outcome === "accepted";
  }, [deferredPrompt]);

  // 브라우저 푸시 알림 권한 요청
  const requestPushPermission = useCallback(async () => {
    if (!("Notification" in window)) return false;

    try {
      const permission = await Notification.requestPermission();
      setPushPermission(permission);
      return permission === "granted";
    } catch (error) {
      console.error("알림 권한 요청 실패:", error);
      return false;
    }
  }, []);

  return {
    osType,
    isPwaInstalled,
    pushPermission,
    promptInstall,
    requestPushPermission,
  };
}
