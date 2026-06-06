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
        <h3 className="mb-2 text-title-m font-bold text-grey-black">알림을 받아보시겠어요?</h3>
        <p className="mb-6 text-center text-body-m leading-relaxed text-grey-light">
          참여하신 투표의 결과를
          <br />
          푸시 알림으로 알려드려요
        </p>
        <div className="flex w-full flex-col gap-2">
          <button
            type="button"
            onClick={onAllow}
            className="w-full rounded-[12px] bg-primary py-3.5 text-body-m font-bold text-white"
          >
            알림 받기
          </button>
          <button type="button" onClick={onClose} className="mt-1 w-full py-2 text-body-s font-medium text-grey-light">
            나중에 할게요
          </button>
        </div>
      </div>
    </Modal>
  );
}