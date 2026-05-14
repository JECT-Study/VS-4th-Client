import { showToast } from "@base/ui/Toast";
import { userQueryOptions } from "@features/auth/api/userQuery";
import { type FreeVotesResponse, freeVotesQueryKey, freeVotesQueryOptions } from "@features/votes/api/freeVotesQuery";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useCallback, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import { immersiveReactEmoji } from "../api/immersiveVoteEmoji";
import { immersiveParticipate } from "../api/immersiveVoteParticipate";
import { EMOJI_ASSETS } from "../config/emojiAssets";
import type { EmojiReactionItem, EmojiType, FloatingEmoji, FloatingEmojiOrigin, ImmersiveFeedItem } from "./types";

export function useImmersiveVote(
  vote: ImmersiveFeedItem,
  updateVote: (voteId: number, updater: (vote: ImmersiveFeedItem) => ImmersiveFeedItem) => void,
  onFreeVoteLimitExceeded: () => void,
) {
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const { data: user } = useQuery(userQueryOptions());
  const isGuest = user === null;
  const queryClient = useQueryClient();

  const { data: freeVotesData } = useQuery({
    ...freeVotesQueryOptions(),
    enabled: isGuest,
  });

  const emojiList = useMemo<EmojiReactionItem[]>(
    () =>
      EMOJI_ASSETS.map((emoji) => ({
        ...emoji,
        count: vote.emojiSummary[emoji.type],
        isMine: vote.myEmoji === emoji.type,
      })),
    [vote.emojiSummary, vote.myEmoji],
  );

  const participateMutation = useMutation({
    mutationKey: ["immersive-vote", "participate"],
    mutationFn: (optionId: number) => immersiveParticipate(vote.voteId, optionId),
    onMutate: (optionId) => {
      const snapshot = {
        myVote: vote.myVote,
        options: vote.options,
        participantCount: vote.participantCount,
      };
      const isCancel = vote.myVote.selectedOptionId === optionId;
      updateVote(vote.voteId, (current) => {
        if (isCancel) {
          return {
            ...current,
            options: current.options.map((o) => ({ ...o, voteCount: null, ratio: null })),
            myVote: { voted: false, selectedOptionId: null },
            participantCount: Math.max(0, current.participantCount - 1),
          };
        }
        return {
          ...current,
          myVote: { voted: true, selectedOptionId: optionId },
          participantCount: current.myVote.voted ? current.participantCount : current.participantCount + 1,
        };
      });
      return snapshot;
    },
    onSuccess: (response) => {
      updateVote(vote.voteId, (current) => ({
        ...current,
        options: response.options,
        myVote: {
          voted: response.action === "VOTED",
          selectedOptionId: response.selectedOptionId,
        },
      }));
      if (
        isGuest &&
        response.action === "VOTED" &&
        response.remainingFreeVotes !== null &&
        response.remainingFreeVotes > 0
      ) {
        showToast.info(`${response.remainingFreeVotes}회 남았어요`);
      }
      if (isGuest && response.remainingFreeVotes !== null) {
        const remaining = response.remainingFreeVotes;
        queryClient.setQueryData<FreeVotesResponse>(freeVotesQueryKey, (old) =>
          old ? { ...old, remainingFreeVotes: remaining } : old,
        );
      }
    },
    onError: (err, _optionId, snapshot) => {
      if (snapshot) {
        updateVote(vote.voteId, (current) => ({
          ...current,
          myVote: snapshot.myVote,
          options: snapshot.options,
          participantCount: snapshot.participantCount,
        }));
      }
      if (isAxiosError(err) && err.response?.data?.code === "VOTE_FREE_LIMIT_EXCEEDED") {
        onFreeVoteLimitExceeded();
      } else {
        showToast.warning("투표에 실패했어요");
      }
    },
  });

  const removeFloatingEmoji = useCallback((id: string) => {
    setFloatingEmojis((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const emojiMutation = useMutation({
    mutationKey: ["immersive-vote", "emoji"],
    mutationFn: ({ emoji }: { emoji: EmojiType | null; origin: FloatingEmojiOrigin | null }) =>
      immersiveReactEmoji(vote.voteId, emoji),
    onMutate: ({ emoji, origin }) => {
      const snapshot = {
        emojiSummary: vote.emojiSummary,
        myEmoji: vote.myEmoji,
      };
      const next = vote.myEmoji === emoji ? null : emoji;
      const floatingEmoji =
        next === null || origin === null ? null : { id: uuid(), emoji: next, x: origin.x, y: origin.y };

      if (floatingEmoji) {
        setFloatingEmojis((prev) => [...prev, floatingEmoji]);
        // 제거는 FloatingEmojiContainer의 onAnimationEnd에 위임해 이중 제거를 방지함.
      }

      updateVote(vote.voteId, (current) => {
        const previous = current.myEmoji;
        const nextEmoji = previous === emoji ? null : emoji;
        const emojiSummary = { ...current.emojiSummary };
        if (previous) emojiSummary[previous] = Math.max(0, emojiSummary[previous] - 1);
        if (nextEmoji) emojiSummary[nextEmoji] += 1;
        const { total: _t, ...counts } = emojiSummary;
        emojiSummary.total = Object.values(counts).reduce((sum, n) => sum + n, 0);
        return { ...current, emojiSummary, myEmoji: nextEmoji };
      });
      return { ...snapshot, floatingEmojiId: floatingEmoji?.id ?? null };
    },
    onSuccess: (response) => {
      updateVote(vote.voteId, (current) => ({
        ...current,
        emojiSummary: response.emojiSummary,
        myEmoji: response.myEmoji,
      }));
    },
    onError: (_err, _emoji, snapshot) => {
      if (snapshot) {
        updateVote(vote.voteId, (current) => ({
          ...current,
          emojiSummary: snapshot.emojiSummary,
          myEmoji: snapshot.myEmoji,
        }));
        if (snapshot.floatingEmojiId) removeFloatingEmoji(snapshot.floatingEmojiId);
      }
      showToast.warning("이모지 반응에 실패했어요");
    },
  });

  const { mutate: participateMutate, isPending: isParticipatePending } = participateMutation;
  const { mutate: emojiMutate, isPending: isEmojiPending } = emojiMutation;

  const handleOptionClick = useCallback(
    (optionId: number) => {
      if (isParticipatePending) return;
      const isNewGuestVote = isGuest && !vote.myVote.voted && vote.myVote.selectedOptionId !== optionId;
      if (isNewGuestVote) {
        // 로딩 중(undefined)이면 조용히 차단 — 한도 초과 모달을 내보내기엔 근거 없음.
        if (freeVotesData === undefined) return;
        if (freeVotesData.remainingFreeVotes === 0) {
          onFreeVoteLimitExceeded();
          return;
        }
      }
      participateMutate(optionId);
    },
    [isGuest, freeVotesData, onFreeVoteLimitExceeded, isParticipatePending, participateMutate, vote.myVote],
  );

  const handleEmojiClick = useCallback(
    (emoji: EmojiType, origin: FloatingEmojiOrigin | null) => {
      if (isEmojiPending) return;
      emojiMutate({ emoji, origin });
    },
    [isEmojiPending, emojiMutate],
  );

  return {
    emojiList,
    floatingEmojis,
    handleOptionClick,
    handleEmojiClick,
    removeFloatingEmoji,
  };
}
