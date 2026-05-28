import { Modal } from "@base/ui/Modal";
import { showToast } from "@base/ui/Toast";

interface ImmersiveShareModalProps {
  isOpen: boolean;
  voteId: number;
  onClose: () => void;
}

export function ImmersiveShareModal({ isOpen, voteId, onClose }: ImmersiveShareModalProps) {
  const urlToCopy = `${window.location.origin}${window.location.pathname}?startVoteId=${voteId}`;

  const copyPageUrlToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(urlToCopy);
      onClose();
      showToast.success("링크를 복사했어요.");
    } catch {
      showToast.warning("링크를 복사하지 못했어요.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-5 relative">
        <p className="text-title-s text-center">링크 복사하기</p>
        <div className="border border-grey-stroke rounded-lg flex items-center mt-7">
          <div className="py-1 px-2 text-label-s text-grey-light flex-1 line-clamp-2">{urlToCopy}</div>
          <button
            type="button"
            className="text-label-m text-grey-light p-3 shrink-0 border-l border-grey-stroke"
            onClick={copyPageUrlToClipboard}
          >
            복사
          </button>
        </div>
        <button type="button" className="absolute top-5 right-4" onClick={onClose}>
          <img src="/assets/icons/close.svg" alt="닫기" />
        </button>
      </div>
    </Modal>
  );
}
