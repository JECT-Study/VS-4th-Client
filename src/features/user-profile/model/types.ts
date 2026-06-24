import type { ImageColor } from "@features/signup/model/types";
import type { VoteStatus } from "@features/votes/model/types";

/** 프로필 바텀시트에 노출되는 참여 투표 카드 한 건 */
export interface ProfileVoteItem {
  voteId: number;
  status: VoteStatus;
  /** 투표 제목 (1줄 말줄임) */
  title: string;
  /** 본인이 선택한 선택지 텍스트 (1줄 말줄임) */
  selectedOptionLabel: string;
}

/** 다른 유저 프로필 요약 정보 */
export interface UserProfileSummary {
  nickname: string;
  /** 프로필 아바타 색상 (PROFILE_COLOR 매핑 키) */
  profileIcon: ImageColor;
  /** 참여 투표 총 개수 (예: 24) */
  participatedVoteCount: number;
  /**
   * 최근 활동순 참여 투표 목록.
   * 호출부에서 최신 활동순으로 정렬하고 최대 개수로 제한해 전달.
   */
  recentVotes: ProfileVoteItem[];
}
