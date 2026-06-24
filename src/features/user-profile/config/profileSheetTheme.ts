/**
 * 유저 프로필 바텀시트 색상 / 텍스트 상수.
 *
 * 색상은 모두 이 파일에서 hex(또는 rgba)로 분리해 두었습니다.
 * 디자인 확정 색상으로 교체할 때 이 파일의 값만 수정하면 됩니다.
 * (light / dark 두 테마를 각각 정의)
 */

export interface ProfileSheetColorTheme {
  /** 바텀시트 배경 */
  sheetBg: string;
  /** 다크 모드 외곽선(Stroke). 라이트 모드는 "transparent" */
  sheetStroke: string;
  /** 상단 드래그 핸들 */
  handle: string;
  /** 헤더(프로필) 하단 구분선 */
  headerDivider: string;
  /** 닉네임 텍스트 */
  nickname: string;
  /** "참여 투표" 섹션 제목 */
  sectionTitle: string;
  /** "참여 투표" 개수 */
  sectionCount: string;
  /** 투표 상태 라벨 - 진행중 */
  statusOngoing: string;
  /** 투표 상태 라벨 - 종료 */
  statusEnded: string;
  /** 투표 제목 */
  voteTitle: string;
  /** 선택한 선택지 칩 배경 */
  optionChipBg: string;
  /** 선택한 선택지 칩 텍스트 */
  optionChipText: string;
  /** 선택지 체크 아이콘 */
  checkIcon: string;
  /** 우측 화살표(>) 아이콘 */
  arrow: string;
}

/** 바텀시트 오픈 시 배경 Dim Layer (#000000, 40%) */
export const PROFILE_SHEET_DIM = "rgba(0, 0, 0, 0.4)";

export const PROFILE_SHEET_COLORS: {
  light: ProfileSheetColorTheme;
  dark: ProfileSheetColorTheme;
} = {
  light: {
    sheetBg: "#FFFFFF",
    sheetStroke: "transparent",
    handle: "#A5A3AF",
    headerDivider: "#EDECEF",
    nickname: "#131313",
    sectionTitle: "#131313",
    sectionCount: "#131313",
    statusOngoing: "#704AF8",
    statusEnded: "#A5A3AF",
    voteTitle: "#434346",
    optionChipBg: "#EDECEF",
    optionChipText: "#434346",
    checkIcon: "#787888",
    arrow: "#CFCFD8",
  },
  dark: {
    sheetBg: "#1B1D20",
    sheetStroke: "#FFFFFF33",
    handle: "#A5A3AF",
    headerDivider: "#434346",
    nickname: "#F3F3F4",
    sectionTitle: "#F3F3F4",
    sectionCount: "#F3F3F4",
    statusOngoing: "#704AF8",
    statusEnded: "#787888",
    voteTitle: "#EDECEF",
    optionChipBg: "#36363A",
    optionChipText: "#787888",
    checkIcon: "#787888",
    arrow: "#A5A3AF",
  },
};

/** 바텀시트 고정 높이 (px) — 콘텐츠 양과 무관하게 고정 */
export const PROFILE_SHEET_HEIGHT_PX = 500;

/** 참여 투표 최대 노출 개수 (더보기 없음) */
export const PROFILE_SHEET_MAX_VOTES = 3;

export const PROFILE_SHEET_TEXT = {
  sectionTitle: "참여 투표",
  statusOngoing: "진행 중",
  statusEnded: "종료",
  deletedVoteToast: "삭제된 투표입니다",
} as const;
