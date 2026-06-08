import { useCallback, useEffect, useState } from "react";
import { showToast } from "@base/ui/Toast"; // 토스트 임포트

export type OSType = "android" | "ios" | "ios-outdated" | "other";

interface BeforeInstallPromptEvent extends Event {
  prompt(): void;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

// 💡 핵심 해결: 리액트 라이프사이클 밖에서 이벤트를 전역으로 미리 잡아둡니다.
let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    globalDeferredPrompt = e as BeforeInstallPromptEvent;
  });
}

export function useNotificationSetup() {
  const [osType, setOsType] = useState<OSType>("other");
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    // 1. 기기 OS 및 iOS 버전(웹 푸시 지원 여부) 감지
    const userAgent = window.navigator.userAgent.toLowerCase();

    if (/android/i.test(userAgent)) {
      setOsType("android");
    } else if (/iphone|ipad|ipod/i.test(userAgent)) {
      if ("Notification" in window) {
        setOsType("ios");
      } else {
        setOsType("ios-outdated");
      }
    }

    // 2. PWA(홈 화면) 설치 여부 감지
    const checkIsStandalone = () =>
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in window.navigator && (window.navigator as NavigatorWithStandalone).standalone === true);

    const syncInstallState = () => {
      setIsPwaInstalled(checkIsStandalone());
    };
    syncInstallState();

    // 3. 기존 알림 권한 상태 동기화
    if ("Notification" in window) {
      setPushPermission(Notification.permission);
    }

    // 사용자가 독립된 앱(Standalone) 모드로 진입하는 것을 감지
    const handleAppInstalled = () => setIsPwaInstalled(true);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("focus", syncInstallState);
    document.addEventListener("visibilitychange", syncInstallState);

    return () => {
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("focus", syncInstallState);
      document.removeEventListener("visibilitychange", syncInstallState);
    };
  }, []);

  // 안드로이드 네이티브 설치 프롬프트 띄우기
  const promptInstall = useCallback(async () => {
    // 전역 변수에서 prompt 이벤트를 가져옵니다.
    if (!globalDeferredPrompt) {
      // 이벤트가 잡히지 않은 경우 (카카오톡 인앱 브라우저 등) 직접 설치 유도
      showToast.info("브라우저 메뉴에서 '홈 화면에 추가'를 직접 눌러주세요.");
      return false;
    }

    try {
      globalDeferredPrompt.prompt();
      const { outcome } = await globalDeferredPrompt.userChoice;

      if (outcome === "accepted") {
        setIsPwaInstalled(true);
      }

      // 프롬프트는 단 한 번만 호출할 수 있으므로 사용 후 초기화
      globalDeferredPrompt = null;
      return outcome === "accepted";
    } catch (error) {
      console.error("설치 팝업 띄우기 실패:", error);
      return false;
    }
  }, []);

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
