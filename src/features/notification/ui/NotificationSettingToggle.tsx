import { isServiceWorkerControlling } from "@base/push/serviceWorker";
import { Switch } from "@base/ui/Switch";
import { showToast } from "@base/ui/Toast";
import { FcmTokenError } from "@features/notification/api/pushToken";
import {
  useRegisterPushTokenMutation,
  useUnregisterPushTokenMutation,
} from "@features/notification/api/pushTokenMutations";
import { resolvePushPlatform } from "@features/notification/model/resolvePushPlatform";
import { isAxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { useNotificationSetup } from "../model/useNotificationSetup";
import { A2HSModal } from "./A2HSModal";
import { PushPermissionModal } from "./PushPermissionModal";

const SW_RELOAD_FLAG = "vs:sw-reload-attempted";

export function NotificationSettingToggle() {
  const { osType, isPwaInstalled, pushPermission, promptInstall, requestPushPermission } = useNotificationSetup();
  const registerPushTokenMutation = useRegisterPushTokenMutation();
  const unregisterPushTokenMutation = useUnregisterPushTokenMutation();
  const isEnablingRef = useRef(false);

  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const [activeModal, setActiveModal] = useState<"none" | "a2hs" | "push">("none");
  const isPending = registerPushTokenMutation.isPending || unregisterPushTokenMutation.isPending;

  useEffect(() => {
    setIsPushEnabled(pushPermission === "granted");
  }, [pushPermission]);

  const handleDisablePush = async () => {
    try {
      await unregisterPushTokenMutation.mutateAsync();
      setIsPushEnabled(false);
    } catch {
      showToast.warning("푸시 알림을 끄지 못했어요. 잠시 후 다시 시도해 주세요.");
    }
  };

  const handleToggle = () => {
    if (isPending || isEnablingRef.current) return;

    if (isPushEnabled) {
      void handleDisablePush();
      return;
    }

    if (osType === "ios-outdated" || ((osType === "android" || osType === "ios") && !isPwaInstalled)) {
      setActiveModal("a2hs");
      return;
    }

    setActiveModal("push");
  };

  const handleA2HSConfirm = async () => {
    if (osType === "android") {
      const isInstalled = await promptInstall();
      setActiveModal(isInstalled ? "push" : "none");
      return;
    }

    setActiveModal("push");
  };

  const reloadOnceForServiceWorker = () => {
    if (sessionStorage.getItem(SW_RELOAD_FLAG) === "1") return false;

    sessionStorage.setItem(SW_RELOAD_FLAG, "1");
    window.location.reload();
    return true;
  };

  const handlePushAllow = () => {
    if (isPending || isEnablingRef.current) return;

    isEnablingRef.current = true;

    void (async () => {
      try {
        const isGranted = await requestPushPermission();
        if (!isGranted) {
          setIsPushEnabled(false);
          showToast.warning("브라우저 설정에서 알림 권한을 허용해 주세요.");
          return;
        }

        if (!isServiceWorkerControlling()) {
          if (reloadOnceForServiceWorker()) return;
          showToast.warning("앱 준비가 필요해요. 앱을 완전히 종료한 뒤 다시 열어 주세요.");
          return;
        }

        await registerPushTokenMutation.mutateAsync(resolvePushPlatform(osType));
        setIsPushEnabled(true);
      } catch (error) {
        setIsPushEnabled(false);

        if (error instanceof FcmTokenError) {
          if (error.code === "UNSUPPORTED") {
            showToast.warning("이 기기/브라우저에서는 푸시 알림을 지원하지 않아요.");
          } else if (error.code === "SERVICE_WORKER_UNAVAILABLE") {
            showToast.warning("앱 준비 중이에요. 잠시 후 다시 시도해 주세요.");
          } else {
            console.error("FCM token error:", error.cause ?? error);
            showToast.warning("푸시 토큰을 발급하지 못했어요. 앱을 완전히 종료한 뒤 다시 열어 주세요.");
          }
          return;
        }

        if (isAxiosError(error) && error.response?.status === 401) {
          showToast.warning("로그인 후 다시 시도해 주세요.");
          return;
        }

        showToast.warning("푸시 알림을 켜지 못했어요. 잠시 후 다시 시도해 주세요.");
      } finally {
        isEnablingRef.current = false;
        setActiveModal("none");
      }
    })();
  };

  return (
    <>
      <Switch checked={isPushEnabled} onChange={handleToggle} disabled={isPending} />

      <A2HSModal
        isOpen={activeModal === "a2hs"}
        os={osType}
        onClose={() => setActiveModal("none")}
        onConfirm={handleA2HSConfirm}
      />

      <PushPermissionModal
        isOpen={activeModal === "push"}
        onClose={() => setActiveModal("none")}
        onAllow={handlePushAllow}
      />
    </>
  );
}