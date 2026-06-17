import { Button } from "@base/ui/Button";
import { useEffect, useState } from "react";
import { useSignupFunnel } from "../model/useSignupFunnel";
import { SignupHeader } from "./SignupHeader";
import { CompleteStep } from "./components/steps/CompleteStep";
import { GenderBirthStep } from "./components/steps/GenderBirthStep";
import LeaveConfirmationModal from "./components/steps/LeaveConfirmationModal";
import { ProfileStep } from "./components/steps/ProfileStep";
import { TermsStep } from "./components/steps/TermsStep";

function useKeyboardInset() {
  const [keyboardInset, setKeyboardInset] = useState(0);

  useEffect(() => {
    const visualViewport = window.visualViewport;
    if (!visualViewport) return;

    const updateKeyboardInset = () => {
      const inset = Math.max(0, window.innerHeight - visualViewport.height - visualViewport.offsetTop);
      setKeyboardInset(inset);
    };

    updateKeyboardInset();
    visualViewport.addEventListener("resize", updateKeyboardInset);
    visualViewport.addEventListener("scroll", updateKeyboardInset);

    return () => {
      visualViewport.removeEventListener("resize", updateKeyboardInset);
      visualViewport.removeEventListener("scroll", updateKeyboardInset);
    };
  }, []);

  return keyboardInset;
}

export function SignupPage() {
  const funnel = useSignupFunnel();
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const keyboardInset = useKeyboardInset();
  const isKeyboardOpen = keyboardInset > 0;

  const handleBack = () => {
    if (funnel.currentStep === 3 && funnel.hasProfileChanges) {
      setIsLeaveModalOpen(true);
    } else {
      funnel.goBack();
    }
  };

  return (
    // 👇 수정 1: h-[100dvh], overflow-hidden 제거 -> min-h-dvh 로 변경하여 브라우저 네이티브 스크롤 허용
    <main className="flex flex-col bg-white min-h-dvh text-grey-dark">
      {/* 참고: 헤더가 스크롤 시에도 상단에 고정되길 원한다면 SignupHeader 내부에 sticky top-0 bg-white z-10 을 추가하시면 됩니다. */}
      <SignupHeader
        currentStep={funnel.currentStep}
        onBack={handleBack}
        onSkip={funnel.skipProfile}
        isSavePending={funnel.isSavePending}
      />

      {/* 👇 수정 2: overflow-y-auto 제거 (내부 스크롤 대신 전체 화면 스크롤 사용) */}
      <div
        className="flex-1 px-5 py-4 pb-28 transition-transform duration-200 ease-out"
        style={{ transform: isKeyboardOpen ? "translateY(-90px)" : undefined }}
      >
        {funnel.currentStep === 1 && (
          <TermsStep
            termsState={funnel.termsState}
            isAllChecked={funnel.isAllChecked}
            toggleAll={funnel.toggleAll}
            toggleTerm={funnel.toggleTerm}
          />
        )}
        {funnel.currentStep === 2 && (
          <GenderBirthStep
            genderBirthState={funnel.genderBirthState}
            setGender={funnel.setGender}
            setBirthYear={funnel.setBirthYear}
          />
        )}
        {funnel.currentStep === 3 && (
          <ProfileStep
            profileState={funnel.profileState}
            isDefaultsLoading={funnel.isDefaultsLoading}
            setImageColor={funnel.setImageColor}
            setNickname={funnel.setNickname}
          />
        )}
        {funnel.currentStep === 4 && <CompleteStep />}
      </div>

      {/* 하단 버튼 영역 */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white px-5 pt-2"
        style={{
          bottom: keyboardInset,
          paddingBottom: keyboardInset > 0 ? "1rem" : "calc(1rem + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <Button onClick={funnel.onPrimaryAction} disabled={!funnel.canProceed} isLoading={funnel.isSavePending}>
          {funnel.primaryButtonLabel}
        </Button>
      </div>

      <LeaveConfirmationModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onConfirm={() => {
          funnel.resetProfileToDefaults();
          setIsLeaveModalOpen(false);
          funnel.goBack();
        }}
      />
    </main>
  );
}
