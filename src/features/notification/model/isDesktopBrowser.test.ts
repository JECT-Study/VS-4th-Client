import { describe, expect, it, vi } from "vitest";
import { isDesktopBrowser } from "./isDesktopBrowser";

const mockMatchMedia = (hover: boolean, finePointer: boolean) => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches:
        (query === "(hover: hover)" && hover) || (query === "(pointer: fine)" && finePointer),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
};

describe("isDesktopBrowser", () => {
  it("detects desktop user agents", () => {
    mockMatchMedia(false, false);
    vi.stubGlobal("navigator", {
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    });

    expect(isDesktopBrowser()).toBe(true);
  });

  it("detects desktop even when UA looks mobile but input is mouse", () => {
    mockMatchMedia(true, true);
    vi.stubGlobal("navigator", {
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    });

    expect(isDesktopBrowser()).toBe(true);
  });

  it("detects mobile user agents", () => {
    mockMatchMedia(false, false);
    vi.stubGlobal("navigator", {
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    });

    expect(isDesktopBrowser()).toBe(false);
  });
});