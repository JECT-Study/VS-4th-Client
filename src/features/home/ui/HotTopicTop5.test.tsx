import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { HotTopicItem } from "../model/home.ts";
import { HotTopicTop5 } from "./HotTopicTop5.tsx";

const createHotTopic = (rank: number): HotTopicItem => ({
  rank,
  voteId: rank,
  thumbnailUrl: `https://example.com/${rank}.jpg`,
  title: `${rank}위 투표`,
  content: `${rank}위 내용`,
  participantCount: rank * 10,
  endAt: "2099-12-31T23:59:59Z",
});

afterEach(cleanup);

describe("HotTopicTop5", () => {
  it("순위 기준 상위 5개만 노출한다", () => {
    render(<HotTopicTop5 hotTopics={[6, 4, 2, 5, 1, 3].map(createHotTopic)} />);

    expect(screen.getByRole("heading", { name: "핫토픽 TOP 5" })).toBeTruthy();
    expect(screen.getByText("1위 투표")).toBeTruthy();
    expect(screen.getByText("5위 투표")).toBeTruthy();
    expect(screen.queryByText("6위 투표")).toBeNull();
  });

  it("투표 카드를 누르면 해당 투표 id와 순위를 전달한다", () => {
    const onClickVote = vi.fn();
    render(<HotTopicTop5 hotTopics={[createHotTopic(1), createHotTopic(4)]} onClickVote={onClickVote} />);

    fireEvent.click(screen.getByRole("button", { name: /1위 투표/ }));
    expect(onClickVote).toHaveBeenCalledWith(1, 1);

    fireEvent.click(screen.getByRole("button", { name: /4위 투표/ }));
    expect(onClickVote).toHaveBeenCalledWith(4, 4);
  });

  it("핫토픽이 없으면 빈 상태를 노출한다", () => {
    render(<HotTopicTop5 hotTopics={[]} />);

    expect(screen.getByText("표시할 투표가 없습니다.")).toBeTruthy();
  });
});
