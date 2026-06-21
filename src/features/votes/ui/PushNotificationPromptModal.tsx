import { Modal } from "@base/ui/Modal";
import { useNavigate } from "@tanstack/react-router";

type PushNotificationPromptModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const PushNotificationPromptModal = ({ isOpen, onClose }: PushNotificationPromptModalProps) => {
  const navigate = useNavigate();

  const goToMypage = () => {
    onClose();
    navigate({ to: "/mypage" });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="px-5 pt-8 pb-2">
        <p className="text-center text-title-s">투표 결과를 알려드릴까요?</p>
        <p className="mt-2 whitespace-pre-wrap text-center text-body-s text-grey-light">
          투표 마감 후 결과를{"\n"}푸시 알림으로 알려드려요
        </p>

        <div className="mt-8 flex flex-col gap-[2px]">
          <button
            type="button"
            className="w-full rounded-lg bg-primary py-3 text-body-m text-grey-divider"
            onClick={goToMypage}
          >
            설정하러 가기
          </button>
          <button
            type="button"
            className="w-full rounded-lg bg-transparent py-3 text-body-m text-grey-purple"
            onClick={onClose}
          >
            나중에 할게요
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PushNotificationPromptModal;
