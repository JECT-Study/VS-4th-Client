import type { GenderBirthState, ProfileState, TermsState } from "./types";

const MIN_AGE = 19;
const MIN_BIRTH_YEAR = 1900;

export function validateBirthYear(value: string): string | null {
  if (value.length < 4) return null;
  const year = Number(value);
  const currentYear = new Date().getFullYear();
  if (year <= MIN_BIRTH_YEAR || year > currentYear) return "올바른 출생 연도를 입력해 주세요.";
  if (year > currentYear - MIN_AGE) return "만 19세 미만은 가입할 수 없어요.";
  return null;
}

export function validateNickname(value: string): string | null {
  if (value.length === 0) return null;
  if (value.length < 2) return "2자 이상 입력해주세요";

  const hasInvalidUnderscore = (value.match(/_/g) ?? []).length > 1 || value.startsWith("_") || value.endsWith("_");
  if (hasInvalidUnderscore) return "언더바(_)는 중간에 1개만 사용할 수 있어요";

  if (!/^[a-zA-Z0-9가-힣_]+$/.test(value)) return "사용할 수 없는 단어가 포함되어 있어요";

  return null;
}

export function canProceedStep1(terms: TermsState): boolean {
  return terms.age && terms.privacy && terms.tos;
}

export function canProceedStep2(state: GenderBirthState): boolean {
  return state.gender !== null && state.birthYearError === null && state.birthYear.length === 4;
}

export function canProceedStep3(state: ProfileState): boolean {
  return (
    (state.nickname !== state.defaultNickname || state.imageColor !== state.defaultImageColor) &&
    state.nicknameError === null &&
    state.nickname.length >= 2 &&
    !state.isCheckingNickname
  );
}
