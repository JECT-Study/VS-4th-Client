import { describe, expect, it } from "vitest";
import { formatChatReactionCount, toggleChatMessageReaction } from "./chatMessageReaction";

describe("chatMessageReaction", () => {
  it("같은 리액션을 다시 누르면 선택을 취소하고 카운트를 줄인다", () => {
    const next = toggleChatMessageReaction({ THUMBS_UP: 2, THUMBS_DOWN: 1, myReaction: "THUMBS_UP" }, "THUMBS_UP");

    expect(next).toEqual({ THUMBS_UP: 1, THUMBS_DOWN: 1, myReaction: null });
  });

  it("다른 리액션을 누르면 기존 선택 카운트를 줄이고 새 선택 카운트를 늘린다", () => {
    const next = toggleChatMessageReaction({ THUMBS_UP: 2, THUMBS_DOWN: 1, myReaction: "THUMBS_UP" }, "THUMBS_DOWN");

    expect(next).toEqual({ THUMBS_UP: 1, THUMBS_DOWN: 2, myReaction: "THUMBS_DOWN" });
  });

  it("리액션 카운트가 99개를 초과하면 99+로 표시한다", () => {
    expect(formatChatReactionCount(99)).toBe("99");
    expect(formatChatReactionCount(100)).toBe("99+");
  });
});
