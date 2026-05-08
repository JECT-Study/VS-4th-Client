import { Modal } from "@base/ui/Modal";

type PushNotificationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const PushNotificationModal = ({ isOpen, onClose }: PushNotificationModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="py-4 px-5 flex justify-end">
        <button type="button" onClick={onClose}>
          <img src="/assets/icons/close.svg" alt="닫기" className="w-6 h-6" />
        </button>
      </div>

      <div className="text-grey-dark pt-4 px-5 pb-8">
        <p className="text-title-m">푸시 알림 수신 동의 [선택]</p>

        <p className="mt-6 text-label-m">
          참여한 투표가 종료되면 투표 결과를 푸시로 안내해 드립니다.
          <br />
          동의 후 마이페이지 &gt; 알림 설정에서 알림 권한을 허용하면 투표 결과를 가장 먼저 받아보실 수 있어요.
          <br />
          동의 여부와 관계없이 서비스 이용에는 제한이 없습니다.
          <br />
          푸시 알림 수신 여부는 마이페이지 &gt; 알림 설정에서 언제든지 변경할 수 있습니다.
        </p>
      </div>
    </Modal>
  );
};

export default PushNotificationModal;
