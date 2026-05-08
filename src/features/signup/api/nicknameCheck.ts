import { apiClient } from "@base/api/client";
import axios from "axios";

/* MOCK_START */
const MOCK_FORBIDDEN = ["욕설닉", "금칙어"];
/* MOCK_END */

export async function checkNickname(nickname: string): Promise<void> {
  /* MOCK_START */
  if (MOCK_FORBIDDEN.includes(nickname)) {
    const error = new Error("이미 사용 중인 닉네임이에요") as Error & {
      response: { data: { message: string } };
    };
    error.response = { data: { message: "이미 사용 중인 닉네임이에요" } };
    throw error;
  }
  return;
  /* MOCK_END */
  // await apiClient.post("/api/users/nickname/check", { nickname });
}

export function extractNicknameCheckError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? "사용할 수 없는 닉네임이에요";
  }
  if (error instanceof Error) return error.message;
  return "사용할 수 없는 닉네임이에요";
}
