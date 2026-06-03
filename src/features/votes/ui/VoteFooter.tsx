import { ChatBottomSheet } from "@features/chat/ui/ChatBottomSheet";
import { useState } from "react";
import SharePageModal from "./SharePageModal";

interface VoteFooterProps {
  voteId: string;
}

const VoteFooter = ({ voteId }: VoteFooterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <footer
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-5 pt-[6px] flex gap-2 bg-white z-10"
      style={{
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 6px)",
        boxShadow: "0px -1px 4px 0px rgba(0, 0, 0, 0.05)",
      }}
    >
      <button
        type="button"
        onClick={() => setIsChatOpen(true)}
        className="flex-[1.5] py-4 text-center text-body-m text-white bg-primary rounded-lg"
      >
        채팅 바로가기
      </button>
      <button
        type="button"
        className="flex-1 py-4 text-center text-body-m text-grey-light border border-grey-stroke rounded-lg"
        onClick={() => setIsOpen(true)}
      >
        공유하기
      </button>

      <SharePageModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <ChatBottomSheet isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} voteId={Number(voteId)} />
    </footer>
  );
};

export default VoteFooter;
