import { showToast } from "@base/ui/Toast";
import { userQueryOptions } from "@features/auth/api/userQuery";
import { voteDetailQueryOptions } from "@features/votes/api/voteDetailQuery";
import type { VoteDetail } from "@features/votes/model/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { useCallback, useState } from "react";
import { userProfileQueryOptions } from "../api/userProfileQuery";
import { PROFILE_SHEET_TEXT } from "../config/profileSheetTheme";
import type { ProfileVoteItem } from "../model/types";

/** 프로필 진입 전 사용자가 머무르던 투표 화면 타입 (랜딩 분기 기준) */
export type ProfileOriginSurface = "immersive" | "general";

interface UseUserProfileSheetParams {
  originSurface: ProfileOriginSurface;
  /**
   * 투표 카드 탭으로 실제 랜딩(라우팅)이 일어나기 직전 호출.
   * 프로필 시트 아래에 열려 있던 채팅 바텀시트를 함께 닫는 용도.
   * 삭제된 투표 등 랜딩이 없는 경우에는 호출되지 않는다.
   */
  onLanding?: () => void;
}

/**
 * 채팅 화면에서 유저 프로필 바텀시트를 여닫고, 데이터 조회/투표 랜딩을 처리하는 컨트롤러.
 *
 * - 비회원은 시트를 열 수 없다 (openProfile no-op).
 * - 투표 카드 탭 시 상태/화면타입에 따라 랜딩하며, 삭제된 투표는 토스트만 노출.
 */
export function useUserProfileSheet({ originSurface, onLanding }: UseUserProfileSheetParams) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: currentUser } = useQuery(userQueryOptions());

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const { data: profile } = useQuery(userProfileQueryOptions(selectedUserId));

  const openProfile = useCallback(
    (userId: number | undefined) => {
      // 비회원 진입 시 노출되지 않음
      if (!currentUser) return;
      if (userId == null) return;
      setSelectedUserId(userId);
    },
    [currentUser],
  );

  const close = useCallback(() => setSelectedUserId(null), []);

  const handleVoteClick = useCallback(
    async (vote: ProfileVoteItem) => {
      let detail: VoteDetail;
      try {
        detail = await queryClient.fetchQuery(voteDetailQueryOptions(String(vote.voteId)));
      } catch (error) {
        // 삭제된 투표(404 등 접근 불가) → 토스트만, 랜딩 없음
        if (isAxiosError(error)) {
          showToast.warning(PROFILE_SHEET_TEXT.deletedVoteToast);
          return;
        }
        throw error;
      }

      const isOngoing = detail.status !== "ENDED";
      // 프로필 시트와 그 아래 채팅 바텀시트를 함께 닫은 뒤 랜딩
      close();
      onLanding?.();

      // 진행중 + 몰입형 → 몰입형 투표, 그 외(진행중 일반형 / 종료) → 일반형 투표 상세(결과 포함)
      if (isOngoing && originSurface === "immersive") {
        // startVoteSeq로 매 선택을 구분 → 같은 투표를 다시 눌러도 해당 투표로 이동한다.
        // replace로 재선택 토큰이 히스토리에 쌓이지 않게 한다(주소·뒤로가기 정리).
        navigate({
          to: "/immersive-votes",
          search: { startVoteId: vote.voteId, startVoteSeq: Date.now() },
          replace: true,
        });
        return;
      }
      navigate({ to: "/votes/$voteId", params: { voteId: String(vote.voteId) } });
    },
    [navigate, queryClient, originSurface, close, onLanding],
  );

  return {
    isOpen: selectedUserId != null,
    profile: profile ?? null,
    openProfile,
    close,
    handleVoteClick,
  };
}
