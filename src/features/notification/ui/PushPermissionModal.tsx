import { Modal } from "@base/ui/Modal";

interface PushPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAllow: () => void;
}

export function PushPermissionModal({ isOpen, onClose, onAllow }: PushPermissionModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="p-6">
      <div className="flex flex-col items-center">
        <h3 className="text-title-m font-bold mb-2">알림을 받아보시겠어요?</h3>
        <p className="text-body-m text-grey-light mb-6 text-center leading-relaxed">
          참여하신 투표의 결과를
          <br />
          푸시 알림으로 알려드려요
        </p>
        <div className="w-full flex flex-col gap-2">
          <button
            onClick={onAllow}
            className="w-full bg-primary-purple text-white py-3.5 rounded-[12px] font-bold text-body-m"
          >
            알림 받기
          </button>
          <button onClick={onClose} className="w-full text-grey-light py-2 text-body-s mt-1 font-medium">
            나중에 할게요
          </button>
        </div>
      </div>
    </Modal>
  );
}
