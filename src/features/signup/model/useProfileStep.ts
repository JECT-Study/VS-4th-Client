import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { checkNickname, extractNicknameCheckError } from "../api/nicknameCheck";
import { checkNicknameSlang } from "../api/nicknameSlang";
import { imageColorSuggestQueryOptions, nicknameSuggestQueryOptions } from "../api/signupDefaultsQuery";
import { validateNickname } from "./signupValidation";
import type { ImageColor, ProfileState } from "./types";

const INITIAL_PROFILE: ProfileState = {
  imageColor: "GREEN",
  nickname: "",
  nicknameError: null,
  isCheckingNickname: false,
};

const NICKNAME_CHECK_DEBOUNCE_MS = 500;

export function useProfileStep() {
  const [profileState, setProfileState] = useState<ProfileState>(INITIAL_PROFILE);

  const defaultNicknameRef = useRef("");
  const defaultImageColorRef = useRef<ImageColor>("GREEN");
  const isDefaultsInitializedRef = useRef(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: nicknameSuggest, isLoading: isNicknameLoading } = useQuery(nicknameSuggestQueryOptions());
  const { data: imageColorSuggest, isLoading: isColorLoading } = useQuery(imageColorSuggestQueryOptions());
  const isDefaultsLoading = isNicknameLoading || isColorLoading;

  useEffect(() => {
    if (nicknameSuggest && imageColorSuggest && !isDefaultsInitializedRef.current) {
      isDefaultsInitializedRef.current = true;
      defaultNicknameRef.current = nicknameSuggest.nickname;
      defaultImageColorRef.current = imageColorSuggest.imageColor;
      setProfileState((prev) => ({
        ...prev,
        nickname: nicknameSuggest.nickname,
        imageColor: imageColorSuggest.imageColor,
      }));
    }
  }, [nicknameSuggest, imageColorSuggest]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  const checkNicknameMutation = useMutation({
    mutationFn: async (nickname: string) => {
      const [checkResult, slangResult] = await Promise.allSettled([
        checkNickname(nickname),
        checkNicknameSlang(nickname),
      ]);
      if (checkResult.status === "rejected") throw checkResult.reason;
      if (slangResult.status === "rejected") throw slangResult.reason;
    },
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
    const localError = validateNickname(capped);
    setProfileState((prev) => ({ ...prev, nickname: capped, nicknameError: localError }));

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (!localError && capped.length >= 2 && capped !== defaultNicknameRef.current) {
      debounceTimerRef.current = setTimeout(() => {
        checkNicknameMutation.mutate(capped);
      }, NICKNAME_CHECK_DEBOUNCE_MS);
    }
  };

  const getDefaults = () => ({
    nickname: defaultNicknameRef.current,
    imageColor: defaultImageColorRef.current,
  });

  const resetToDefaults = () => {
    setProfileState((prev) => ({
      ...prev,
      nickname: defaultNicknameRef.current,
      imageColor: defaultImageColorRef.current,
      nicknameError: null,
      isCheckingNickname: false,
    }));
  };

  return {
    profileState,
    isDefaultsLoading,
    setImageColor,
    setNickname,
    getDefaults,
    resetToDefaults,
  };
}
