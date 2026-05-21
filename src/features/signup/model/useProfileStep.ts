import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { checkNickname, extractNicknameCheckError } from "../api/nicknameCheck";
import { signupDefaultsQueryOptions } from "../api/signupDefaultsQuery";
import { validateNickname } from "./signupValidation";
import type { ImageColor, ProfileState } from "./types";

const INITIAL_PROFILE: ProfileState = {
  imageColor: "GREEN",
  nickname: "",
  nicknameError: null,
  isCheckingNickname: false,
};

export function useProfileStep() {
  const [profileState, setProfileState] = useState<ProfileState>(INITIAL_PROFILE);

  const defaultNicknameRef = useRef("");
  const defaultImageColorRef = useRef<ImageColor>("GREEN");
  const isDefaultsInitializedRef = useRef(false);

  const { data: signupDefaults, isLoading: isDefaultsLoading } = useQuery(signupDefaultsQueryOptions());

  useEffect(() => {
    if (signupDefaults && !isDefaultsInitializedRef.current) {
      isDefaultsInitializedRef.current = true;
      defaultNicknameRef.current = signupDefaults.nickname;
      defaultImageColorRef.current = signupDefaults.imageColor;
      setProfileState((prev) => ({
        ...prev,
        nickname: signupDefaults.nickname,
        imageColor: signupDefaults.imageColor,
      }));
    }
  }, [signupDefaults]);

  const checkNicknameMutation = useMutation({
    mutationFn: checkNickname,
    onMutate: () => {
      setProfileState((prev) => ({ ...prev, isCheckingNickname: true, nicknameError: null }));
    },
    onSuccess: (_data, variables) => {
      setProfileState((prev) => {
        // Always reset isCheckingNickname even if nickname changed mid-flight
        if (prev.nickname !== variables) {
          return { ...prev, isCheckingNickname: false, nicknameError: null };
        }
        return { ...prev, isCheckingNickname: false };
      });
    },
    onError: (error: unknown, variables) => {
      setProfileState((prev) => {
        if (prev.nickname !== variables) {
          return { ...prev, isCheckingNickname: false, nicknameError: null };
        }
        return { ...prev, isCheckingNickname: false, nicknameError: extractNicknameCheckError(error) };
      });
    },
  });

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
    if (profileState.nickname === defaultNicknameRef.current) return;
    checkNicknameMutation.mutate(profileState.nickname);
  };

  const getDefaults = () => ({
    nickname: defaultNicknameRef.current,
    imageColor: defaultImageColorRef.current,
  });

  return {
    profileState,
    isDefaultsLoading,
    setImageColor,
    setNickname,
    handleNicknameBlur,
    getDefaults,
  };
}
