import { apiClient } from "@base/api/client";

interface WithdrawParams {
  category: string;
  reason: string;
}

export async function withdraw({ category, reason }: WithdrawParams): Promise<void> {
  // 서버 스펙상 body 필드명이 `reasone`(오타)이므로 그대로 맞춰 전송합니다.
  await apiClient.delete("/api/users/profile/delete", {
    data: { category, reasone: reason },
  });
}
