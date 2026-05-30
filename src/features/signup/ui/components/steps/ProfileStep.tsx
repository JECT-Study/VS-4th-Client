import { Spinner } from "@base/ui/Spinner";
import { useState } from "react";
import { PROFILE_COLOR } from "../../../config/profileColors";
import type { ImageColor, ProfileState } from "../../../model/types";
import { NicknameInput } from "../../components/NicknameInput";
import { ProfileColorPicker } from "./ProfileColorPicker";

interface ProfileStepProps {
  profileState: ProfileState;
  isDefaultsLoading: boolean;
  setImageColor: (color: ImageColor) => void;
  setNickname: (value: string) => void;
}

export function ProfileStep({ profileState, isDefaultsLoading, setImageColor, setNickname }: ProfileStepProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  if (isDefaultsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-title-m">
        언제든 마이페이지에서
        <br />
        수정할 수 있어요
      </h2>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            aria-label="프로필 이미지 변경"
            className="relative"
          >
            <img src={PROFILE_COLOR[profileState.imageColor]} alt="" className="w-16 h-16" />
            <span
              className="absolute bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md"
              aria-hidden="true"
            >
              <img src="/assets/icons/edit.svg" alt="" />
            </span>
          </button>
        </div>

        <NicknameInput value={profileState.nickname} onChange={setNickname} error={profileState.nicknameError} />
      </div>

      <ProfileColorPicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={(color) => setImageColor(color)}
        selectedColor={profileState.imageColor}
      />
    </div>
  );
}
