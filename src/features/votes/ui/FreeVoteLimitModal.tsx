import { Modal } from "@base/ui/Modal";
import { useNavigate } from "@tanstack/react-router";

type FreeVoteLimitModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const FreeVoteLimitModal = ({ isOpen, onClose }: FreeVoteLimitModalProps) => {
  const navigate = useNavigate();

  const goToLogin = () => {
    onClose();
    navigate({ to: "/login" });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="px-5 pt-8 pb-2">
        <p className="text-title-s text-center">투표권 5회를 모두 사용했어요</p>
        <p className="text-center text-body-s text-grey-light mt-2 whitespace-pre-wrap">
          로그인하고 투표와 실시간 채팅을{"\n"}무제한으로 즐겨보세요
        </p>

        <div className="mt-8 flex flex-col gap-[2px]">
          <button
            type="button"
            className="w-full text-grey-divider bg-primary text-body-m py-3 rounded-lg"
            onClick={goToLogin}
          >
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

export default FreeVoteLimitModal;
