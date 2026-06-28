import * as stompClient from "@base/api/stompClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type TouchEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  type ImmersiveFeedResponse,
  fetchNextImmersiveFeed,
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

function isInsideScrollable(target: Element | null, boundary: Element): boolean {
  let el = target;
  while (el && el !== boundary) {
    const style = getComputedStyle(el);
    const overflowY = style.overflowY;
    if ((overflowY === "auto" || overflowY === "scroll") && el.scrollHeight > el.clientHeight) {
      return true;
    }
    el = el.parentElement;
  }
  return false;
}

const isEligibleFeedVote = (vote: ImmersiveFeedItem) => vote.status !== "ENDED" && vote.myVote?.voted !== true;

const filterEligibleFeedVotes = (items: ImmersiveFeedItem[]) => items.filter(isEligibleFeedVote);

const filterNewEligibleFeedVotes = (items: ImmersiveFeedItem[], seenIds: Set<number>) => {
  const nextSeenIds = new Set(seenIds);

  return filterEligibleFeedVotes(items).filter((vote) => {
    if (nextSeenIds.has(vote.voteId)) return false;
    nextSeenIds.add(vote.voteId);
    return true;
  });
};

export function useImmersiveFeed(startVoteId?: number, startVoteSeq?: number) {
  const queryClient = useQueryClient();
  const { data: initialData, isError } = useQuery(immersiveFeedQueryOptions(startVoteId));

  const [votes, setVotes] = useState<ImmersiveFeedItem[]>([]);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const touchStartY = useRef<number | null>(null);
  const touchStartedInScrollable = useRef(false);
  const trackIndexRef = useRef(0);
  const lastNavigationTime = useRef(0);
  const seenIdsRef = useRef<Set<number>>(new Set());
  const isFetchingMore = useRef(false);
  const isExhaustedRef = useRef(false);
  const needsSeedRef = useRef(true);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    stompClient.activate();
    return () => {
      stompClient.deactivate();
    };
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overscrollBehavior;
    html.style.overscrollBehavior = "none";
    return () => {
      html.style.overscrollBehavior = prev;
    };
  }, []);

  // startVoteId(피드 identity)가 바뀔 때만 새 피드로 1회 재시드하도록 표시한다.
  // (startVoteSeq만 바뀐 같은 투표 재선택에는 재시드하지 않아 프리페치분을 보존)
  // biome-ignore lint/correctness/useExhaustiveDependencies: startVoteId 변경을 트리거로 사용
  useEffect(() => {
    needsSeedRef.current = true;
  }, [startVoteId]);

  // startVoteId 변경 또는 같은 투표 재선택(startVoteSeq) 시 캐러셀을
  // startVoteId 투표(시드 시 맨 앞 = index 0)로 되돌린다.
  // 이때 트랜지션을 잠시 꺼서 현재 위치에서 0으로 되감기는 애니메이션이
  // 보이지 않게 즉시 점프시키고, 다음 프레임에 다시 켠다.
  // biome-ignore lint/correctness/useExhaustiveDependencies: startVoteId/startVoteSeq 변경을 트리거로 사용
  useEffect(() => {
    // 이미 맨 위면 되감을 게 없다(최초 마운트 포함) → 트랜지션을 건드리지 않는다.
    if (trackIndexRef.current === 0) return;
    setIsTransitionEnabled(false);
    setTrackIndex(0);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setIsTransitionEnabled(true));
    });
  }, [startVoteId, startVoteSeq]);

  useEffect(() => {
    if (!initialData || !needsSeedRef.current) return;
    needsSeedRef.current = false;
    const initialItems = initialData.items ?? [];
    const initialSeenIds = new Set<number>();
    const eligibleInitialItems = filterEligibleFeedVotes(initialItems).filter((vote) => {
      if (initialSeenIds.has(vote.voteId)) return false;
      initialSeenIds.add(vote.voteId);
      return true;
    });

    setVotes(eligibleInitialItems);
    seenIdsRef.current = new Set(initialItems.map((v) => v.voteId));
    isExhaustedRef.current = false;
  }, [initialData]);

  const feedLength = votes?.length ?? 0;
  const currentIndex = feedLength === 0 ? 0 : ((trackIndex % feedLength) + feedLength) % feedLength;
  const currentVote = votes?.[currentIndex] ?? votes?.[0];
  const displayedVotes = votes ? [...votes, ...votes] : [];

  useEffect(() => {
    trackIndexRef.current = trackIndex;
  }, [trackIndex]);

  useEffect(() => {
    if (isFetchingMore.current || isExhaustedRef.current) return;
    if (feedLength === 0 || feedLength - currentIndex > PREFETCH_THRESHOLD) return;

    isFetchingMore.current = true;
    const excludeIds = [...seenIdsRef.current];

    fetchNextImmersiveFeed(excludeIds)
      .then((result) => {
        const newItems = result.items ?? [];
        const eligibleNewItems = filterNewEligibleFeedVotes(newItems, seenIdsRef.current);
        for (const vote of newItems) seenIdsRef.current.add(vote.voteId);

        if (newItems.length === 0) {
          isExhaustedRef.current = true;
          return;
        }
        if (eligibleNewItems.length === 0) return;
        setVotes((prev) => [...prev, ...eligibleNewItems]);
      })
      .catch(() => {})
      .finally(() => {
        isFetchingMore.current = false;
      });
  }, [currentIndex, feedLength]);

  const updateVote = useCallback(
    (voteId: number, updater: (vote: ImmersiveFeedItem) => ImmersiveFeedItem) => {
      const updateVotes = (votesList: ImmersiveFeedItem[]) =>
        (votesList ?? []).map((vote) => (vote.voteId === voteId ? updater(vote) : vote));

      setVotes(updateVotes);
      queryClient.setQueriesData<ImmersiveFeedResponse>({ queryKey: immersiveFeedQueryKey }, (old) =>
        old ? { ...old, items: updateVotes(old.items) } : old,
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

  const goToPrevVote = useCallback(() => {
    if (feedLength === 0 || currentIndex === 0) return;
    const now = Date.now();
    if (now - lastNavigationTime.current < WHEEL_NAVIGATION_COOLDOWN_MS) return;

    lastNavigationTime.current = now;
    setIsTransitionEnabled(true);
    setTrackIndex((index) => index - 1);
  }, [feedLength, currentIndex]);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    touchStartY.current = event.touches[0]?.clientY ?? null;
    const container = containerRef.current;
    touchStartedInScrollable.current = container
      ? isInsideScrollable(event.target as Element | null, container)
      : false;
  }, []);

  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      if (touchStartY.current === null) return;
      if (touchStartedInScrollable.current) {
        touchStartY.current = null;
        return;
      }
      const touchEndY = event.changedTouches[0]?.clientY;
      if (touchEndY === undefined) {
        touchStartY.current = null;
        return;
      }

      const deltaY = touchEndY - touchStartY.current;
      if (deltaY < -SWIPE_UP_THRESHOLD) {
        goToNextVote();
      } else if (deltaY > SWIPE_DOWN_THRESHOLD) {
        goToPrevVote();
      }
      touchStartY.current = null;
    },
    [goToNextVote, goToPrevVote],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const preventPullToRefresh = (e: globalThis.TouchEvent) => {
      if (isInsideScrollable(e.target as Element | null, el)) return;
      e.preventDefault();
    };

    el.addEventListener("touchmove", preventPullToRefresh, { passive: false });
    return () => el.removeEventListener("touchmove", preventPullToRefresh);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || feedLength === 0) return;
    const handler = (e: globalThis.WheelEvent) => {
      if (isInsideScrollable(e.target as Element | null, el)) return;
      if (e.deltaY > WHEEL_NAVIGATION_THRESHOLD) {
        e.preventDefault();
        goToNextVote();
      } else if (e.deltaY < -WHEEL_NAVIGATION_THRESHOLD) {
        e.preventDefault();
        goToPrevVote();
      }
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [goToNextVote, goToPrevVote, feedLength]);

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
    // 최초 로딩에만 스피너를 노출한다. 이미 피드가 있는 상태에서의 refetch
    // (startVoteId 진입 등)에는 <main>을 언마운트하지 않아 wheel/touch 리스너가
    // 떨어져 나간 옛 노드에 묶이는 문제를 막는다.
    isLoading: !initialData && feedLength === 0,
    isError,
  };
}
