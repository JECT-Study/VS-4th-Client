import { Checkbox } from "@base/ui/Checkbox";
import { useState } from "react";
import type { TermsState } from "../../../model/types";
import AgeVerificationModal from "./AgeVerificationModal";
import PrivacyPolicyModal from "./PrivacyPolicyModal";
import PushNotificationModal from "./PushNotificationModal";
import TermsOfServiceModal from "./TermsOfServiceModal";

const TERMS_ITEMS: { key: keyof TermsState; label: string; required: boolean }[] = [
  { key: "age", label: "만 19세 이상이에요", required: true },
  { key: "privacy", label: "개인정보 수집 및 이용 동의", required: true },
  { key: "tos", label: "서비스 이용약관 동의", required: true },
  { key: "push", label: "푸시 알림 동의", required: false },
];

interface TermsStepProps {
  termsState: TermsState;
  isAllChecked: boolean;
  toggleAll: () => void;
  toggleTerm: (key: keyof TermsState) => void;
}

export function TermsStep({ termsState, isAllChecked, toggleAll, toggleTerm }: TermsStepProps) {
  const [openModal, setOpenModal] = useState<keyof TermsState | null>(null);

  return (
    <div className="flex flex-col">
      <div>
        <h2 className="text-title-m">약관동의</h2>
        <p className="text-body-s mt-2">
          서비스 제공 및 맞춤 콘텐츠 추천을 위해
          <br />
          성별, 출생 연도를 수집해요
        </p>
      </div>

      <div className="flex flex-col gap-4 mt-24">
        <Checkbox checked={isAllChecked} onChange={toggleAll} label={<span className="text-title-m">전체 동의</span>} />

        <div className="w-full h-px bg-grey-divider" />

        {TERMS_ITEMS.map(({ key, label, required }) => (
          <div key={key} className="flex items-center justify-between">
            <Checkbox
              checked={termsState[key]}
              onChange={() => toggleTerm(key)}
              label={
                <span className="text-body-s flex items-center gap-1">
                  <span>{label}</span> <span className="text-grey-light">[{required ? "필수" : "선택"}]</span>
                </span>
              }
            />
            <button type="button" className="text-grey-light p-1" onClick={() => setOpenModal(key)}>
              <img src="/assets/icons/arrow-right-s.svg" alt={`${label} 상세 보기`} />
            </button>
          </div>
        ))}
      </div>

      <AgeVerificationModal isOpen={openModal === "age"} onClose={() => setOpenModal(null)} />
      <PrivacyPolicyModal isOpen={openModal === "privacy"} onClose={() => setOpenModal(null)} />
      <TermsOfServiceModal isOpen={openModal === "tos"} onClose={() => setOpenModal(null)} />
      <PushNotificationModal isOpen={openModal === "push"} onClose={() => setOpenModal(null)} />
    </div>
  );
}
