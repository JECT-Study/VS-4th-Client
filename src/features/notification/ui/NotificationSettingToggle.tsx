import { Switch } from "@base/ui/Switch";
import { useEffect, useState } from "react";
import { useNotificationSetup } from "../model/useNotificationSetup";
import { A2HSModal } from "./A2HSModal";
import { PushPermissionModal } from "./PushPermissionModal";

export function NotificationSettingToggle() {
  const { osType, isPwaInstalled, pushPermission, promptInstall, requestPushPermission } = useNotificationSetup();

  // 로컬 스위치 상태 (권한이 허용되어 있으면 true)
  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const [activeModal, setActiveModal] = useState<"none" | "a2hs" | "push">("none");

  // 권한 상태가 변경될 때마다 스위치 상태 동기화
  useEffect(() => {
    setIsPushEnabled(pushPermission === "granted");
  }, [pushPermission]);

  const handleToggle = () => {
    // 1. 이미 알림이 켜져 있는데 끄려는 경우 (일반적으로 브라우저에서는 스크립트로 권한 회수가 불가능함)
    // 서버에 푸시 토큰 삭제 API를 호출하고 스위치를 끄는 로직이 들어갑니다.
    if (isPushEnabled) {
      // TODO: 백엔드 API (푸시 수신 거부) 호출
      setIsPushEnabled(false);
      return;
    }

    // 2. 알림을 켜려는 경우
    if (!isPwaInstalled) {
      // 설치가 안 되어 있으면 설치 유도 모달 먼저 띄움 (기획 1번)
      setActiveModal("a2hs");
    } else {
      // 이미 설치되어 있으면 바로 권한 요청 모달 띄움 (기획 2번)
      setActiveModal("push");
    }
  };

  const handleA2HSConfirm = async () => {
    if (osType === "android") {
      const accepted = await promptInstall();
      // 안드로이드 유저가 설치를 완료했다면 이어서 푸시 권한 모달 띄우기
      if (accepted) setActiveModal("push");
    } else {
      // iOS는 수동으로 '홈 화면에 추가'를 해야 하므로 모달을 닫음
      setActiveModal("none");
    }
  };

  const handlePushAllow = async () => {
    const isGranted = await requestPushPermission();
    if (isGranted) {
      setIsPushEnabled(true);
      // TODO: 백엔드 API (푸시 토큰 발급 및 서버 전송) 호출
    } else {
      // 사용자가 권한을 차단한 경우
      setIsPushEnabled(false);
      alert("브라우저 설정에서 알림 권한을 허용해 주세요.");
    }
    setActiveModal("none");
  };

  return (
    <>
      <Switch checked={isPushEnabled} onChange={handleToggle} />

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
