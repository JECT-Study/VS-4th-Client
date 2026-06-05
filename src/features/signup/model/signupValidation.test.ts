import { describe, expect, it } from "vitest";
import {
  canProceedStep1,
  canProceedStep2,
  canProceedStep3,
  validateBirthYear,
  validateNickname,
} from "./signupValidation";
import type { GenderBirthState, ImageColor, ProfileState, TermsState } from "./types";

describe("validateBirthYear", () => {
  it("4자리 미만 입력이면 null을 반환한다", () => {
    expect(validateBirthYear("")).toBe(null);
    expect(validateBirthYear("1")).toBe(null);
    expect(validateBirthYear("19")).toBe(null);
    expect(validateBirthYear("199")).toBe(null);
  });

  it("1900 이하 연도이면 오류 메시지를 반환한다", () => {
    expect(validateBirthYear("1900")).toBe("올바른 출생 연도를 입력해 주세요.");
    expect(validateBirthYear("1800")).toBe("올바른 출생 연도를 입력해 주세요.");
    expect(validateBirthYear("0001")).toBe("올바른 출생 연도를 입력해 주세요.");
  });

  it("현재 연도보다 미래 연도이면 오류 메시지를 반환한다", () => {
    const futureYear = String(new Date().getFullYear() + 1);
    expect(validateBirthYear(futureYear)).toBe("올바른 출생 연도를 입력해 주세요.");
  });

  it("만 19세 미만이면 가입 불가 메시지를 반환한다", () => {
    const currentYear = new Date().getFullYear();
    const tooYoungYear = String(currentYear - 18);
    expect(validateBirthYear(tooYoungYear)).toBe("만 19세 미만은 가입할 수 없어요.");
  });

  it("만 19세 기준 경계값(현재 연도 - 19)은 null을 반환한다", () => {
    const currentYear = new Date().getFullYear();
    const minAllowedYear = String(currentYear - 19);
    expect(validateBirthYear(minAllowedYear)).toBe(null);
  });

  it("유효한 연도이면 null을 반환한다", () => {
    expect(validateBirthYear("1990")).toBe(null);
    expect(validateBirthYear("2000")).toBe(null);
    expect(validateBirthYear("1901")).toBe(null);
  });
});

describe("validateNickname", () => {
  it("빈 문자열이면 null을 반환한다", () => {
    expect(validateNickname("")).toBe(null);
  });

  it("1자이면 2자 이상 입력 오류 메시지를 반환한다", () => {
    expect(validateNickname("a")).toBe("2자 이상 입력해주세요");
    expect(validateNickname("가")).toBe("2자 이상 입력해주세요");
  });

  it("언더바가 2개 이상이면 오류 메시지를 반환한다", () => {
    expect(validateNickname("ab__cd")).toBe("언더바(_)는 중간에 1개만 사용할 수 있어요");
    expect(validateNickname("a_b_c")).toBe("언더바(_)는 중간에 1개만 사용할 수 있어요");
  });

  it("언더바가 첫 글자에 있으면 오류 메시지를 반환한다", () => {
    expect(validateNickname("_abc")).toBe("언더바(_)는 중간에 1개만 사용할 수 있어요");
  });

  it("언더바가 마지막 글자에 있으면 오류 메시지를 반환한다", () => {
    expect(validateNickname("abc_")).toBe("언더바(_)는 중간에 1개만 사용할 수 있어요");
  });

  it("허용되지 않는 특수문자가 포함되면 오류 메시지를 반환한다", () => {
    expect(validateNickname("ab!cd")).toBe("사용할 수 없는 단어가 포함되어 있어요");
    expect(validateNickname("ab@cd")).toBe("사용할 수 없는 단어가 포함되어 있어요");
    expect(validateNickname("ab cd")).toBe("사용할 수 없는 단어가 포함되어 있어요");
    expect(validateNickname("ab.cd")).toBe("사용할 수 없는 단어가 포함되어 있어요");
  });

  it("한글, 영문, 숫자로만 이루어진 닉네임은 null을 반환한다", () => {
    expect(validateNickname("홍길동")).toBe(null);
    expect(validateNickname("abc")).toBe(null);
    expect(validateNickname("abc123")).toBe(null);
    expect(validateNickname("홍길동123")).toBe(null);
  });

  it("중간에 언더바가 1개인 유효한 닉네임은 null을 반환한다", () => {
    expect(validateNickname("hong_gil")).toBe(null);
    expect(validateNickname("홍_길동")).toBe(null);
    expect(validateNickname("ab_12")).toBe(null);
  });
});

describe("canProceedStep1", () => {
  it("age, privacy, tos가 모두 true이면 true를 반환한다", () => {
    const terms: TermsState = { age: true, privacy: true, tos: true, push: false };
    expect(canProceedStep1(terms)).toBe(true);
  });

  it("age, privacy, tos가 모두 true이고 push도 true이면 true를 반환한다", () => {
    const terms: TermsState = { age: true, privacy: true, tos: true, push: true };
    expect(canProceedStep1(terms)).toBe(true);
  });

  it("age가 false이면 false를 반환한다", () => {
    const terms: TermsState = { age: false, privacy: true, tos: true, push: true };
    expect(canProceedStep1(terms)).toBe(false);
  });

  it("privacy가 false이면 false를 반환한다", () => {
    const terms: TermsState = { age: true, privacy: false, tos: true, push: true };
    expect(canProceedStep1(terms)).toBe(false);
  });

  it("tos가 false이면 false를 반환한다", () => {
    const terms: TermsState = { age: true, privacy: true, tos: false, push: true };
    expect(canProceedStep1(terms)).toBe(false);
  });

  it("3개 필수 항목이 모두 false이면 false를 반환한다", () => {
    const terms: TermsState = { age: false, privacy: false, tos: false, push: false };
    expect(canProceedStep1(terms)).toBe(false);
  });
});

describe("canProceedStep2", () => {
  it("gender가 있고 birthYearError가 null이고 birthYear가 4자리이면 true를 반환한다", () => {
    const state: GenderBirthState = { gender: "MALE", birthYear: "1990", birthYearError: null };
    expect(canProceedStep2(state)).toBe(true);
  });

  it("gender가 FEMALE이어도 유효하면 true를 반환한다", () => {
    const state: GenderBirthState = { gender: "FEMALE", birthYear: "1995", birthYearError: null };
    expect(canProceedStep2(state)).toBe(true);
  });

  it("gender가 null이면 false를 반환한다", () => {
    const state: GenderBirthState = { gender: null, birthYear: "1990", birthYearError: null };
    expect(canProceedStep2(state)).toBe(false);
  });

  it("birthYearError가 있으면 false를 반환한다", () => {
    const state: GenderBirthState = {
      gender: "MALE",
      birthYear: "2010",
      birthYearError: "만 19세 미만은 가입할 수 없어요.",
    };
    expect(canProceedStep2(state)).toBe(false);
  });

  it("birthYear가 4자리 미만이면 false를 반환한다", () => {
    const state: GenderBirthState = { gender: "MALE", birthYear: "199", birthYearError: null };
    expect(canProceedStep2(state)).toBe(false);
  });

  it("birthYear가 비어 있으면 false를 반환한다", () => {
    const state: GenderBirthState = { gender: "MALE", birthYear: "", birthYearError: null };
    expect(canProceedStep2(state)).toBe(false);
  });
});

describe("canProceedStep3", () => {
  const defaultNickname = "기본닉네임";
  const defaultImageColor: ImageColor = "GREEN";

  const validState: ProfileState = {
    nickname: "변경된닉네임",
    imageColor: "GREEN",
    nicknameError: null,
    isCheckingNickname: false,
  };

  it("닉네임을 변경하고 유효하면 true를 반환한다", () => {
    expect(canProceedStep3(validState)).toBe(true);
  });

  it("imageColor만 변경해도 닉네임이 유효하면 true를 반환한다", () => {
    const state: ProfileState = {
      nickname: defaultNickname,
      imageColor: "RED",
      nicknameError: null,
      isCheckingNickname: false,
    };
    expect(canProceedStep3(state)).toBe(true);
  });

  it("닉네임과 imageColor 모두 변경하면 true를 반환한다", () => {
    const state: ProfileState = {
      nickname: "새닉네임",
      imageColor: "BLUE",
      nicknameError: null,
      isCheckingNickname: false,
    };
    expect(canProceedStep3(state)).toBe(true);
  });

  it("닉네임이 기본값과 동일해도 유효하면 true를 반환한다", () => {
    const state: ProfileState = {
      nickname: defaultNickname,
      imageColor: defaultImageColor,
      nicknameError: null,
      isCheckingNickname: false,
    };
    expect(canProceedStep3(state)).toBe(true);
  });

  it("nicknameError가 있으면 false를 반환한다", () => {
    const state: ProfileState = {
      nickname: "변경된닉네임",
      imageColor: "GREEN",
      nicknameError: "이미 사용 중인 닉네임이에요",
      isCheckingNickname: false,
    };
    expect(canProceedStep3(state)).toBe(false);
  });

  it("닉네임 확인 중(isCheckingNickname)이면 false를 반환한다", () => {
    const state: ProfileState = {
      nickname: "변경된닉네임",
      imageColor: "GREEN",
      nicknameError: null,
      isCheckingNickname: true,
    };
    expect(canProceedStep3(state)).toBe(false);
  });

  it("닉네임이 한글자면 false를 반환한다", () => {
    const state: ProfileState = {
      nickname: "가",
      imageColor: "GREEN",
      nicknameError: null,
      isCheckingNickname: false,
    };
    expect(canProceedStep3(state)).toBe(false);
  });

  it("닉네임이 빈 문자열이면 false를 반환한다", () => {
    const state: ProfileState = {
      nickname: "",
      imageColor: "RED",
      nicknameError: null,
      isCheckingNickname: false,
    };
    expect(canProceedStep3(state)).toBe(false);
  });
});
