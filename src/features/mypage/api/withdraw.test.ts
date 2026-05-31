import { defaultApi } from "@base/api/defaultApi";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { withdraw } from "./withdraw";

vi.mock("@base/api/defaultApi", () => ({
  defaultApi: { deleteAccount: vi.fn().mockResolvedValue({ status: 200 }) },
}));

describe("withdraw", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deleteAccount 를 category와 reasone(오타 필드)으로 호출한다", async () => {
    await withdraw({ category: "앱 오류가 잦아요", reason: "자세한 의견입니다" });

    expect(defaultApi.deleteAccount).toHaveBeenCalledWith({
      category: "앱 오류가 잦아요",
      reasone: "자세한 의견입니다",
    });
  });

  it("reason이 비어 있어도 그대로 전송한다", async () => {
    await withdraw({ category: "앱 오류가 잦아요", reason: "" });

    expect(defaultApi.deleteAccount).toHaveBeenCalledWith({
      category: "앱 오류가 잦아요",
      reasone: "",
    });
  });
});
