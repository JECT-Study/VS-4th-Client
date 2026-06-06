import { defaultApi } from "@base/api/defaultApi";
import axios from "axios";

export async function checkNickname(nickname: string): Promise<void> {
  const { data } = await defaultApi.isUniqueNickname({ nickname });
  if (!data.isAvailable) throw new Error("이미 사용 중인 닉네임이에요");
}

export function extractNicknameCheckError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? "닉네임 확인 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.";
  }
  if (error instanceof Error) return error.message;
  return "닉네임 확인 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.";
}
