import { Switch } from "@base/ui/Switch";
import { showToast } from "@base/ui/Toast";
import { FcmTokenError } from "@features/notification/api/pushToken";
import {
  useRegisterPushTokenMutation,
  useUnregisterPushTokenMutation,
} from "@features/notification/api/pushTokenMutations";
import { resolvePushPlatform } from "@features/notification/model/resolvePushPlatform";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNotificationSetup } from "../model/useNotificationSetup";
import { A2HSModal } from "./A2HSModal";
import { PushPermissionModal } from "./PushPermissionModal";

const PUSH_ENABLE_TIMEOUT_MS = 15_000;
const SLOW_FEEDBACK_DELAY_MS = 2_000;

const debugPush = (message: string, detail?: unknown) => {
  if (!import.meta.env.DEV) return;
  if (detail === undefined) {
    console.debug(`[push] ${message}`);
    return;
  }
  console.debug(`[push] ${message}`, detail);
};

const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> => {
  let timeoutId: number | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timeoutId = window.setTimeout(() => reject(new Error(`${label} timeout`)), timeoutMs);
      }),
    ]);
  } finally {
    if (timeoutId !== undefined) window.clearTimeout(timeoutId);
  }
};

export function NotificationSettingToggle() {
  const { osType, isPwaInstalled, pushPermission, promptInstall } = useNotificationSetup();
  const registerPushTokenMutation = useRegisterPushTokenMutation();
  const unregisterPushTokenMutation = useUnregisterPushTokenMutation();

  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const [isEnablingPush, setIsEnablingPush] = useState(false);
  const [activeModal, setActiveModal] = useState<"none" | "a2hs" | "push">("none");
  const isPending = isEnablingPush || registerPushTokenMutation.isPending || unregisterPushTokenMutation.isPending;

  const isPushSupported = osType !== "other";

  useEffect(() => {
    if (!isPushSupported) {
      setIsPushEnabled(false);
      return;
    }

    setIsPushEnabled(pushPermission === "granted");
  }, [pushPermission, isPushSupported]);

  const handleDisablePush = async () => {
    try {
      debugPush("disable start");
      await unregisterPushTokenMutation.mutateAsync();
      debugPush("disable success");
      setIsPushEnabled(false);
    } catch (error) {
      debugPush("disable failed", error);
      unregisterPushTokenMutation.reset();
      showToast.warning("푸시 알림을 끄지 못했어요. 잠시 후 다시 시도해 주세요.");
    }
  };

  const handleToggle = () => {
    if (isPending) return;

    if (isPushEnabled) {
      void handleDisablePush();
      return;
    }

    if (!isPushSupported) return;

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
    if (isPending) return;

    setIsEnablingPush(true);
    setActiveModal("none");

    const slowFeedbackTimer = window.setTimeout(() => {
      showToast.info("알림 설정 중이에요. 잠시만 기다려 주세요.");
    }, SLOW_FEEDBACK_DELAY_MS);

    void withTimeout(
      Notification.requestPermission().then(async (permission) => {
        debugPush("permission result", { permission });

        if (permission !== "granted") {
          setIsPushEnabled(false);
          showToast.warning("브라우저 설정에서 알림 권한을 허용해 주세요.");
          return;
        }

        const platform = resolvePushPlatform(osType);
        debugPush("register mutation start", { platform });
        await registerPushTokenMutation.mutateAsync(platform);
        debugPush("register mutation success", { platform });
        setIsPushEnabled(true);
        showToast.success("푸시 알림을 켰어요.");
      }),
      PUSH_ENABLE_TIMEOUT_MS,
      "Push notification setup",
    )
      .catch((error) => {
        debugPush("enable failed", error);
        setIsPushEnabled(false);
        registerPushTokenMutation.reset();

        if (error instanceof FcmTokenError) {
          showToast.warning(error.message);
          return;
        }

        if (isAxiosError(error)) {
          if (error.response?.status === 401) {
            showToast.warning("로그인 후 다시 시도해 주세요.");
            return;
          }

          if (error.code === "ECONNABORTED") {
            showToast.warning("서버 응답이 지연되고 있어요. 잠시 후 다시 시도해 주세요.");
            return;
          }
        }

        if (error instanceof Error && error.message.includes("timeout")) {
          showToast.warning("알림 설정이 오래 걸리고 있어요. 잠시 후 다시 시도해 주세요.");
          return;
        }

        showToast.warning("푸시 알림을 켜지 못했어요. 잠시 후 다시 시도해 주세요.");
      })
      .finally(() => {
        window.clearTimeout(slowFeedbackTimer);
        setIsEnablingPush(false);
      });
  };

  return (
    <div className="flex items-center gap-2">
      <Switch checked={isPushEnabled} onChange={handleToggle} disabled={isPending || !isPushSupported} />
      {isPending && <span className="text-body-s text-grey-light">알림 설정 중...</span>}

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
    </div>
  );
}
