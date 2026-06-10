import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { saveProfile } from "../api/saveProfile";
import { canProceedStep1, canProceedStep2, canProceedStep3 } from "./signupValidation";
import type { SignupStep } from "./types";
import { useGenderBirthStep } from "./useGenderBirthStep";
import { useProfileStep } from "./useProfileStep";
import { useTermsStep } from "./useTermsStep";

const PRIMARY_BUTTON_LABELS: Record<SignupStep, string> = {
  1: "다음",
  2: "다음",
  3: "저장",
  4: "확인",
};

export function useSignupFunnel() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState<SignupStep>(1);

  const termsStep = useTermsStep();
  const genderBirthStep = useGenderBirthStep();
  const profileStep = useProfileStep();

  const saveProfileMutation = useMutation({
    mutationFn: saveProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      setCurrentStep(4);
    },
    onError: () => {
      toast.error("저장에 실패했어요. 다시 시도해 주세요.");
    },
  });

  const goBack = () => {
    if (currentStep === 1) {
      navigate({ to: "/login" });
    } else if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as SignupStep);
    }
  };

  const skipProfile = () => {
    const defaults = profileStep.getDefaults();
    saveProfileMutation.mutate({
      birthDate: genderBirthStep.genderBirthState.birthYear,
      gender: genderBirthStep.genderBirthState.gender!,
      nickname: defaults.nickname,
      imageColor: defaults.imageColor,
    });
  };

  function computeCanProceed(): boolean {
    switch (currentStep) {
      case 1:
        return canProceedStep1(termsStep.termsState);
      case 2:
        return canProceedStep2(genderBirthStep.genderBirthState);
      case 3:
        return canProceedStep3(profileStep.profileState) && profileStep.profileState.nickname !== profileStep.getDefaults().nickname;
      case 4:
        return true;
    }
  }

  const onPrimaryAction = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      saveProfileMutation.mutate({
        birthDate: genderBirthStep.genderBirthState.birthYear,
        gender: genderBirthStep.genderBirthState.gender!,
        nickname: profileStep.profileState.nickname,
        imageColor: profileStep.profileState.imageColor,
      });
    } else {
      navigate({ to: "/home" });
    }
  };

  const profileDefaults = profileStep.getDefaults();
  const hasProfileChanges =
    profileStep.profileState.nickname !== profileDefaults.nickname ||
    profileStep.profileState.imageColor !== profileDefaults.imageColor;

  return {
    currentStep,
    goBack,
    skipProfile,
    hasProfileChanges,
    resetProfileToDefaults: profileStep.resetToDefaults,

    canProceed: computeCanProceed(),
    primaryButtonLabel: PRIMARY_BUTTON_LABELS[currentStep],
    onPrimaryAction,
    isSavePending: saveProfileMutation.isPending,

    termsState: termsStep.termsState,
    isAllChecked: termsStep.isAllChecked,
    toggleAll: termsStep.toggleAll,
    toggleTerm: termsStep.toggleTerm,

    genderBirthState: genderBirthStep.genderBirthState,
    setGender: genderBirthStep.setGender,
    setBirthYear: genderBirthStep.setBirthYear,

    profileState: profileStep.profileState,
    isDefaultsLoading: profileStep.isDefaultsLoading,
    setImageColor: profileStep.setImageColor,
    setNickname: profileStep.setNickname,
  };
}
