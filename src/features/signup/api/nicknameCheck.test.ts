import type { InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import { describe, expect, it } from "vitest";
import { extractNicknameCheckError } from "./nicknameCheck";

const FALLBACK_MESSAGE = "닉네임 확인 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.";

describe("extractNicknameCheckError", () => {
  it("AxiosError이고 response.data.message가 있으면 해당 메시지를 반환한다", () => {
    const error = new axios.AxiosError("요청 실패");
    error.response = {
      data: { message: "이미 사용 중인 닉네임이에요" },
      status: 409,
      statusText: "Conflict",
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    };
    expect(extractNicknameCheckError(error)).toBe("이미 사용 중인 닉네임이에요");
  });

  it("AxiosError이지만 response가 없으면 fallback 메시지를 반환한다", () => {
    const error = new axios.AxiosError("네트워크 오류");
    expect(extractNicknameCheckError(error)).toBe(FALLBACK_MESSAGE);
  });

  it("AxiosError이고 response는 있지만 data.message가 없으면 fallback 메시지를 반환한다", () => {
    const error = new axios.AxiosError("서버 오류");
    error.response = {
      data: {},
      status: 500,
      statusText: "Internal Server Error",
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    };
    expect(extractNicknameCheckError(error)).toBe(FALLBACK_MESSAGE);
  });

  it("일반 Error이면 error.message를 반환한다", () => {
    const error = new Error("일반 오류 메시지");
    expect(extractNicknameCheckError(error)).toBe("일반 오류 메시지");
  });

  it("문자열 에러이면 fallback 메시지를 반환한다", () => {
    expect(extractNicknameCheckError("문자열 오류")).toBe(FALLBACK_MESSAGE);
  });

  it("null이면 fallback 메시지를 반환한다", () => {
    expect(extractNicknameCheckError(null)).toBe(FALLBACK_MESSAGE);
  });

  it("undefined이면 fallback 메시지를 반환한다", () => {
    expect(extractNicknameCheckError(undefined)).toBe(FALLBACK_MESSAGE);
  });

  it("숫자 에러이면 fallback 메시지를 반환한다", () => {
    expect(extractNicknameCheckError(42)).toBe(FALLBACK_MESSAGE);
  });
});
