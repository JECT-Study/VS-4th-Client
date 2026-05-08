export function CompleteStep() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 pt-32 gap-8">
      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
        <img src="/assets/icons/check.svg" alt="" className="w-[22px] h-[15px]" />
      </div>
      <div className="text-center">
        <h2 className="text-h-s">반가워요!</h2>
        <p className="text-title-s text-grey-light mt-4">
          지금 핫한 논쟁거리들이
          <br />
          당신의 선택을 기다리고 있어요
        </p>
      </div>
    </div>
  );
}
