import { useState } from "react";
import type { TermsState } from "./types";

const INITIAL_TERMS: TermsState = { age: false, privacy: false, tos: false, push: false };

export function useTermsStep() {
  const [termsState, setTermsState] = useState<TermsState>(INITIAL_TERMS);

  const isAllChecked = termsState.age && termsState.privacy && termsState.tos && termsState.push;

  const toggleAll = () => {
    const next = !isAllChecked;
    setTermsState({ age: next, privacy: next, tos: next, push: next });
  };

  const toggleTerm = (key: keyof TermsState) => {
    setTermsState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return { termsState, isAllChecked, toggleAll, toggleTerm };
}
