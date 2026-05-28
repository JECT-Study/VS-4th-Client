import { useState } from "react";

// TS7006 에러 방지를 위해 string 배열임을 명시적으로 타입 지정해 줍니다.
export const WITHDRAWAL_REASONS: string[] = [
  "투표할 만한 흥미로운 주제가 없어요",
  "마음에 드는 선택지가 없어서 투표하기 애매해요",
  "유저들 간의 의견 대립에 피로감을 느껴요",
  "투표 결과 통계가 생각보다 흥미롭지 않아요",
  "앱 사용법이 복잡하고 어려워요",
  "앱 오류가 잦아요",
  "기타",
];

export function useWithdrawalForm() {
  const [reason, setReason] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [isAgreed, setIsAgreed] = useState<boolean>(false);

  const isFormValid = isAgreed && reason !== "" && (reason !== "기타" || feedback.trim().length >= 10);

  return {
    reason,
    setReason,
    feedback,
    setFeedback,
    isAgreed,
    setIsAgreed,
    isFormValid,
  };
}
