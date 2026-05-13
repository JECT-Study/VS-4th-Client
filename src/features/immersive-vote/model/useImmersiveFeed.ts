import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type TouchEvent, type WheelEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  type ImmersiveFeedResponse,
  immersiveFeedQueryKey,
  immersiveFeedQueryOptions,
} from "../api/immersiveFeedQuery";
import { SWIPE_UP_THRESHOLD, WHEEL_NAVIGATION_COOLDOWN_MS, WHEEL_NAVIGATION_THRESHOLD } from "../config/constants";
import type { ImmersiveFeedItem } from "./types";

const PREFETCH_THRESHOLD = 3;

export function useImmersiveFeed() {
  const queryClient = useQueryClient();
  const { data: initialData } = useQuery(immersiveFeedQueryOptions());

  const [votes, setVotes] = useState<ImmersiveFeedItem[]>([]);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const touchStartY = useRef<number | null>(null);
  const lastNavigationTime = useRef(0);
  const nextCursorRef = useRef<number | null>(null);
  const isFetchingMore = useRef(false);

  useEffect(() => {
    if (!initialData) return;
    setVotes(initialData.votes);
    nextCursorRef.current = initialData.nextCursor;
  }, [initialData]);

  const feedLength = votes.length;
  const currentIndex = feedLength === 0 ? 0 : ((trackIndex % feedLength) + feedLength) % feedLength;
  const currentVote = votes[currentIndex] ?? votes[0];
  const displayedVotes = [...votes, ...votes];

  useEffect(() => {
    if (isFetchingMore.current || !nextCursorRef.current) return;
    if (feedLength === 0 || feedLength - currentIndex > PREFETCH_THRESHOLD) return;

    isFetchingMore.current = true;
    const cursor = nextCursorRef.current;
    queryClient.fetchQuery(immersiveFeedQueryOptions(cursor)).then((result) => {
      setVotes((prev) => [...prev, ...result.votes]);
      nextCursorRef.current = result.nextCursor;
      isFetchingMore.current = false;
    });
  }, [currentIndex, feedLength, queryClient]);

  const updateVote = useCallback(
    (voteId: number, updater: (vote: ImmersiveFeedItem) => ImmersiveFeedItem) => {
      const updateVotes = (votes: ImmersiveFeedItem[]) =>
        votes.map((vote) => (vote.voteId === voteId ? updater(vote) : vote));

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

  const handleTouchStart = useCallback((event: TouchEvent) => {
    touchStartY.current = event.touches[0]?.clientY ?? null;
  }, []);

  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      if (touchStartY.current === null) return;
      const touchEndY = event.changedTouches[0]?.clientY;
      if (touchEndY === undefined) return;

      const deltaY = touchEndY - touchStartY.current;
      if (deltaY < -SWIPE_UP_THRESHOLD) {
        goToNextVote();
      }
      touchStartY.current = null;
    },
    [goToNextVote],
  );

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (event.deltaY < WHEEL_NAVIGATION_THRESHOLD) return;
      event.preventDefault();
      goToNextVote();
    },
    [goToNextVote],
  );

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

  const hasVotes = feedLength > 0;

  const safeHandleWheel = useCallback(
    (event: WheelEvent) => {
      if (!hasVotes) return;
      handleWheel(event);
    },
    [handleWheel, hasVotes],
  );

  return {
    votes,
    displayedVotes,
    currentVote,
    currentIndex,
    updateVote,
    goToNextVote,
    handleTouchStart,
    handleTouchEnd,
    handleWheel: safeHandleWheel,
    handleTrackTransitionEnd,
    trackClassName,
    trackStyle,
    isLoading: !initialData,
  };
}
