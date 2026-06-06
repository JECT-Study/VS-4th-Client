import { describe, expect, it } from "vitest";
import { isMobilePushDevice } from "./isMobilePushDevice";

describe("isMobilePushDevice", () => {
  it("allows android and ios only", () => {
    expect(isMobilePushDevice("android")).toBe(true);
    expect(isMobilePushDevice("ios")).toBe(true);
  });

  it("blocks desktop and unsupported ios versions", () => {
    expect(isMobilePushDevice("other")).toBe(false);
    expect(isMobilePushDevice("ios-outdated")).toBe(false);
  });
});