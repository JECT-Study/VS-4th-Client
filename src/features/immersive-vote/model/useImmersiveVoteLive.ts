import * as stompClient from "@base/api/stompClient";
import { showToast } from "@base/ui/Toast";
import { useEffect, useRef } from "react";
import { LIVE_TOAST_INTERVAL_MS, LIVE_TOAST_MIN_VIEWERS } from "../config/constants";
import type { ImmersiveFeedItem, ImmersiveLivePayload } from "./types";

export function useImmersiveVoteLive(
  vote: ImmersiveFeedItem,
  updateVote: (voteId: number, updater: (vote: ImmersiveFeedItem) => ImmersiveFeedItem) => void,
) {
  const lastToastTime = useRef(0);
  const { voteId, myVote } = vote;

  useEffect(() => {
    if (!myVote.voted) return;

    let subscription: ReturnType<typeof stompClient.subscribe> | undefined;
    try {
      subscription = stompClient.subscribe(`/topic/immersive-vote/${voteId}/live`, (message) => {
        const payload: ImmersiveLivePayload = JSON.parse(message.body);

        updateVote(voteId, (current) => ({
          ...current,
          options: current.options.map((o) => {
            const live = payload.options.find((p) => p.optionId === o.optionId);
            return live ? { ...o, voteCount: live.voteCount, ratio: live.ratio } : o;
          }),
          currentViewerCount: payload.currentViewerCount,
        }));

        if (payload.currentViewerCount >= LIVE_TOAST_MIN_VIEWERS) {
          const now = Date.now();
          if (now - lastToastTime.current >= LIVE_TOAST_INTERVAL_MS) {
            showToast.info(`현재 ${payload.currentViewerCount}명이 참여중이에요!`, 5000);
            lastToastTime.current = now;
          }
        }
      });
    } catch {
      // STOMP not yet connected; live updates unavailable for this vote
    }

    return () => subscription?.unsubscribe();
  }, [voteId, myVote.voted, updateVote]);
}
