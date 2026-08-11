import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ImmersiveFeedItem, VoteOption } from "../model/types";
import { ImmersiveVoteOptions, getMajorityOptionId } from "./ImmersiveVoteOptions";

const makeOptions = (firstRatio: number, secondRatio: number): VoteOption[] => [
  { optionId: 1, label: "첫 번째", voteCount: 0, ratio: firstRatio },
  { optionId: 2, label: "두 번째", voteCount: 0, ratio: secondRatio },
];

const makeVote = (options: VoteOption[], selectedOptionId: number): ImmersiveFeedItem =>
  ({
    voteId: 1,
    options,
    myVote: { voted: true, selectedOptionId },
  }) as ImmersiveFeedItem;

describe("ImmersiveVoteOptions", () => {
  beforeEach(() => {
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 0;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("동률이면 첫 번째 선택지를 다수 선택지로 판정한다", () => {
    expect(getMajorityOptionId(makeOptions(50, 50))).toBe(1);
  });

  it("선택지 영역을 전체 너비로 늘리고 선택한 다수 선택지에 보라색 테두리를 표시한다", () => {
    const { container } = render(
      <ImmersiveVoteOptions vote={makeVote(makeOptions(60, 40), 1)} onOptionClick={vi.fn()} />,
    );

    expect((container.firstElementChild as HTMLElement).className.split(" ")).toContain("w-full");
    const majorityButton = screen.getByRole("button", { name: /첫 번째/ }) as HTMLElement;
    const minorityButton = screen.getByRole("button", { name: /두 번째/ }) as HTMLElement;

    expect(majorityButton.className.split(" ")).toContain("border-[#9A9AF6]");
    expect(majorityButton.querySelector("[aria-hidden]")?.className.split(" ")).toContain("bg-[rgba(119,80,187,0.4)]");
    expect(minorityButton.className.split(" ")).toContain("border-transparent");
    expect(minorityButton.querySelector("[aria-hidden]")?.className.split(" ")).toContain("bg-[#8F6D4B]");
  });

  it("선택한 소수 선택지에만 주황색 테두리를 표시한다", () => {
    render(<ImmersiveVoteOptions vote={makeVote(makeOptions(70, 30), 2)} onOptionClick={vi.fn()} />);

    expect((screen.getByRole("button", { name: /첫 번째/ }) as HTMLElement).className.split(" ")).toContain(
      "border-transparent",
    );
    expect((screen.getByRole("button", { name: /두 번째/ }) as HTMLElement).className.split(" ")).toContain(
      "border-[#F69B30]",
    );
  });
});
