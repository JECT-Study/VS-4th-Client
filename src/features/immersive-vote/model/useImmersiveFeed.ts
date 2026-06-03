import * as stompClient from "@base/api/stompClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type TouchEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  type ImmersiveFeedResponse,
  immersiveFeedQueryKey,
  immersiveFeedQueryOptions,
} from "../api/immersiveFeedQuery";
import {
  PREFETCH_THRESHOLD,
  SWIPE_DOWN_THRESHOLD,
  SWIPE_UP_THRESHOLD,
  WHEEL_NAVIGATION_COOLDOWN_MS,
  WHEEL_NAVIGATION_THRESHOLD,
} from "../config/constants";
import type { ImmersiveFeedItem } from "./types";

export function useImmersiveFeed(startVoteId?: number) {
  const queryClient = useQueryClient();
  const { data: initialData, isError } = useQuery(immersiveFeedQueryOptions(undefined, startVoteId));

  const [votes, setVotes] = useState<ImmersiveFeedItem[]>([]);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const touchStartY = useRef<number | null>(null);
  const trackIndexRef = useRef(0);
  const lastNavigationTime = useRef(0);
  const nextCursorRef = useRef<number | null>(null);
  const isFetchingMore = useRef(false);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    stompClient.activate();
    return () => {
      stompClient.deactivate();
    };
  }, []);

  useEffect(() => {
    if (!initialData) return;
    // 1. 방어 코드: initialData.votes가 없더라도 항상 배열을 유지하도록 보장합니다.
    setVotes(initialData.votes ?? []);
    nextCursorRef.current = initialData.nextCursor ?? null;
  }, [initialData]);

  // 2. 방어 코드: votes가 비정상적인 상태여도 feedLength가 undefined가 되지 않게 기본값 0 할당
  const feedLength = votes?.length ?? 0;
  const currentIndex = feedLength === 0 ? 0 : ((trackIndex % feedLength) + feedLength) % feedLength;

  // 3. 방어 코드: votes가 빈 배열일 경우 undefined를 안전하게 반환
  const currentVote = votes?.[currentIndex] ?? votes?.[0];
  const displayedVotes = votes ? [...votes, ...votes] : [];

  useEffect(() => {
    trackIndexRef.current = trackIndex;
  }, [trackIndex]);

  useEffect(() => {
    if (isFetchingMore.current || !nextCursorRef.current) return;
    if (feedLength === 0 || feedLength - currentIndex > PREFETCH_THRESHOLD) return;

    isFetchingMore.current = true;
    const cursor = nextCursorRef.current;
    queryClient
      .fetchQuery(immersiveFeedQueryOptions(cursor))
      .then((result) => {
        // 4. 추가 로드 시에도 방어 코드 적용
        setVotes((prev) => [...prev, ...(result.votes ?? [])]);
        nextCursorRef.current = result.nextCursor ?? null;
      })
      .catch(() => {})
      .finally(() => {
        isFetchingMore.current = false;
      });
  }, [currentIndex, feedLength, queryClient]);

  const updateVote = useCallback(
    (voteId: number, updater: (vote: ImmersiveFeedItem) => ImmersiveFeedItem) => {
      const updateVotes = (votesList: ImmersiveFeedItem[]) =>
        (votesList ?? []).map((vote) => (vote.voteId === voteId ? updater(vote) : vote));

      setVotes(updateVotes);
      queryClient.setQueriesData<ImmersiveFeedResponse>({ queryKey: immersiveFeedQueryKey }, (old) =>
        old ? { ...old, votes: updateVotes(old.votes) } : old,
      );
    },
    [queryClient],
  );

  const goToNextVote = useCallback(() => {
    if (feedLength === 0) return;
    const now = Date.now();
    if (now - lastNavigationTime.current < WHEEL_NAVIGATION_COOLDOWN_MS) return;

    lastNavigationTime.current = now;
    setIsTransitionEnabled(true);
    setTrackIndex((index) => index + 1);
  }, [feedLength]);

  const goToPreviousVote = useCallback(() => {
    if (feedLength === 0) return;
    const now = Date.now();
    if (now - lastNavigationTime.current < WHEEL_NAVIGATION_COOLDOWN_MS) return;

    lastNavigationTime.current = now;
    const index = trackIndexRef.current;

    if (index > 0) {
      setIsTransitionEnabled(true);
      setTrackIndex(index - 1);
      return;
    }

    // 첫 카드에서 이전으로: 복제 구간으로 점프한 뒤 마지막 투표로 애니메이션
    setIsTransitionEnabled(false);
    setTrackIndex(feedLength);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setIsTransitionEnabled(true);
        setTrackIndex(feedLength - 1);
      });
    });
  }, [feedLength]);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    touchStartY.current = event.touches[0]?.clientY ?? null;
  }, []);

  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      if (touchStartY.current === null) return;
      const touchEndY = event.changedTouches[0]?.clientY;
      if (touchEndY === undefined) {
        touchStartY.current = null;
        return;
      }

      const deltaY = touchEndY - touchStartY.current;
      if (deltaY < -SWIPE_UP_THRESHOLD) {
        goToNextVote();
      } else if (deltaY > SWIPE_DOWN_THRESHOLD) {
        goToPreviousVote();
      }
      touchStartY.current = null;
    },
    [goToNextVote, goToPreviousVote],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el || feedLength === 0) return;
    const handler = (e: globalThis.WheelEvent) => {
      if (Math.abs(e.deltaY) < WHEEL_NAVIGATION_THRESHOLD) return;
      e.preventDefault();
      if (e.deltaY > 0) {
        goToNextVote();
      } else {
        goToPreviousVote();
      }
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [goToNextVote, goToPreviousVote, feedLength]);

  const handleTrackTransitionEnd = useCallback(() => {
    if (feedLength === 0) return;
    if (trackIndex < feedLength) return;

    setIsTransitionEnabled(false);
    setTrackIndex(currentIndex);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setIsTransitionEnabled(true));
    });
  }, [currentIndex, feedLength, trackIndex]);

  const trackOffset = trackIndex * 100;

  const trackStyle = {
    transform: `translate3d(0, -${trackOffset}dvh, 0)`,
  };

  const trackClassName = isTransitionEnabled ? "transition-transform duration-500 ease-out" : "";

  return {
    votes,
    displayedVotes,
    currentVote,
    currentIndex,
    updateVote,
    handleTouchStart,
    handleTouchEnd,
    containerRef,
    handleTrackTransitionEnd,
    trackClassName,
    trackStyle,
    isLoading: !initialData,
    isError,
  };
}
