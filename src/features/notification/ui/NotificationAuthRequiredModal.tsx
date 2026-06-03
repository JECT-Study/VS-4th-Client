import { Modal } from "@base/ui/Modal";
import { useNavigate } from "@tanstack/react-router";

type NotificationAuthRequiredModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function NotificationAuthRequiredModal({ isOpen, onClose }: NotificationAuthRequiredModalProps) {
  const navigate = useNavigate();

  const goToLogin = () => {
    onClose();
    navigate({ to: "/login" });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="px-5 pt-8 pb-2">
        <p className="text-center text-title-s">알림은 회원 전용 기능이에요</p>
        <p className="mt-2 whitespace-pre-wrap text-center text-body-s text-grey-light">
          로그인하면 투표 결과 공개 소식을{"\n"}가장 먼저 받아볼 수 있어요
        </p>

        <div className="mt-8 flex flex-col gap-[2px]">
          <button
            type="button"
            className="w-full rounded-lg bg-primary py-3 text-body-m text-grey-divider"
            onClick={goToLogin}
          >
            회원가입/로그인
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
}
