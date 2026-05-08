import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { checkNickname, extractNicknameCheckError } from "../api/nicknameCheck";
import { saveProfile } from "../api/saveProfile";
import { signupDefaultsQueryOptions } from "../api/signupDefaultsQuery";
import {
  canProceedStep1,
  canProceedStep2,
  canProceedStep3,
  validateBirthYear,
  validateNickname,
} from "./signupValidation";
import type { Gender, GenderBirthState, ImageColor, ProfileState, SignupStep, TermsState } from "./types";

const INITIAL_TERMS: TermsState = { age: false, privacy: false, tos: false, push: false };

const INITIAL_GENDER_BIRTH: GenderBirthState = {
  gender: null,
  birthYear: "",
  birthYearError: null,
};

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
  const [termsState, setTermsState] = useState<TermsState>(INITIAL_TERMS);
  const [genderBirthState, setGenderBirthState] = useState<GenderBirthState>(INITIAL_GENDER_BIRTH);
  const [profileState, setProfileState] = useState<ProfileState>({
    imageColor: "GREEN",
    nickname: "",
    defaultNickname: "",
    defaultImageColor: "GREEN",
    nicknameError: null,
    isCheckingNickname: false,
  });

  const {
    data: signupDefaults,
    isLoading: isDefaultsLoading,
    isError: isDefaultsError,
  } = useQuery({
    ...signupDefaultsQueryOptions(),
    enabled: currentStep >= 2,
  });

  const isDefaultsInitializedRef = useRef(false);
  const pendingStep3Ref = useRef(false);

  useEffect(() => {
    if (signupDefaults && !isDefaultsInitializedRef.current) {
      isDefaultsInitializedRef.current = true;
      setProfileState((prev) => ({
        ...prev,
        nickname: signupDefaults.nickname,
        defaultNickname: signupDefaults.nickname,
        imageColor: signupDefaults.imageColor,
        defaultImageColor: signupDefaults.imageColor,
      }));
      if (pendingStep3Ref.current) {
        pendingStep3Ref.current = false;
        setCurrentStep(3);
      }
    }
  }, [signupDefaults]);

  useEffect(() => {
    if (isDefaultsError && pendingStep3Ref.current) {
      pendingStep3Ref.current = false;
      toast.error("기본 정보를 불러오지 못했어요. 다시 시도해 주세요.");
    }
  }, [isDefaultsError]);

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
        return {
          ...prev,
          isCheckingNickname: false,
          nicknameError: extractNicknameCheckError(error),
        };
      });
    },
  });

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

  // ── Terms (Step 1) ────────────────────────────────────────────────────────

  const isAllChecked = termsState.age && termsState.privacy && termsState.tos && termsState.push;

  const toggleAll = () => {
    const next = !isAllChecked;
    setTermsState({ age: next, privacy: next, tos: next, push: next });
  };

  const toggleTerm = (key: keyof TermsState) => {
    setTermsState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ── Gender/Birth (Step 2) ──────────────────────────────────────────────────

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

  // ── Profile (Step 3) ───────────────────────────────────────────────────────

  const setImageColor = (color: ImageColor) => {
    setProfileState((prev) => ({ ...prev, imageColor: color }));
  };

  const setNickname = (value: string) => {
    const capped = value.slice(0, 10);
    setProfileState((prev) => ({
      ...prev,
      nickname: capped,
      nicknameError: validateNickname(capped),
    }));
  };

  const handleNicknameBlur = () => {
    const localError = validateNickname(profileState.nickname);
    if (localError || profileState.nickname.length < 2) return;
    if (profileState.nickname === profileState.defaultNickname) return;
    checkNicknameMutation.mutate(profileState.nickname);
  };

  // ── Navigation ─────────────────────────────────────────────────────────────

  const goBack = () => {
    if (currentStep === 1) {
      navigate({ to: "/login" });
    } else {
      setCurrentStep((prev) => (prev - 1) as SignupStep);
    }
  };

  const skipProfile = () => {
    saveProfileMutation.mutate({
      birthDate: genderBirthState.birthYear,
      gender: genderBirthState.gender!,
      nickname: profileState.defaultNickname,
      imageColor: profileState.defaultImageColor,
    });
  };

  // ── Primary action ─────────────────────────────────────────────────────────

  const canProceed =
    currentStep === 1
      ? canProceedStep1(termsState)
      : currentStep === 2
        ? canProceedStep2(genderBirthState)
        : currentStep === 3
          ? canProceedStep3(profileState)
          : true;

  const onPrimaryAction = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (isDefaultsLoading) {
        pendingStep3Ref.current = true;
      } else {
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      saveProfileMutation.mutate({
        birthDate: genderBirthState.birthYear,
        gender: genderBirthState.gender!,
        nickname: profileState.nickname,
        imageColor: profileState.imageColor,
      });
    } else {
      navigate({ to: "/home" });
    }
  };

  return {
    currentStep,
    goBack,
    skipProfile,

    canProceed,
    primaryButtonLabel: PRIMARY_BUTTON_LABELS[currentStep],
    onPrimaryAction,
    isSavePending: saveProfileMutation.isPending,

    termsState,
    isAllChecked,
    toggleAll,
    toggleTerm,

    genderBirthState,
    setGender,
    setBirthYear,

    profileState,
    isDefaultsLoading,
    setImageColor,
    setNickname,
    handleNicknameBlur,
  };
}
