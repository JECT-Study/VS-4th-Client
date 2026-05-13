import { Modal } from "@base/ui/Modal";
import { showToast } from "@base/ui/Toast";
import { useQuery } from "@tanstack/react-query";
import { immersiveShareQueryOptions } from "../api/immersiveShareQuery";

interface ImmersiveShareModalProps {
  isOpen: boolean;
  voteId: number;
  onClose: () => void;
}

export function ImmersiveShareModal({ isOpen, voteId, onClose }: ImmersiveShareModalProps) {
  const { data, isLoading } = useQuery({
    ...immersiveShareQueryOptions(voteId),
    enabled: isOpen,
  });

  const copyShareUrlToClipboard = async () => {
    if (!data?.shareUrl) {
      showToast.warning("링크 복사에 실패했어요");
      return;
    }

    try {
      await navigator.clipboard.writeText(data.shareUrl);
      onClose();
      showToast.success("링크를 복사했어요");
    } catch {
      showToast.warning("링크 복사에 실패했어요");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative p-5">
        <p className="text-center text-title-s">링크 복사하기</p>
        <div className="mt-7 flex items-center rounded-lg border border-grey-stroke">
          <div className="line-clamp-2 flex-1 px-2 py-1 text-label-s text-grey-light">
            {isLoading ? "공유 링크를 불러오는 중..." : data?.shareUrl}
          </div>
          <button
            type="button"
            className="shrink-0 border-l border-grey-stroke p-3 text-label-m text-grey-light disabled:text-grey-disabled"
            onClick={copyShareUrlToClipboard}
            disabled={isLoading}
          >
            복사
          </button>
        </div>
        <button type="button" className="absolute right-4 top-5" onClick={onClose}>
          <img src="/assets/icons/close.svg" alt="닫기" />
        </button>
      </div>
    </Modal>
  );
}
