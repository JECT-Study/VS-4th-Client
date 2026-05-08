import { BottomSheet } from "@base/ui/BottomSheet";
import { Button } from "@base/ui/Button";
import { useState } from "react";
import { PROFILE_COLOR } from "./ProfileStep";

type ProfileColorPickerProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedColor: string;
  onSelect: (color: string) => void;
};

const ProfileColorPicker = ({ isOpen, onClose, selectedColor, onSelect }: ProfileColorPickerProps) => {
  const [newColor, setNewColor] = useState(selectedColor);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div>
        <p className="text-title-m text-center">프로필 이미지 변경</p>
        <div className="mt-8 flex items-center gap-8 justify-center py-3">
          {PROFILE_COLOR.map(({ color, image }) => (
            <button type="button" key={color} onClick={() => setNewColor(color)} className="relative">
              <img src={image} alt={`${color.toLowerCase()} 선택`} className="w-12 h-12" />
              {newColor === color && (
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                  <img src="/assets/icons/check.svg" alt="" className="w-[22px] h-[14px]" />
                </div>
              )}
            </button>
          ))}
        </div>
        <div
          className="flex items-end gap-2 mt-8 px-5"
          style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
        >
          <Button variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button
            onClick={() => {
              onSelect(newColor);
              onClose();
            }}
          >
            저장
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
};

export default ProfileColorPicker;
