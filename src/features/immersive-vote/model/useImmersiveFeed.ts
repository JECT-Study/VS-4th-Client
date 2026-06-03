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

export function useImmersiveFeed() {
  const queryClient = useQueryClient();
  const { data: initialData, isError } = useQuery(immersiveFeedQueryOptions());

  const [votes, setVotes] = useState<ImmersiveFeedItem[]>([]);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const touchStartY = useRef<number | null>(null);
  const lastNavigationTime = useRef(0);
  const seenIdsRef = useRef<Set<number>>(new Set());
  const isFetchingMore = useRef(false);
  const isExhaustedRef = useRef(false);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    stompClient.activate();
    return () => {
      stompClient.deactivate();
    };
  }, []);

  useEffect(() => {
    if (!initialData) return;
    setVotes(initialData.items ?? []);
    seenIdsRef.current = new Set((initialData.items ?? []).map((v) => v.voteId));
    isExhaustedRef.current = false;
  }, [initialData]);

  const feedLength = votes?.length ?? 0;
  const currentIndex = feedLength === 0 ? 0 : ((trackIndex % feedLength) + feedLength) % feedLength;
  const currentVote = votes?.[currentIndex] ?? votes?.[0];
  const displayedVotes = votes ? [...votes, ...votes] : [];

  useEffect(() => {
    if (isFetchingMore.current || isExhaustedRef.current) return;
    if (feedLength === 0 || feedLength - currentIndex > PREFETCH_THRESHOLD) return;

    isFetchingMore.current = true;
    const excludeIds = [...seenIdsRef.current];

    fetchNextImmersiveFeed(excludeIds)
      .then((result) => {
        const newItems = result.items ?? [];
        if (newItems.length === 0) {
          seenIdsRef.current = new Set();
          return fetchNextImmersiveFeed([]).then((retry) => {
            const retryItems = retry.items ?? [];
            if (retryItems.length === 0) {
              isExhaustedRef.current = true;
              return;
            }
            setVotes((prev) => [...prev, ...retryItems]);
            for (const vote of retryItems) seenIdsRef.current.add(vote.voteId);
          });
        }
        setVotes((prev) => [...prev, ...newItems]);
        for (const vote of newItems) seenIdsRef.current.add(vote.voteId);
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
        goToPrevVote();
      }
      touchStartY.current = null;
    },
    [goToNextVote, goToPrevVote],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el || feedLength === 0) return;
    const handler = (e: globalThis.WheelEvent) => {
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
    isLoading: !initialData,
    isError,
  };
}
