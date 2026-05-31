import { defaultApi } from "@base/api/defaultApi";

interface WithdrawParams {
  category: string;
  reason: string;
}

export async function withdraw({ category, reason }: WithdrawParams): Promise<void> {
  // UserDeleteReq의 body 필드명이 `reasone`(서버 스펙상 오타)이므로 그대로 맞춰 전달합니다.
  await defaultApi.deleteAccount({ category, reasone: reason });
}
