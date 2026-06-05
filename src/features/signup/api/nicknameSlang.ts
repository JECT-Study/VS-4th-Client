import { apiClient } from "@base/api/client";
import axios from "axios";

export async function checkNicknameSlang(nickname: string): Promise<void> {
  try {
    const { data } = await apiClient.post<{ isAvailable: boolean }>("/api/users/nickname/slang", { nickname });
    if (!data.isAvailable) throw new Error("사용할 수 없는 단어가 포함되어 있어요");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error("사용할 수 없는 단어가 포함되어 있어요");
    }
    throw error;
  }
}
