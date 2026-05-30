import { ChatBottomSheet } from "@features/chat/ui/ChatBottomSheet";
import ChatAuthRequiredModal from "@features/votes/ui/ChatAuthRequiredModal";
import FreeVoteLimitModal from "@features/votes/ui/FreeVoteLimitModal";
import { useCallback, useRef, useState } from "react";
import type { FloatingEmojiOrigin, ImmersiveFeedItem } from "../model/types";
import { useImmersiveVote } from "../model/useImmersiveVote";
import { useImmersiveVoteLive } from "../model/useImmersiveVoteLive";
import { EmojiReactionButton } from "./EmojiReactionButton";
import { FloatingEmojiContainer } from "./FloatingEmojiContainer";
import { ImmersiveShareModal } from "./ImmersiveShareModal";
import { ImmersiveVoteOptions } from "./ImmersiveVoteOptions";
import { ImmersiveVoteTimer } from "./ImmersiveVoteTimer";
import { VoteContentSection } from "./VoteContentSection";

interface ImmersiveVoteCardProps {
  vote: ImmersiveFeedItem;
  updateVote: (voteId: number, updater: (vote: ImmersiveFeedItem) => ImmersiveFeedItem) => void;
}

export function ImmersiveVoteCard({ vote, updateVote }: ImmersiveVoteCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(true);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isChatAuthOpen, setIsChatAuthOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFreeVoteLimitModalOpen, setIsFreeVoteLimitModalOpen] = useState(false);

  const { emojiList, floatingEmojis, handleOptionClick, handleEmojiClick, removeFloatingEmoji } = useImmersiveVote(
    vote,
    updateVote,
    () => setIsFreeVoteLimitModalOpen(true),
  );
  useImmersiveVoteLive(vote, updateVote);

  const openChat = () => {
    // if (user === null) {
    //   setIsChatAuthOpen(true);
    //   return;
    // }
    setIsChatOpen(true);
  };

  const getEmojiOrigin = useCallback((triggerElement: HTMLElement): FloatingEmojiOrigin | null => {
    const cardRect = cardRef.current?.getBoundingClientRect();
    if (!cardRect) return null;

    const triggerRect = triggerElement.getBoundingClientRect();
    return {
      x: triggerRect.left + triggerRect.width / 2 - cardRect.left,
      y: triggerRect.top + triggerRect.height / 2 - cardRect.top,
    };
  }, []);

  return (
    <article ref={cardRef} className="relative h-dvh overflow-hidden bg-grey-black pb-16 text-white">
      {vote.imageUrl && isImageLoaded && (
        <img
          src={vote.imageUrl}
          alt=""
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-65 blur-md"
          onError={() => setIsImageLoaded(false)}
          aria-hidden
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/65" />

      <div className="relative z-10 flex flex-col items-center justify-start py-6">
        <ImmersiveVoteTimer endAt={vote.endAt} />
        <div className="mt-5 w-full">
          <VoteContentSection title={vote.title} content={vote.content} />
        </div>
      </div>

      <div className="absolute left-0 right-0">
        {vote.imageUrl && isImageLoaded ? (
          <img
            src={vote.imageUrl}
            alt=""
            className="w-full aspect-square object-cover"
            onError={() => setIsImageLoaded(false)}
          />
        ) : (
          <div className="w-full aspect-square bg-[#A3A3A3]" />
        )}
      </div>

      <div className="absolute right-3 top-[47%] z-30 flex -translate-y-1/2 flex-col items-center gap-5">
        <EmojiReactionButton
          emojiList={emojiList}
          totalCount={vote.emojiSummary.total}
          getEmojiOrigin={getEmojiOrigin}
          onEmojiClick={handleEmojiClick}
        />

        <button
          type="button"
          className="flex flex-col items-center gap-1 drop-shadow w-12 h-12 justify-center"
          onClick={openChat}
        >
          <span className="flex h-9 w-9 items-center justify-center">
            <img src="/assets/icons/chat.svg" alt="채팅 보기" className="h-7 w-7 invert" />
          </span>
          <span className="text-label-s">{vote.commentCount}</span>
        </button>

        <button
          type="button"
          className="flex h-12 w-12 items-start justify-center"
          onClick={() => setIsShareOpen(true)}
          aria-label="공유하기"
        >
          <img src="/assets/icons/share.svg" alt="" className="h-7 w-7 invert" />
        </button>
      </div>

      <div className="absolute bottom-[106px] left-0 right-0 z-20">
        <ImmersiveVoteOptions vote={vote} onOptionClick={handleOptionClick} />
      </div>

      <p className="absolute bottom-[74px] left-0 right-0 z-20 text-center text-label-s text-[#F7EFED]">
        스와이프해서 다음 투표 보기
      </p>

      <FloatingEmojiContainer floatingEmojis={floatingEmojis} onAnimationEnd={removeFloatingEmoji} />

      <ImmersiveShareModal isOpen={isShareOpen} voteId={vote.voteId} onClose={() => setIsShareOpen(false)} />
      <ChatAuthRequiredModal isOpen={isChatAuthOpen} onClose={() => setIsChatAuthOpen(false)} />
      <FreeVoteLimitModal isOpen={isFreeVoteLimitModalOpen} onClose={() => setIsFreeVoteLimitModalOpen(false)} />
      <ChatBottomSheet isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} voteId={vote.voteId} isDark />
    </article>
  );
}
