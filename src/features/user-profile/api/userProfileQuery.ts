import { apiClient } from "@base/api/client";
import type { ImageColor } from "@features/signup/model/types";
import type { VoteStatus } from "@features/votes/model/types";
import { queryOptions } from "@tanstack/react-query";
import type { UserProfileSummary } from "../model/types";

/**
 * 타 유저 프로필 바텀시트 조회.
 * 엔드포인트: GET /api/users/{userId}/profile-sheet
 * (API 스펙 문서에는 아직 미반영)
 */
interface ProfileSheetVoteResponse {
  voteId: number;
  title: string;
  status: VoteStatus;
  selectedOptionLabel: string;
  /** 조회자(현재 로그인 유저)의 해당 투표 참여 여부 */
  viewerParticipated: boolean;
}

interface UserProfileSheetResponse {
  userId: number;
  nickname: string;
  imageColor: ImageColor;
  participatedVoteCount: number;
  recentParticipatedVotes: ProfileSheetVoteResponse[];
}

const USER_PROFILE_ENDPOINT = (userId: number) => `/api/users/${userId}/profile-sheet`;

export const getUserProfile = async (userId: number): Promise<UserProfileSummary> => {
  const { data } = await apiClient.get<UserProfileSheetResponse>(USER_PROFILE_ENDPOINT(userId));
  return {
    nickname: data.nickname,
    profileIcon: data.imageColor,
    participatedVoteCount: data.participatedVoteCount,
    recentVotes: (data.recentParticipatedVotes ?? []).map((vote) => ({
      voteId: vote.voteId,
      status: vote.status,
      title: vote.title,
      selectedOptionLabel: vote.selectedOptionLabel,
    })),
  };
};

export const userProfileQueryOptions = (userId: number | null) =>
  queryOptions<UserProfileSummary>({
    queryKey: ["user-profile", userId],
    queryFn: () => getUserProfile(userId as number),
    enabled: userId != null,
    staleTime: 1000 * 60,
  });
