import { Modal } from "@base/ui/Modal";

type TermsOfServiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const TermsOfServiceModal = ({ isOpen, onClose }: TermsOfServiceModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="py-4 px-5 flex justify-end">
        <button type="button" onClick={onClose}>
          <img src="/assets/icons/close.svg" alt="닫기" className="w-6 h-6" />
        </button>
      </div>

      <div className="text-grey-dark pt-4 px-5 pb-8">
        <p className="text-title-m"> 서비스 이용약관 동의 [필수]</p>

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
      </div>
    </Modal>
  );
};

export default TermsOfServiceModal;
