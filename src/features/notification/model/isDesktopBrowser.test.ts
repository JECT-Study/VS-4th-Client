import { describe, expect, it, vi } from "vitest";
import { detectOsTypeFromUserAgent, isDesktopBrowser } from "./isDesktopBrowser";

describe("isDesktopBrowser", () => {
  it("detects desktop user agents", () => {
    vi.stubGlobal("navigator", {
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    });
    vi.stubGlobal("window", { Notification: {} });

    expect(detectOsTypeFromUserAgent()).toBe("other");
    expect(isDesktopBrowser()).toBe(true);
  });

  it("detects mobile user agents", () => {
    vi.stubGlobal("navigator", {
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    });
    vi.stubGlobal("window", { Notification: {} });

    expect(detectOsTypeFromUserAgent()).toBe("ios");
    expect(isDesktopBrowser()).toBe(false);
  });
});