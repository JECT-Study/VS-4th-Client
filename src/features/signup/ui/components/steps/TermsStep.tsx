import { Checkbox } from "@base/ui/Checkbox";
import type { ReactNode } from "react";
import { useState } from "react";
import type { TermsState } from "../../../model/types";
import { TermsModal } from "./TermsModal";

interface TermsItem {
  key: keyof TermsState;
  label: string;
  required: boolean;
  modalTitle: string;
  modalContent: ReactNode;
}

const TERMS_ITEMS: TermsItem[] = [
  {
    key: "age",
    label: "만 19세 이상이에요",
    required: true,
    modalTitle: "만 19세 이상 확인 안내 [필수]",
    modalContent: (
      <p className="mt-6 text-label-m">
        본 서비스는 「청소년보호법」 법령에 따라
        <br />만 19세 이상 이용자만 이용할 수 있습니다. 이에 따라 회원가입 시 이용자의 연령이 만 19세 이상임을
        확인합니다.
        <br />
        이용자는 본인이 만 19세 이상임을 직접 확인하고 동의해야 합니다. 허위로 입력한 경우 서비스 이용이 제한되거나 회원
        자격이 제한될 수 있습니다.
      </p>
    ),
  },
  {
    key: "privacy",
    label: "개인정보 수집 및 이용 동의",
    required: true,
    modalTitle: "개인정보 수집 및 이용 동의 [필수]",
    modalContent: (
      <>
        <p className="mt-6 text-label-m">VS는 서비스 제공을 위해 아래 정보를 수집합니다.</p>
        <table className="w-full mt-4">
          <thead>
            <tr className="border-t border-b border-grey-stroke">
              <th className="text-label-l py-2 pr-5 text-left">수집 항목</th>
              <th className="text-label-l py-2 pr-5 text-left">이용 목적</th>
              <th className="text-label-l py-2 text-left">보유 기간</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-grey-stroke">
              <td className="text-label-m py-2 pr-5 text-left">성별, 출생 연도</td>
              <td className="text-label-m py-2 pr-5 text-left">회원 식별, 서비스 제공, 맞춤 콘텐츠 추천</td>
              <td className="text-label-m py-2 text-left">회원 탈퇴 시까지</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-4 text-label-m">동의를 거부할 수 있으나 일부 서비스 이용이 제한될 수 있습니다.</p>
      </>
    ),
  },
  {
    key: "tos",
    label: "서비스 이용약관 동의",
    required: true,
    modalTitle: "서비스 이용약관 동의 [필수]",
    modalContent: (
      <p className="mt-6 text-label-m">
        VS는 본 약관에 따라 제공됩니다.
        <br />
        이용자는 「청소년보호법」 및 개인정보 수집 및 이용 동의 내용을 준수해야 합니다.
        <br />
        이를 위반할 경우 서비스 이용이 제한될 수 있습니다.
        <br />
        약관은 변경될 수 있으며 변경 시 사전에 안내드립니다. 이용자가 동의하지 않을 경우 서비스 이용이 제한될 수
        있습니다.
      </p>
    ),
  },
  {
    key: "push",
    label: "푸시 알림 동의",
    required: false,
    modalTitle: "푸시 알림 수신 동의 [선택]",
    modalContent: (
      <p className="mt-6 text-label-m">
        참여한 투표가 종료되면 투표 결과를 푸시로 안내해 드립니다.
        <br />
        동의 후 마이페이지 {">"} 알림 설정에서 알림 권한을 허용하면 투표 결과를 가장 먼저 받아보실 수 있어요.
        <br />
        동의 여부와 관계없이 서비스 이용에는 제한이 없습니다.
        <br />
        푸시 알림 수신 여부는 마이페이지 {">"} 알림 설정에서 언제든지 변경할 수 있습니다.
      </p>
    ),
  },
];

interface TermsStepProps {
  termsState: TermsState;
  isAllChecked: boolean;
  toggleAll: () => void;
  toggleTerm: (key: keyof TermsState) => void;
}

export function TermsStep({ termsState, isAllChecked, toggleAll, toggleTerm }: TermsStepProps) {
  const [openModal, setOpenModal] = useState<keyof TermsState | null>(null);
  const selectedItem = openModal !== null ? TERMS_ITEMS.find((item) => item.key === openModal) : null;

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

      <TermsModal isOpen={openModal !== null} onClose={() => setOpenModal(null)} title={selectedItem?.modalTitle ?? ""}>
        {selectedItem?.modalContent}
      </TermsModal>
    </div>
  );
}
