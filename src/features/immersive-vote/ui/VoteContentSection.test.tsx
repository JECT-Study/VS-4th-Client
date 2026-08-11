import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { VoteContentSection } from "./VoteContentSection";

function ControlledContent({ content }: { content: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  return <VoteContentSection content={content} isExpanded={isExpanded} onExpandedChange={setIsExpanded} />;
}

describe("VoteContentSection", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect() {}
      },
    );
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("두 줄을 넘는 본문을 영역 터치로 펼치고 다시 접는다", () => {
    vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(72);
    vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(48);
    render(<ControlledContent content="세 줄 이상인 긴 본문" />);

    const contentArea = screen.getByRole("button");
    const paragraph = screen.getByText("세 줄 이상인 긴 본문");

    expect(contentArea.getAttribute("aria-expanded")).toBe("false");
    expect(paragraph.className.split(" ")).toContain("max-h-12");

    fireEvent.click(contentArea);

    expect(contentArea.getAttribute("aria-expanded")).toBe("true");
    expect(paragraph.className.split(" ")).toContain("max-h-[168px]");

    fireEvent.click(contentArea);

    expect(contentArea.getAttribute("aria-expanded")).toBe("false");
    expect(paragraph.className.split(" ")).toContain("min-h-7");
  });

  it("두 줄을 넘지 않는 본문은 펼침 인터랙션을 제공하지 않는다", () => {
    vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(24);
    vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(28);
    render(<ControlledContent content="짧은 본문" />);

    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByText("짧은 본문").className.split(" ")).toContain("min-h-7");
  });
});
