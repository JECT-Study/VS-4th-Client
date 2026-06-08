import { Button } from "@base/ui/Button";
import { useState } from "react";
import { useSignupFunnel } from "../model/useSignupFunnel";
import { SignupHeader } from "./SignupHeader";
import { CompleteStep } from "./components/steps/CompleteStep";
import { GenderBirthStep } from "./components/steps/GenderBirthStep";
import LeaveConfirmationModal from "./components/steps/LeaveConfirmationModal";
import { ProfileStep } from "./components/steps/ProfileStep";
import { TermsStep } from "./components/steps/TermsStep";

export function SignupPage() {
    const funnel = useSignupFunnel();
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

    const handleBack = () => {
        if (funnel.currentStep === 3 && funnel.hasProfileChanges) {
            setIsLeaveModalOpen(true);
        } else {
            funnel.goBack();
        }
    };

    return (
        // 1. 높이를 100dvh로 고정하고, 화면 전체의 불필요한 스크롤을 막습니다.
        <main className="flex flex-col h-[100dvh] overflow-hidden bg-white text-grey-dark">
            <SignupHeader
                currentStep={funnel.currentStep}
                onBack={handleBack}
                onSkip={funnel.skipProfile}
                isSavePending={funnel.isSavePending}
            />

            {/* 2. 컨텐츠 영역에 flex-1과 overflow-y-auto를 주어 이 부분만 스크롤되도록 합니다. */}
            <div className="flex-1 overflow-y-auto py-4 px-5">
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

            {/* 3. 하단 버튼 영역은 shrink-0으로 압착을 방지합니다. */}
            <div className="shrink-0 pt-2 px-5" style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}>
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