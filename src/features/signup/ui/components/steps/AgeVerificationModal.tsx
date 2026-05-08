import { Modal } from "@base/ui/Modal";

type AgeVerificationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AgeVerificationModal = ({ isOpen, onClose }: AgeVerificationModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="py-4 px-5 flex justify-end">
        <button type="button" onClick={onClose}>
          <img src="/assets/icons/close.svg" alt="닫기" className="w-6 h-6" />
        </button>
      </div>

      <div className="text-grey-dark pt-4 px-5 pb-8">
        <p className="text-title-m">만 19세 이상 확인 안내 [필수]</p>

        <p className="mt-6 text-label-m">
          본 서비스는 「청소년보호법」 법령에 따라
          <br />만 19세 이상 이용자만 이용할 수 있습니다. 이에 따라 회원가입 시 이용자의 연령이 만 19세 이상임을
          확인합니다.
          <br />
          이용자는 본인이 만 19세 이상임을 직접 확인하고 동의해야 합니다. 허위로 입력한 경우 서비스 이용이 제한되거나
          회원 자격이 제한될 수 있습니다.
        </p>
      </div>
    </Modal>
  );
};

export default AgeVerificationModal;
