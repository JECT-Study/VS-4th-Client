import { userQueryOptions } from "@features/auth/api/userQuery";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { voteDetailQueryOptions } from "../api/voteDetailQuery";
import { reactEmoji } from "../api/voteEmoji";
import { cancelVote, participateVote } from "../api/voteParticipate";
import { voteResultQueryOptions } from "../api/voteResultQuery";
import type { InsightUnlocked, VoteResultOption } from "./resultTypes";
import type { EmojiType, VoteDetail } from "./types";
import { primaryGroupIndex, primaryResultOptionId } from "./voteDetailUtils";

export type VoteUserType = "guest" | "member-voted" | "member-not-voted";

export interface EmojiItem {
  type: EmojiType;
  count: number | undefined;
  isMine: boolean;
  img: string;
}

export interface GenderChartProps {
  primary: { label: string; count: number; color: string };
  secondary: { label: string; count: number; color: string };
}

export interface AgeGroup {
  label: string;
  percentage: number;
  isPrimary: boolean;
  isMyGroup: boolean;
}

export function useVoteDetail(voteId: string) {
  const { data, isLoading: isVoteDetailLoading } = useQuery(voteDetailQueryOptions(voteId));
  const queryClient = useQueryClient();
  const queryKey = ["votes", voteId];

  const isEnded = data?.status === "ENDED";

  const { data: user, isLoading: isUserLoading } = useQuery(userQueryOptions());
  const isGuest = user === null;

  const { data: result, isLoading: isVoteResultLoading } = useQuery({
    ...voteResultQueryOptions(voteId),
    enabled: isEnded,
  });

  const isInitialLoading = isVoteDetailLoading || isUserLoading || (isEnded && isVoteResultLoading);

  const voteUserType: VoteUserType = isGuest ? "guest" : data?.myVote.voted ? "member-voted" : "member-not-voted";

  const participateMutation = useMutation({
    mutationFn: (optionId: number) => participateVote(voteId, optionId),
    onMutate: async (optionId) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<VoteDetail>(queryKey);
      queryClient.setQueryData<VoteDetail>(queryKey, (old) =>
        old ? { ...old, myVote: { voted: true, selectedOptionId: optionId } } : old,
      );
      return { previous };
    },
    onSuccess: (response) => {
      queryClient.setQueryData<VoteDetail>(queryKey, (old) =>
        old
          ? {
              ...old,
              myVote: { voted: true, selectedOptionId: response.selectedOptionId },
              options: response.options,
              participantCount: response.participantCount,
            }
          : old,
      );
    },
    onError: (_err, _optionId, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelVote(voteId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const emojiMutation = useMutation({
    mutationFn: (emoji: EmojiType | null) => reactEmoji(voteId, emoji),
    onMutate: async (emoji) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<VoteDetail>(queryKey);

      queryClient.setQueryData<VoteDetail>(queryKey, (old) => {
        if (!old) return old;
        const prev = old.myEmoji;
        const next = emoji === prev ? null : emoji;
        const updatedSummary = { ...old.emojiSummary };
        if (prev) updatedSummary[prev] = Math.max(0, updatedSummary[prev] - 1);
        if (next) updatedSummary[next] = updatedSummary[next] + 1;
        return { ...old, emojiSummary: updatedSummary, myEmoji: next };
      });

      return { previous };
    },
    onSuccess: (response) => {
      queryClient.setQueryData<VoteDetail>(queryKey, (old) =>
        old
          ? {
              ...old,
              emojiSummary: {
                LIKE: response.emojiSummary.LIKE,
                SAD: response.emojiSummary.SAD,
                ANGRY: response.emojiSummary.ANGRY,
                WOW: response.emojiSummary.WOW,
              },
              myEmoji: response.myEmoji,
            }
          : old,
      );
    },
    onError: (_err, _emoji, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
    },
  });

  const handleOptionClick = (optionId: number) => {
    if (data?.myVote.voted) return;
    participateMutation.mutate(optionId);
  };

  const emojiList: EmojiItem[] = [
    {
      type: "LIKE",
      count: data?.emojiSummary.LIKE,
      isMine: data?.myEmoji === "LIKE",
      img: "/assets/images/emoji/smiling-face.png",
    },
    {
      type: "SAD",
      count: data?.emojiSummary.SAD,
      isMine: data?.myEmoji === "SAD",
      img: "/assets/images/emoji/crying-face.png",
    },
    {
      type: "ANGRY",
      count: data?.emojiSummary.ANGRY,
      isMine: data?.myEmoji === "ANGRY",
      img: "/assets/images/emoji/enraged-face.png",
    },
    {
      type: "WOW",
      count: data?.emojiSummary.WOW,
      isMine: data?.myEmoji === "WOW",
      img: "/assets/images/emoji/smiling-face-with-heart-eyes.png",
    },
  ];

  const resultOptions: VoteResultOption[] = result?.result.options ?? [];
  const insight = result?.insight;
  const unlockedInsight: InsightUnlocked | null = insight && !insight.locked ? (insight as InsightUnlocked) : null;

  const insightPrimaryOptionId: number | null =
    voteUserType === "member-voted" && result?.myVote.selectedOptionId != null
      ? result.myVote.selectedOptionId
      : resultOptions.length > 0
        ? primaryResultOptionId(resultOptions)
        : null;

  const genderChartProps: GenderChartProps = (() => {
    if (voteUserType !== "guest" && unlockedInsight) {
      const { female, male } = unlockedInsight.genderDistribution;
      const isFemaleUser = user?.gender === "FEMALE";
      return {
        primary: isFemaleUser
          ? { label: "여성", count: female.count, color: "#9A9AF6" }
          : { label: "남성", count: male.count, color: "#9A9AF6" },
        secondary: isFemaleUser
          ? { label: "남성", count: male.count, color: "#EDECEF" }
          : { label: "여성", count: female.count, color: "#EDECEF" },
      };
    }
    return {
      primary: { label: "여성", count: 80, color: "#9A9AF6" },
      secondary: { label: "남성", count: 50, color: "#EDECEF" },
    };
  })();

  const ageGroups: AgeGroup[] = (() => {
    if (voteUserType !== "guest" && unlockedInsight) {
      return unlockedInsight.ageDistribution.map((ag, idx, arr) => ({
        label: ag.ageGroup.replace(/(\d+)s/, "$1대"),
        percentage: ag.ratio,
        isMyGroup: ag.isMyGroup,
        isPrimary: voteUserType === "member-voted" ? ag.isMyGroup : idx === primaryGroupIndex(arr),
      }));
    }
    return [
      { label: "20대", percentage: 28, isPrimary: true, isMyGroup: false },
      { label: "30대", percentage: 52, isPrimary: false, isMyGroup: false },
      { label: "40대", percentage: 20, isPrimary: false, isMyGroup: false },
    ];
  })();

  return {
    data,
    result,
    isEnded,
    isInitialLoading,
    voteUserType,
    insightPrimaryOptionId,
    genderChartProps,
    ageGroups,
    emojiList,
    handleOptionClick,
    cancelMutation,
    emojiMutation,
    participateMutation,
  };
}
