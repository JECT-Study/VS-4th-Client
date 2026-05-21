import { Input } from "@base/ui/Input";
import { useId } from "react";

interface NicknameInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error: string | null;
}

const MAX_LENGTH = 10;
const HELP_TEXT = "한글/영문(대소문자)/숫자/특수기호(_)로 설정할 수 있어요";

export function NicknameInput({ value, onChange, onBlur, error }: NicknameInputProps) {
  const id = useId();

  const charCount = (
    <span className="text-body-s text-grey-light">
      {value.length}/{MAX_LENGTH}
    </span>
  );

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={`nickname-${id}`} className="text-label-s text-grey-dark">
        닉네임
      </label>
      <Input
        id={`nickname-${id}`}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder="닉네임을 입력해 주세요."
        maxLength={MAX_LENGTH}
        error={error}
        helpText={HELP_TEXT}
        suffix={charCount}
      />
    </div>
  );
}
