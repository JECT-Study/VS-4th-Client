import { defaultApi } from "@base/api/defaultApi";
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

export async function saveProfile(payload: SaveProfilePayload): Promise<SaveProfileResponse> {
  const r = await defaultApi.setupInfo({
    birthDate: payload.birthDate,
    gender: payload.gender,
    nickName: payload.nickname,
    imageColor: payload.imageColor,
  });
  return r.data as SaveProfileResponse;
}
