import type { SignupStep } from "../model/types";

interface SignupHeaderProps {
  currentStep: SignupStep;
  onBack: () => void;
  onSkip: () => void;
  isSavePending: boolean;
}

export function SignupHeader({ currentStep, onBack, onSkip, isSavePending }: SignupHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-white py-[6px] pl-1 pr-5">
      <div className="flex items-center gap-2">
        {currentStep === 4 ? (
          <span aria-hidden="true" className="block p-[10px]">
            <img src="/assets/icons/arrow-left.svg" alt="" className="invisible" />
          </span>
        ) : (
          <button type="button" onClick={onBack} className="p-[10px] text-grey-dark">
            <img src="/assets/icons/arrow-left.svg" alt="뒤로가기" />
          </button>
        )}

        <h1 className="text-title-m text-grey-black">회원가입</h1>
      </div>

      {currentStep === 3 && (
        <button type="button" onClick={onSkip} disabled={isSavePending} className="text-body-m text-grey-light">
          나중에 할게요
        </button>
      )}
    </header>
  );
}
