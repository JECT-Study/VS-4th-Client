import { showToast } from "@base/ui/Toast";
import { userQueryOptions } from "@features/auth/api/userQuery";
import { type FreeVotesResponse, freeVotesQueryKey, freeVotesQueryOptions } from "@features/votes/api/freeVotesQuery";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useCallback, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import { immersiveReactEmoji } from "../api/immersiveVoteEmoji";
import { immersiveParticipate } from "../api/immersiveVoteParticipate";
import { FLOATING_EMOJI_DURATION_MS } from "../config/constants";
import type { EmojiReactionItem, EmojiType, FloatingEmoji, FloatingEmojiOrigin, ImmersiveFeedItem } from "./types";

const emojiAssets: Array<Omit<EmojiReactionItem, "count" | "isMine">> = [
  { type: "LIKE", img: "/assets/images/emoji/smiling-face.png", label: "공감" },
  { type: "SAD", img: "/assets/images/emoji/crying-face.png", label: "슬픔" },
  { type: "ANGRY", img: "/assets/images/emoji/enraged-face.png", label: "분노" },
  { type: "WOW", img: "/assets/images/emoji/smiling-face-with-heart-eyes.png", label: "호감" },
];

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
      emojiAssets.map((emoji) => ({
        ...emoji,
        count: vote.emojiSummary[emoji.type],
        isMine: vote.myEmoji === emoji.type,
      })),
    [vote.emojiSummary, vote.myEmoji],
  );

  const participateMutation = useMutation({
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
        queryClient.setQueryData<FreeVotesResponse>(freeVotesQueryKey, (old) =>
          old ? { ...old, remainingFreeVotes: response.remainingFreeVotes! } : old,
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
        window.setTimeout(() => removeFloatingEmoji(floatingEmoji.id), FLOATING_EMOJI_DURATION_MS);
      }

      updateVote(vote.voteId, (current) => {
        const previous = current.myEmoji;
        const nextEmoji = previous === emoji ? null : emoji;
        const emojiSummary = { ...current.emojiSummary };
        if (previous) emojiSummary[previous] = Math.max(0, emojiSummary[previous] - 1);
        if (nextEmoji) emojiSummary[nextEmoji] += 1;
        emojiSummary.total = emojiSummary.LIKE + emojiSummary.SAD + emojiSummary.ANGRY + emojiSummary.WOW;
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

  const handleOptionClick = useCallback(
    (optionId: number) => {
      if (participateMutation.isPending) return;
      const isNewGuestVote = isGuest && !vote.myVote.voted && vote.myVote.selectedOptionId !== optionId;
      if (isNewGuestVote && freeVotesData !== undefined && freeVotesData.remainingFreeVotes === 0) {
        onFreeVoteLimitExceeded();
        return;
      }
      participateMutation.mutate(optionId);
    },
    [isGuest, freeVotesData, onFreeVoteLimitExceeded, participateMutation, vote.myVote],
  );

  const handleEmojiClick = useCallback(
    (emoji: EmojiType, origin: FloatingEmojiOrigin | null) => {
      if (emojiMutation.isPending) return;
      emojiMutation.mutate({ emoji, origin });
    },
    [emojiMutation],
  );

  return {
    emojiList,
    floatingEmojis,
    handleOptionClick,
    handleEmojiClick,
    removeFloatingEmoji,
  };
}
