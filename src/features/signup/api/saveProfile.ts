import { apiClient } from "@base/api/client";

export interface SaveProfilePayload {
  birthDate: string;
  gender: "MALE" | "FEMALE";
  nickname: string;
  imageColor: string;
}

export interface SaveProfileResponse {
  nickname: string;
  imageColor: string;
}

/* MOCK_START */
async function mockSaveProfile(payload: SaveProfilePayload): Promise<SaveProfileResponse> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { nickname: payload.nickname, imageColor: payload.imageColor };
}
/* MOCK_END */

export async function saveProfile(payload: SaveProfilePayload): Promise<SaveProfileResponse> {
  /* MOCK_START */
  return mockSaveProfile(payload);
  /* MOCK_END */
  // return apiClient.post<SaveProfileResponse>("/api/users/me/profile", payload).then((r) => r.data);
}
