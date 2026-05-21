export type SignupStep = 1 | 2 | 3 | 4;

export type ImageColor = "GREEN" | "RED" | "BLUE" | "YELLOW";

export interface TermsState {
  age: boolean;
  privacy: boolean;
  tos: boolean;
  push: boolean;
}

export type Gender = "MALE" | "FEMALE";

export interface GenderBirthState {
  gender: Gender | null;
  birthYear: string;
  birthYearError: string | null;
}

export interface ProfileState {
  imageColor: ImageColor;
  nickname: string;
  nicknameError: string | null;
  isCheckingNickname: boolean;
}
