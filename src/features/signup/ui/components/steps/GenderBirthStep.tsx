import { Input } from "@base/ui/Input";
import type React from "react";
import type { Gender, GenderBirthState } from "../../../model/types";

const ALLOWED_KEYS = new Set([
  "Backspace",
  "Delete",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Tab",
  "Enter",
]);

function preventNonNumericKey(e: React.KeyboardEvent<HTMLInputElement>) {
  if (e.nativeEvent.isComposing) return;
  const isDigit = e.key >= "0" && e.key <= "9";
  const isSystemKey = e.ctrlKey || e.metaKey;
  if (!isDigit && !isSystemKey && !ALLOWED_KEYS.has(e.key)) {
    e.preventDefault();
  }
}

interface GenderBirthStepProps {
  genderBirthState: GenderBirthState;
  setGender: (gender: Gender) => void;
  setBirthYear: (value: string) => void;
}

export function GenderBirthStep({ genderBirthState, setGender, setBirthYear }: GenderBirthStepProps) {
  const { gender, birthYear, birthYearError } = genderBirthState;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-title-m">환영해요! 이제 딱 두 가지만 알려주세요</h2>
        <p className="text-body-s mt-[6px]">더 재밌고 정확한 투표 분석을 위해 사용돼요</p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-label-s text-grey-dark">성별</p>
          <div className="flex gap-3">
            <GenderButton value="MALE" label="남성" selected={gender === "MALE"} onClick={setGender} />
            <GenderButton value="FEMALE" label="여성" selected={gender === "FEMALE"} onClick={setGender} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="birth-year" className="text-label-s text-grey-dark">
            출생 연도
          </label>
          <Input
            id="birth-year"
            value={birthYear}
            onChange={setBirthYear}
            onKeyDown={preventNonNumericKey}
            inputMode="numeric"
            maxLength={4}
            error={birthYearError}
          />
        </div>
      </div>
    </div>
  );
}

interface GenderButtonProps {
  value: Gender;
  label: string;
  selected: boolean;
  onClick: (value: Gender) => void;
}

function GenderButton({ value, label, selected, onClick }: GenderButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`px-4 py-2 rounded-lg border-[1.5px] text-label-l transition-colors ${
        selected ? "border-primary bg-primary text-white" : "border-grey-stroke text-grey-purple"
      }`}
    >
      {label}
    </button>
  );
}
