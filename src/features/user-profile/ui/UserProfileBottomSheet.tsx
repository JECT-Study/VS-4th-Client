import { PROFILE_COLOR } from "@features/signup/config/profileColors";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  PROFILE_SHEET_COLORS,
  PROFILE_SHEET_DIM,
  PROFILE_SHEET_HEIGHT_PX,
  PROFILE_SHEET_MAX_VOTES,
  PROFILE_SHEET_TEXT,
  type ProfileSheetColorTheme,
} from "../config/profileSheetTheme";
import type { ProfileVoteItem, UserProfileSummary } from "../model/types";

const CLOSE_THRESHOLD_RATIO = 0.3;

export interface UserProfileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  /** 프로필 데이터. 로딩 중이면 null */
  profile: UserProfileSummary | null;
  /** 다크 모드 여부 */
  isDark?: boolean;
  /** 참여 투표 카드 탭 시 호출 (랜딩 분기 / 삭제된 투표 처리 등은 호출부 담당) */
  onVoteClick?: (vote: ProfileVoteItem) => void;
}

export function UserProfileBottomSheet({
  isOpen,
  onClose,
  profile,
  isDark = false,
  onVoteClick,
}: UserProfileBottomSheetProps) {
  const theme = isDark ? PROFILE_SHEET_COLORS.dark : PROFILE_SHEET_COLORS.light;

  const containerRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [mounted, setMounted] = useState(false);

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!isOpen) setDragOffset(0);
  }, [isOpen]);

  // 바텀시트 오픈 동안 배경 스크롤 잠금
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // 닫힌 상태에서 포커스 트랩 방지
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (isOpen) {
      el.removeAttribute("inert");
    } else {
      el.setAttribute("inert", "");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleDragMove = useCallback((clientY: number) => {
    setDragOffset(Math.max(0, clientY - startYRef.current));
  }, []);

  const handleDragEnd = useCallback((endClientY: number) => {
    const offset = Math.max(0, endClientY - startYRef.current);
    const sheetHeight = sheetRef.current?.offsetHeight ?? PROFILE_SHEET_HEIGHT_PX;
    setIsDragging(false);
    if (offset > sheetHeight * CLOSE_THRESHOLD_RATIO) {
      onCloseRef.current();
    }
    setDragOffset(0);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const onMouseMove = (e: MouseEvent) => handleDragMove(e.clientY);
    const onMouseUp = (e: MouseEvent) => handleDragEnd(e.clientY);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startYRef.current = e.clientY;
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    setIsDragging(true);
    startYRef.current = touch.clientY;
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      if (touch) handleDragMove(touch.clientY);
    },
    [handleDragMove],
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.changedTouches[0];
      if (touch) handleDragEnd(touch.clientY);
    },
    [handleDragEnd],
  );

  if (!mounted) return null;

  const sheetStyle: React.CSSProperties = {
    height: PROFILE_SHEET_HEIGHT_PX,
    backgroundColor: theme.sheetBg,
    border: `1px solid ${theme.sheetStroke}`,
    ...(isDark && { borderBottom: 0 }),
    ...(isDragging
      ? { transform: `translateY(${dragOffset}px)` }
      : {
          transform: isOpen ? "translateY(0)" : "translateY(100%)",
          transition: "transform 300ms ease-out",
        }),
  };

  return createPortal(
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[60] transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <button
        type="button"
        aria-label="프로필 닫기"
        className="absolute inset-0"
        style={{ backgroundColor: PROFILE_SHEET_DIM }}
        onClick={onClose}
      />

      <div
        ref={sheetRef}
        className="absolute bottom-0 left-2 right-2 flex flex-col rounded-t-2xl shadow-[0_-4px_25px_rgba(0,0,0,0.15)] touch-none select-none"
        style={sheetStyle}
      >
        <div
          className="flex justify-center py-3 shrink-0 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: theme.handle }} />
        </div>

        {profile && <ProfileSheetContent theme={theme} profile={profile} onVoteClick={onVoteClick} />}
      </div>
    </div>,
    document.body,
  );
}

// ---

interface ProfileSheetContentProps {
  theme: ProfileSheetColorTheme;
  profile: UserProfileSummary;
  onVoteClick?: (vote: ProfileVoteItem) => void;
}

function ProfileSheetContent({ theme, profile, onVoteClick }: ProfileSheetContentProps) {
  const votes = profile.recentVotes.slice(0, PROFILE_SHEET_MAX_VOTES);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* 헤더: 아바타 + 닉네임 */}
      <div
        className="flex items-center gap-4 pt-[10px] px-4 pb-5 border-b"
        style={{ borderColor: theme.headerDivider }}
      >
        <img
          src={PROFILE_COLOR[profile.profileIcon]}
          alt=""
          className="object-cover w-14 h-14 rounded-full bg-gray-200 shrink-0"
        />
        <span className="text-title-m truncate" style={{ color: theme.nickname }}>
          {profile.nickname}
        </span>
      </div>

      {/* 참여 투표 영역 */}
      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <div className="flex items-center gap-2 px-4 pt-6 pb-4">
          <span className="text-title-l" style={{ color: theme.sectionTitle }}>
            {PROFILE_SHEET_TEXT.sectionTitle}
          </span>
          <span className="text-title-l" style={{ color: theme.sectionCount }}>
            {profile.participatedVoteCount}
          </span>
        </div>

        {votes.length === 0 ? (
          <div className="text-title-m text-grey-purple flex items-center justify-center py-10">
            참여한 투표가 없습니다
          </div>
        ) : (
          <ul className="flex flex-col px-5 pb-5 space-y-6">
            {votes.map((vote) => (
              <ProfileVoteCard key={vote.voteId} theme={theme} vote={vote} onClick={onVoteClick} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ---

interface ProfileVoteCardProps {
  theme: ProfileSheetColorTheme;
  vote: ProfileVoteItem;
  onClick?: (vote: ProfileVoteItem) => void;
}

function ProfileVoteCard({ theme, vote, onClick }: ProfileVoteCardProps) {
  const isOngoing = vote.status === "ONGOING";
  const statusColor = isOngoing ? theme.statusOngoing : theme.statusEnded;
  const statusLabel = isOngoing ? PROFILE_SHEET_TEXT.statusOngoing : PROFILE_SHEET_TEXT.statusEnded;

  return (
    <li>
      {/* 투표 리스트 전체(activity Frame)를 터치 영역으로 설정 */}
      <button type="button" className="flex items-center w-full gap-1 text-left" onClick={() => onClick?.(vote)}>
        <div className="flex-1 min-w-0">
          <span className="block text-label-l" style={{ color: statusColor }}>
            {statusLabel}
          </span>
          <span className="block mt-1 text-body-m truncate" style={{ color: theme.voteTitle }}>
            {vote.title}
          </span>
          <span
            className="flex items-center gap-1 mt-[6px] px-2 py-1 rounded-[100px] text-label-s"
            style={{ backgroundColor: theme.optionChipBg, color: theme.optionChipText }}
          >
            <CheckIcon color={theme.checkIcon} />
            <span className="truncate">{vote.selectedOptionLabel}</span>
          </span>
        </div>
        <ChevronRightIcon color={theme.arrow} />
      </button>
    </li>
  );
}

// ---

function CheckIcon({ color }: { color: string }): ReactNode {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3.5 8L7 11.5L12.5 5" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon({ color }: { color: string }): ReactNode {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M8 20L16 12L8 4" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
