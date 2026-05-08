import { Button } from "@base/ui/Button";
import { useSignupFunnel } from "../model/useSignupFunnel";
import { SignupHeader } from "./SignupHeader";
import { CompleteStep } from "./components/steps/CompleteStep";
import { GenderBirthStep } from "./components/steps/GenderBirthStep";
import { ProfileStep } from "./components/steps/ProfileStep";
import { TermsStep } from "./components/steps/TermsStep";

export function SignupPage() {
  const funnel = useSignupFunnel();

  return (
    <main className="flex flex-col min-h-dvh bg-white text-grey-dark">
      <SignupHeader
        currentStep={funnel.currentStep}
        onBack={funnel.goBack}
        onSkip={funnel.skipProfile}
        isSavePending={funnel.isSavePending}
      />

      <div className="flex-1 py-4 px-5">
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
            handleNicknameBlur={funnel.handleNicknameBlur}
          />
        )}
        {funnel.currentStep === 4 && <CompleteStep />}
      </div>

      <div className="pt-2 px-5" style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}>
        <Button onClick={funnel.onPrimaryAction} disabled={!funnel.canProceed} isLoading={funnel.isSavePending}>
          {funnel.primaryButtonLabel}
        </Button>
      </div>
    </main>
  );
}
