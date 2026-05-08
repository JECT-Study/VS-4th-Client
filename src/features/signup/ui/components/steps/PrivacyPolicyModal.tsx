import { Modal } from "@base/ui/Modal";

type AgeVerificationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const PrivacyPolicyModal = ({ isOpen, onClose }: AgeVerificationModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="py-4 px-5 flex justify-end">
        <button type="button" onClick={onClose}>
          <img src="/assets/icons/close.svg" alt="닫기" className="w-6 h-6" />
        </button>
      </div>

      <div className="text-grey-dark pt-4 px-5 pb-8">
        <p className="text-title-m">개인정보 수집 및 이용 동의 [필수]</p>

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
      </div>
    </Modal>
  );
};

export default PrivacyPolicyModal;
