import { useState } from "react";
import { validateBirthYear } from "./signupValidation";
import type { Gender, GenderBirthState } from "./types";

const INITIAL_GENDER_BIRTH: GenderBirthState = {
  gender: null,
  birthYear: "",
  birthYearError: null,
};

export function useGenderBirthStep() {
  const [genderBirthState, setGenderBirthState] = useState<GenderBirthState>(INITIAL_GENDER_BIRTH);

  const setGender = (gender: Gender) => {
    setGenderBirthState((prev) => ({ ...prev, gender }));
  };

  const setBirthYear = (value: string) => {
    const numericOnly = value.replace(/[^0-9]/g, "").slice(0, 4);
    setGenderBirthState((prev) => ({
      ...prev,
      birthYear: numericOnly,
      birthYearError: validateBirthYear(numericOnly),
    }));
  };

  return { genderBirthState, setGender, setBirthYear };
}
