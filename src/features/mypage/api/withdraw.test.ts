import { apiClient } from "@base/api/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { withdraw } from "./withdraw";

vi.mock("@base/api/client", () => ({
  apiClient: { delete: vi.fn().mockResolvedValue({ status: 200 }) },
}));

describe("withdraw", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("DELETE /api/users/profile/delete 로 category와 reasone(오타 필드)을 전송한다", async () => {
    await withdraw({ category: "앱 오류가 잦아요", reason: "자세한 의견입니다" });

    expect(apiClient.delete).toHaveBeenCalledWith("/api/users/profile/delete", {
      data: { category: "앱 오류가 잦아요", reasone: "자세한 의견입니다" },
    });
  });

  it("reason이 비어 있어도 그대로 전송한다", async () => {
    await withdraw({ category: "앱 오류가 잦아요", reason: "" });

    expect(apiClient.delete).toHaveBeenCalledWith("/api/users/profile/delete", {
      data: { category: "앱 오류가 잦아요", reasone: "" },
    });
  });
});
