import { showToast } from "@base/ui/Toast";
import { userQueryOptions } from "@features/auth/api/userQuery";
import { ChatBottomSheet } from "@features/chat/ui/ChatBottomSheet";
import { useNotificationPrompt } from "@features/notification/model/useNotificationPrompt";
import ChatAuthRequiredModal from "@features/votes/ui/ChatAuthRequiredModal";
import FreeVoteLimitModal from "@features/votes/ui/FreeVoteLimitModal";
import PushNotificationPromptModal from "@features/votes/ui/PushNotificationPromptModal";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { ImmersiveVoteVariant } from "../api/immersiveFeedQuery";
import type { FloatingEmojiOrigin, ImmersiveFeedItem } from "../model/types";
import { useImmersiveVote } from "../model/useImmersiveVote";
import { useImmersiveVoteLive } from "../model/useImmersiveVoteLive";
import { EmojiReactionButton } from "./EmojiReactionButton";
import { FloatingEmojiContainer } from "./FloatingEmojiContainer";
import { ImmersiveShareModal } from "./ImmersiveShareModal";
import { ImmersiveVoteOptions } from "./ImmersiveVoteOptions";
import { ImmersiveVoteTimer } from "./ImmersiveVoteTimer";
import { SwipeNextVoteHint } from "./SwipeNextVoteHint";
import { VoteContentSection, VoteTitle } from "./VoteContentSection";

interface ImmersiveVoteCardProps {
  vote: ImmersiveFeedItem;
  variant: ImmersiveVoteVariant;
  updateVote: (voteId: number, updater: (vote: ImmersiveFeedItem) => ImmersiveFeedItem) => void;
  isSwipeHintVisible: boolean;
}

const DEFAULT_VARIANT_A_STACK_HEIGHT = 248;
const MEDIA_OPTION_GAP = "clamp(12px, 2dvh, 24px)";
const VARIANT_A_MEDIA_MAX_HEIGHT = "min(125vw, max(420px, calc(100dvh - 480px)), 820px)";
const VARIANT_B_MEDIA_MIN_HEIGHT = "min(75vw, 336px, 38dvh)";
const VARIANT_B_MEDIA_MAX_HEIGHT = "min(125vw, 820px)";

export function ImmersiveVoteCard({ vote, variant, updateVote, isSwipeHintVisible }: ImmersiveVoteCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const actionRailRef = useRef<HTMLDivElement>(null);
  const variantAStackRef = useRef<HTMLDivElement>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(true);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const [variantACollapsedStackHeight, setVariantACollapsedStackHeight] = useState(DEFAULT_VARIANT_A_STACK_HEIGHT);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isChatAuthOpen, setIsChatAuthOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFreeVoteLimitModalOpen, setIsFreeVoteLimitModalOpen] = useState(false);
  const isActionRailDisabled = isContentExpanded;
  const {
    isOpen: isPushPromptOpen,
    checkAndShow: checkAndShowPushPrompt,
    handleDismiss: handlePushPromptDismiss,
  } = useNotificationPrompt();

  const { emojiList, floatingEmojis, handleOptionClick, handleEmojiClick, removeFloatingEmoji } = useImmersiveVote(
    vote,
    updateVote,
    () => setIsFreeVoteLimitModalOpen(true),
    checkAndShowPushPrompt,
  );
  useImmersiveVoteLive(vote, updateVote);

  const { data: user } = useQuery(userQueryOptions());

  useLayoutEffect(() => {
    actionRailRef.current?.toggleAttribute("inert", isActionRailDisabled);
  }, [isActionRailDisabled]);

  useLayoutEffect(() => {
    const stack = variantAStackRef.current;
    if (variant !== "A" || isContentExpanded || !stack) return;

    const updateStackHeight = () => {
      const nextHeight = Math.ceil(stack.getBoundingClientRect().height);
      if (nextHeight > 0) {
        setVariantACollapsedStackHeight((currentHeight) => (currentHeight === nextHeight ? currentHeight : nextHeight));
      }
    };

    updateStackHeight();
    const observer = new ResizeObserver(updateStackHeight);
    observer.observe(stack);
    return () => observer.disconnect();
  }, [isContentExpanded, variant]);

  const openChat = () => {
    if (user === null) {
      setIsChatAuthOpen(true);
      return;
    }

    if (!vote.myVote.voted) {
      showToast.warning("투표해야 채팅에 참여할 수 있어요");
      return;
    }

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

  const voteTitle = <VoteTitle title={vote.title} />;
  const voteOptions = <ImmersiveVoteOptions vote={vote} onOptionClick={handleOptionClick} />;
  const voteContentControls = (
    <div className="relative z-10 flex min-h-0 flex-col">
      <VoteContentSection
        content={vote.content}
        isExpanded={isContentExpanded}
        onExpandedChange={setIsContentExpanded}
      />
      <div className="mt-2 shrink-0">
        <ImmersiveVoteTimer endAt={vote.endAt} />
      </div>
    </div>
  );

  const variantAContent = (
    <div className={`absolute inset-0 flex min-h-0 flex-col justify-end ${isContentExpanded ? "z-40" : "z-10"}`}>
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 via-black/80 to-black/[0.85] transition-opacity duration-300 ${
          isContentExpanded ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      />
      <div ref={variantAStackRef} className="relative z-10 flex min-h-0 shrink-0 flex-col pb-[clamp(12px,2.8dvh,24px)]">
        <div className="relative z-20 flex h-[124px] shrink-0 items-start pt-6">{voteOptions}</div>
        <div className="flex min-h-0 flex-col pt-5">{voteContentControls}</div>
      </div>
    </div>
  );

  const variantBContent = (
    <div
      className={`absolute inset-0 flex min-h-0 flex-col justify-end pb-[clamp(12px,2.8dvh,28px)] pt-3 ${
        isContentExpanded ? "z-40" : "z-10"
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 via-black/80 to-black/[0.85] transition-opacity duration-300 ${
          isContentExpanded ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      />
      {voteContentControls}
    </div>
  );

  const voteMediaContent = (
    <>
      {vote.imageUrl && isImageLoaded ? (
        <img
          src={vote.imageUrl}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setIsImageLoaded(false)}
        />
      ) : (
        <div className="h-full w-full bg-[#A3A3A3]" />
      )}

      <div
        ref={actionRailRef}
        className={`absolute inset-y-0 right-2 z-30 flex h-full flex-col items-center justify-end gap-5 ${
          isActionRailDisabled ? "pointer-events-none" : ""
        }`}
        aria-hidden={isActionRailDisabled}
      >
        <EmojiReactionButton
          emojiList={emojiList}
          totalCount={vote.emojiSummary.total}
          getEmojiOrigin={getEmojiOrigin}
          onEmojiClick={handleEmojiClick}
        />

        <button type="button" className="flex h-12 w-12 flex-col items-center justify-center gap-1" onClick={openChat}>
          <span className="flex h-9 w-9 items-center justify-center">
            <img
              src="/assets/icons/chat-reels-big.svg"
              alt="채팅 보기"
              className="h-7 w-7 drop-shadow-[0_0_5px_rgba(0,0,0,0.4)]"
            />
          </span>
          <span className="text-label-s text-[#F7F6F9] drop-shadow-[0_0_5px_rgba(0,0,0,0.4)]">{vote.commentCount}</span>
        </button>

        <button
          type="button"
          className="flex h-12 w-12 items-start justify-center"
          onClick={() => setIsShareOpen(true)}
          aria-label="공유하기"
        >
          <img src="/assets/icons/share-big.svg" alt="" className="h-7 w-7 drop-shadow-[0_0_5px_rgba(0,0,0,0.4)]" />
        </button>
      </div>
    </>
  );

  const variantAMedia = (
    <div
      className="absolute inset-x-0 w-full overflow-hidden"
      style={{
        bottom: `calc(${variantACollapsedStackHeight}px + ${MEDIA_OPTION_GAP})`,
        height: `clamp(220px, calc(100% - ${variantACollapsedStackHeight}px - ${MEDIA_OPTION_GAP}), ${VARIANT_A_MEDIA_MAX_HEIGHT})`,
      }}
    >
      {voteMediaContent}
    </div>
  );

  const variantBMedia = (
    <div
      className="relative w-full shrink-0 overflow-hidden"
      style={{
        height: `clamp(${VARIANT_B_MEDIA_MIN_HEIGHT}, calc(100dvh - 520px), ${VARIANT_B_MEDIA_MAX_HEIGHT})`,
      }}
    >
      {voteMediaContent}
    </div>
  );

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

      <div className="relative z-10 flex h-[calc(100dvh-4rem)] flex-col">
        {variant === "A" ? (
          <div className="relative flex h-full flex-col" data-immersive-variant="A">
            <div className="flex pt-[50px] shrink-0 items-end justify-center pb-6">{voteTitle}</div>
            <div className="relative min-h-0 flex-1">
              {variantAMedia}
              {variantAContent}
            </div>
          </div>
        ) : (
          <div className="relative flex h-full flex-col" data-immersive-variant="B">
            <div className="flex pt-[50px] shrink-0 items-end justify-center pb-5">{voteTitle}</div>
            <div className="flex h-[137px] shrink-0 items-start pt-1.5">{voteOptions}</div>
            <div className="relative min-h-0 flex-1">
              {variantBMedia}
              {variantBContent}
            </div>
          </div>
        )}
        <SwipeNextVoteHint isVisible={isSwipeHintVisible} />
      </div>

      <FloatingEmojiContainer floatingEmojis={floatingEmojis} onAnimationEnd={removeFloatingEmoji} />

      <ImmersiveShareModal isOpen={isShareOpen} voteId={vote.voteId} onClose={() => setIsShareOpen(false)} />
      <ChatAuthRequiredModal isOpen={isChatAuthOpen} onClose={() => setIsChatAuthOpen(false)} />
      <FreeVoteLimitModal isOpen={isFreeVoteLimitModalOpen} onClose={() => setIsFreeVoteLimitModalOpen(false)} />
      <PushNotificationPromptModal isOpen={isPushPromptOpen} onClose={handlePushPromptDismiss} />
      <ChatBottomSheet isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} voteId={vote.voteId} isDark />
    </article>
  );
}
