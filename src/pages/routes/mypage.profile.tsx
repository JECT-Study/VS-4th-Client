import { Button } from "@base/ui/Button";
import { showToast } from "@base/ui/Toast";
import { userQueryOptions } from "@features/auth/api/userQuery";
import { extractUpdateProfileError, updateProfile } from "@features/mypage/api/updateProfile";
import { checkNickname, extractNicknameCheckError } from "@features/signup/api/nicknameCheck";
import { PROFILE_COLOR } from "@features/signup/config/profileColors";
import { canProceedStep3, validateNickname } from "@features/signup/model/signupValidation";
import type { ImageColor, ProfileState } from "@features/signup/model/types";
import { NicknameInput } from "@features/signup/ui/components/NicknameInput";
import LeaveConfirmationModal from "@features/signup/ui/components/steps/LeaveConfirmationModal";
import { ProfileColorPicker } from "@features/signup/ui/components/steps/ProfileColorPicker";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/mypage/profile")({
  component: RouteComponent,
});

const INITIAL_PROFILE: ProfileState = {
  imageColor: "GREEN",
  nickname: "",
  nicknameError: null,
  isCheckingNickname: false,
};

function useProfileEdit() {
  const [profileState, setProfileState] = useState<ProfileState>(INITIAL_PROFILE);

  const originalNicknameRef = useRef("");
  const originalImageColorRef = useRef<ImageColor>("GREEN");
  const isInitializedRef = useRef(false);

  const { data: user } = useQuery(userQueryOptions());

  useEffect(() => {
    if (isInitializedRef.current || user === undefined) return;
    const nickname = user?.nickname ?? "";
    const imageColor = (user?.imageColor as ImageColor | undefined) ?? "GREEN";
    isInitializedRef.current = true;
    originalNicknameRef.current = nickname;
    originalImageColorRef.current = imageColor;
    setProfileState((prev) => ({ ...prev, nickname, imageColor }));
  }, [user]);

  const checkNicknameMutation = useMutation({
    mutationFn: checkNickname,
    onMutate: () => {
      setProfileState((prev) => ({ ...prev, isCheckingNickname: true, nicknameError: null }));
    },
    onSuccess: (_data, variables) => {
      setProfileState((prev) => {
        if (prev.nickname !== variables) return prev;
        return { ...prev, isCheckingNickname: false };
      });
    },
    onError: (error: unknown, variables) => {
      setProfileState((prev) => {
        if (prev.nickname !== variables) return prev;
        return { ...prev, isCheckingNickname: false, nicknameError: extractNicknameCheckError(error) };
      });
    },
  });

  const setImageColor = (color: ImageColor) => {
    setProfileState((prev) => ({ ...prev, imageColor: color }));
  };

  const setNickname = (value: string) => {
    const capped = value.slice(0, 10);
    setProfileState((prev) => ({ ...prev, nickname: capped, nicknameError: validateNickname(capped) }));
  };

  const handleNicknameBlur = () => {
    const localError = validateNickname(profileState.nickname);
    if (localError || profileState.nickname.length < 2) return;
    if (profileState.nickname === originalNicknameRef.current) return;
    checkNicknameMutation.mutate(profileState.nickname);
  };

  const canSave = canProceedStep3(profileState, originalNicknameRef.current, originalImageColorRef.current);
  const hasChanges =
    profileState.nickname !== originalNicknameRef.current ||
    profileState.imageColor !== originalImageColorRef.current;

  return { profileState, setImageColor, setNickname, handleNicknameBlur, canSave, hasChanges };
}

function RouteComponent() {
  const { profileState, setImageColor, setNickname, handleNicknameBlur, canSave, hasChanges } = useProfileEdit();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const saveProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      showToast.success("프로필이 저장되었습니다");
      queryClient.invalidateQueries(userQueryOptions());
      navigate({ to: "/mypage" });
    },
    onError: (error: unknown) => {
      showToast.warning(extractUpdateProfileError(error));
    },
  });

  const handleSubmit = () => {
    saveProfileMutation.mutate({ nickname: profileState.nickname, imageColor: profileState.imageColor });
  };

  return (
    <div>
      <header className="py-[6px] pl-1 pr-5">
        <div className="flex items-center gap-[2px]">
          <button
            type="button"
            className="p-[10px] text-grey-dark"
            onClick={() => {
              if (hasChanges) setIsLeaveModalOpen(true);
              else navigate({ to: "/mypage" });
            }}
          >
            <img src="/assets/icons/arrow-left.svg" alt="뒤로가기" />
          </button>

          <h1 className="text-title-m">프로필 편집</h1>
        </div>
      </header>

      <div className="flex flex-col gap-6 mt-5 px-5">
        <div className="flex flex-col gap-6">
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

          <NicknameInput
            value={profileState.nickname}
            onChange={setNickname}
            onBlur={handleNicknameBlur}
            error={profileState.nicknameError}
          />
        </div>

        <ProfileColorPicker
          isOpen={isPickerOpen}
          onClose={() => setIsPickerOpen(false)}
          onSelect={(color) => setImageColor(color)}
          selectedColor={profileState.imageColor}
        />
      </div>

      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white pt-2 px-5"
        style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
      >
        <Button disabled={!canSave || saveProfileMutation.isPending} onClick={handleSubmit}>
          저장
        </Button>
      </div>

      <LeaveConfirmationModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onConfirm={() => navigate({ to: "/mypage" })}
      />
    </div>
  );
}
