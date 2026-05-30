import { useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import SharePageModal from "./SharePageModal";

export function VoteHeader({ isEnded }: { isEnded: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const router = useRouter();

  function handleBack() {
    if (window.history.length > 1) {
      router.history.back();
    } else {
      navigate({ to: "/home" });
    }
  }

  return (
    <header className="pr-2 py-[6px] pl-1 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button type="button" onClick={handleBack} className="p-[10px]">
          <img src="/assets/icons/arrow-left.svg" alt="뒤로가기" />
        </button>
        <h1 className="text-title-m text-grey-black">{isEnded ? "투표 마감 최종결과" : "투표 상세"}</h1>
      </div>

      {!isEnded && (
        <button type="button" onClick={() => setIsOpen(true)} className="p-[10px]">
          <img src="/assets/icons/share.svg" alt="공유하기" />
        </button>
      )}

      <SharePageModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </header>
  );
}
