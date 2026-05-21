import { apiClient } from "@base/api/client";
import axios from "axios";

export interface UpdateProfilePayload {
  nickname: string;
  imageColor: string;
}

export interface UpdateProfileResponse {
  email: string;
  nickname: string;
  imageColor: string;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<UpdateProfileResponse> {
  return apiClient.patch<UpdateProfileResponse>("/api/users/change/info", payload).then((r) => r.data);
}

export function extractUpdateProfileError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? "프로필 저장 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.";
  }
  if (error instanceof Error) return error.message;
  return "프로필 저장 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.";
}
