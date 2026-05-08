export type SignupStep = 1 | 2 | 3 | 4;

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
  imageColor: string;
  nickname: string;
  defaultNickname: string;
  defaultImageColor: string;
  nicknameError: string | null;
  isCheckingNickname: boolean;
}
