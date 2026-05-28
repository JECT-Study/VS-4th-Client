import { Modal } from "@base/ui/Modal";

type LeaveConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const LeaveConfirmationModal = ({ isOpen, onClose, onConfirm }: LeaveConfirmationModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="px-5 pt-8 pb-2">
        <p className="text-title-s text-center">입력을 그만둘까요?</p>
        <p className="text-center text-body-s text-grey-light mt-2">작성 중이던 내용이 초기화돼요</p>

        <div className="mt-8 flex flex-col gap-[2px]">
          <button
            type="button"
            className="w-full text-grey-divider bg-primary text-body-m py-3 rounded-lg"
            onClick={onClose}
          >
            계속 입력하기
          </button>
          <button
            type="button"
            className="w-full text-grey-purple bg-transparent text-body-m py-3 rounded-lg"
            onClick={onConfirm}
          >
            나가기
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LeaveConfirmationModal;
