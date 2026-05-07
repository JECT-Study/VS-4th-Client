import { Modal } from "@base/ui/Modal";

type ChatAuthRequiredModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ChatAuthRequiredModal = ({ isOpen, onClose }: ChatAuthRequiredModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="px-5 pt-8 pb-2">
        <p className="text-title-s text-center">채팅은 회원 전용 기능이에요</p>
        <p className="text-center text-body-s text-grey-light mt-2 whitespace-pre-wrap">
          로그인하면 실시간으로 참여하며{"\n"}다양한 의견을 볼 수 있어요
        </p>

        <div className="mt-8 flex flex-col gap-[2px]">
          <button type="button" className="w-full text-grey-divider bg-primary text-body-m py-3 rounded-lg">
            회원가입/로그인
          </button>
          <button
            type="button"
            className="w-full text-grey-purple bg-transparent text-body-m py-3 rounded-lg"
            onClick={onClose}
          >
            나중에 할게요
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ChatAuthRequiredModal;
