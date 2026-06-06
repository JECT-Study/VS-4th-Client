import { RegisterPushTokenRequestPlatformEnum } from "@ject-4-vs-team/api-client";
import { describe, expect, it } from "vitest";
import { resolvePushPlatform } from "./resolvePushPlatform";

describe("resolvePushPlatform", () => {
  it("iOS는 IOS 플랫폼으로 매핑한다", () => {
    expect(resolvePushPlatform("ios")).toBe(RegisterPushTokenRequestPlatformEnum.Ios);
  });

  it("iOS 이외는 ANDROID 플랫폼으로 매핑한다", () => {
    expect(resolvePushPlatform("android")).toBe(RegisterPushTokenRequestPlatformEnum.Android);
    expect(resolvePushPlatform("other")).toBe(RegisterPushTokenRequestPlatformEnum.Android);
    expect(resolvePushPlatform("ios-outdated")).toBe(RegisterPushTokenRequestPlatformEnum.Android);
  });
});
