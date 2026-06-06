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

export function NotificationSettingToggle() {
  const { osType, isPwaInstalled, pushPermission, promptInstall } = useNotificationSetup();
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

  const handlePushAllow = () => {
    if (isPending || isEnablingRef.current) return;

    isEnablingRef.current = true;
    setActiveModal("none");

    void Notification.requestPermission()
      .then(async (permission) => {
        if (permission !== "granted") {
          setIsPushEnabled(false);
          showToast.warning("브라우저 설정에서 알림 권한을 허용해 주세요.");
          return;
        }

        await registerPushTokenMutation.mutateAsync(resolvePushPlatform(osType));
        setIsPushEnabled(true);
      })
      .catch((error) => {
        setIsPushEnabled(false);

        if (error instanceof FcmTokenError) {
          showToast.warning(error.message);
          return;
        }

        if (isAxiosError(error) && error.response?.status === 401) {
          showToast.warning("로그인 후 다시 시도해 주세요.");
          return;
        }

        showToast.warning("푸시 알림을 켜지 못했어요. 잠시 후 다시 시도해 주세요.");
      })
      .finally(() => {
        isEnablingRef.current = false;
      });
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