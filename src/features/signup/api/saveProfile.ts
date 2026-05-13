import type { ImageColor } from "../model/types";

export interface SaveProfilePayload {
  birthDate: string;
  gender: "MALE" | "FEMALE";
  nickname: string;
  imageColor: ImageColor;
}

export interface SaveProfileResponse {
  nickname: string;
  imageColor: ImageColor;
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
