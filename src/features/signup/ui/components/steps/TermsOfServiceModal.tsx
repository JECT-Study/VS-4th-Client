import { TermsModal } from "./TermsModal";

type TermsOfServiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function TermsOfServiceModal({ isOpen, onClose }: TermsOfServiceModalProps) {
  return (
    <TermsModal isOpen={isOpen} onClose={onClose} title="서비스 이용약관 동의 [필수]">
      <p className="mt-6 text-label-m">
        VS는 본 약관에 따라 제공됩니다.
        <br />
        이용자는 「청소년보호법」 및 개인정보 수집 및 이용 동의 내용을 준수해야 합니다.
        <br />
        이를 위반할 경우 서비스 이용이 제한될 수 있습니다.
        <br />
        약관은 변경될 수 있으며 변경 시 사전에 안내드립니다.이용자가 동의하지 않을 경우 서비스 이용이 제한될 수
        있습니다.
      </p>
    </TermsModal>
  );
}

export default TermsOfServiceModal;
