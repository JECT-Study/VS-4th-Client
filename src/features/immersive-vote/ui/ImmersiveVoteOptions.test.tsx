import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ImmersiveFeedItem, VoteOption } from "../model/types";
import { ImmersiveVoteOptions } from "./ImmersiveVoteOptions";

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

  it("선택지 영역을 전체 너비로 늘리고 왼쪽 선택지를 선택하면 주황색 테두리를 표시한다", () => {
    const { container } = render(
      <ImmersiveVoteOptions vote={makeVote(makeOptions(60, 40), 1)} onOptionClick={vi.fn()} />,
    );

    expect((container.firstElementChild as HTMLElement).className.split(" ")).toContain("w-full");
    const leftButton = screen.getByRole("button", { name: /첫 번째/ }) as HTMLElement;
    const rightButton = screen.getByRole("button", { name: /두 번째/ }) as HTMLElement;

    expect(leftButton.className.split(" ")).toContain("border-[#F69B30]");
    expect(rightButton.className.split(" ")).toContain("border-transparent");
  });

  it("다수 선택지와 무관하게 왼쪽은 주황색, 오른쪽은 보라색 채움을 유지한다", () => {
    render(<ImmersiveVoteOptions vote={makeVote(makeOptions(30, 70), 2)} onOptionClick={vi.fn()} />);

    const leftButton = screen.getByRole("button", { name: /첫 번째/ }) as HTMLElement;
    const rightButton = screen.getByRole("button", { name: /두 번째/ }) as HTMLElement;

    expect(leftButton.querySelector("[aria-hidden]")?.className.split(" ")).toContain("bg-[#8F6D4B]");
    expect(rightButton.querySelector("[aria-hidden]")?.className.split(" ")).toContain("bg-[rgba(119,80,187,0.4)]");
    expect(leftButton.className.split(" ")).toContain("border-transparent");
    expect(rightButton.className.split(" ")).toContain("border-[#9A9AF6]");
  });

  it("선택한 선택지에만 테두리 색과 같은 색의 체크 아이콘을 표시한다", () => {
    render(<ImmersiveVoteOptions vote={makeVote(makeOptions(60, 40), 2)} onOptionClick={vi.fn()} />);

    const rightButton = screen.getByRole("button", { name: /두 번째/ }) as HTMLElement;
    const checkIcon = rightButton.querySelector("svg") as SVGElement | null;

    expect(checkIcon).not.toBeNull();
    expect(checkIcon?.getAttribute("class")?.split(" ")).toContain("text-[#9A9AF6]");
    expect(screen.getByRole("button", { name: /첫 번째/ }).querySelector("svg")).toBeNull();
  });
});
