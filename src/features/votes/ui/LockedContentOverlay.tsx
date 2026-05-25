import { useNavigate } from "@tanstack/react-router";

const LockedContentOverlay = () => {
  const navigate = useNavigate();

  return (
    <div className="px-5 py-10 rounded-lg flex flex-col items-center">
      <img src="/assets/icons/lock.svg" alt="" />
      <p className="text-title-s mt-5 text-center">더 자세한 결과가 궁금하신가요?</p>
      <p className="text-body-s text-grey-light mt-2 text-center">
        로그인하면 성별/연령대 세그먼트 분석 결과와 채팅 반응까지 모두 볼 수 있어요
      </p>
      <button
        type="button"
        className="w-full text-grey-divider bg-primary text-body-m py-[10px] rounded-lg mt-10"
        onClick={() => navigate({ to: "/login" })}
      >
        로그인하고 전체 보기
      </button>
    </div>
  );
};

export default LockedContentOverlay;
