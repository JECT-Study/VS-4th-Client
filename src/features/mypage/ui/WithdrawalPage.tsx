import { Button } from "@base/ui/Button";
import { Checkbox } from "@base/ui/Checkbox";
import { showToast } from "@base/ui/Toast";
import { withdraw } from "@features/mypage/api/withdraw";
import { WITHDRAWAL_REASONS, useWithdrawalForm } from "@features/mypage/model/useWithdrawalForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import clsx from "clsx";
import { useState } from "react";
import { Header } from "./MypageHeader";

export function WithdrawalPage() {
  const { reason, setReason, feedback, setFeedback, isAgreed, setIsAgreed, isFormValid } = useWithdrawalForm();
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const withdrawMutation = useMutation({
    mutationFn: withdraw,
    onSuccess: () => {
      queryClient.clear();
      queryClient.setQueryData(["user", "me"], null);
      showToast.success("탈퇴가 완료되었어요.");
      navigate({ to: "/home" });
    },
    onError: () => {
      showToast.warning("일시적인 오류로 탈퇴하지 못했어요.");
    },
  });

  // 바텀시트 닫기 핸들러
  const handleCloseBottomSheet = () => {
    setIsSelectOpen(false);
  };

  // 👇 핵심 수정: '기타' 사유일 때 피드백이 0자여도 버튼이 활성화(색상 변경)되도록 커스텀 조건 추가
  const isSubmitActive =
    isFormValid || (isAgreed && !!reason && (reason !== "기타" || feedback.length === 0 || feedback.length >= 10));

  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      <Header title="회원 탈퇴" />

      <main className="flex-1 px-5 pt-8 pb-32">
        <section className="mb-10">
          <h2 className="mb-2 font-semibold text-center text-h-s">정말 탈퇴하시겠어요?</h2>
          <p className="mb-6 font-medium text-center text-title-s text-grey-dark">
            탈퇴한 후에는 계정을 복구할 수 없어요
            <br />
            아래 내용을 확인해 주세요
          </p>

          <ul className="bg-grey-bg rounded-[16px] p-5 flex flex-col gap-4">
            {[
              "프로필 정보 및 닉네임이 모두 삭제돼요",
              "동일 이메일로 30일 내 재가입이 제한돼요",
              "참여하신 투표의 결과와 채팅 내용을 다시 볼 수 없어요",
              "참여하신 투표와 채팅 데이터는 커뮤니티 통계를 위해 익명으로 유지돼요",
            ].map((text) => (
              <li key={text} className="flex gap-2 font-normal text-body-s text-grey-dark">
                <span className="font-bold shrink-0">•</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="withdrawal-reason-btn" className="font-normal text-body-s">
              서비스 이용에 불편함이 있으셨나요?
            </label>
            <div>
              <button
                id="withdrawal-reason-btn"
                type="button"
                onClick={() => setIsSelectOpen(true)}
                className="flex items-center justify-between w-full h-12 px-4 font-normal bg-white border rounded-lg border-grey-divider text-body-s"
              >
                <span className={reason ? "text-black" : "text-grey-light"}>
                  {reason || "아쉬웠던 점을 선택해 주세요"}
                </span>
                <img src="/assets/icons/dropdown-arrow.svg" className="w-5 h-5" alt="" />
              </button>
            </div>
          </div>

          {reason === "기타" && (
            <div className="flex flex-col gap-2">
              <label htmlFor="withdrawal-feedback" className="font-normal text-body-s">
                남겨주신 소중한 의견으로 더 나은 VS가 될게요
              </label>
              <div className="relative">
                <textarea
                  id="withdrawal-feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value.slice(0, 500))}
                  placeholder="10자 이상 입력해 주세요. (선택)"
                  className="w-full h-32 p-4 bg-white border rounded-lg resize-none border-grey-divider text-body-s focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
                <span className="absolute bottom-3 right-4 text-label-s text-grey-light">{feedback.length}/500</span>
              </div>
            </div>
          )}

          <Checkbox
            checked={isAgreed}
            onChange={setIsAgreed}
            label="위 내용을 모두 확인했으며, 탈퇴에 동의합니다."
            className="py-2 mt-2"
          />
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-10 flex w-full max-w-md gap-3 p-5 mx-auto bg-white border-t border-grey-divider">
        <Button
          variant="primary"
          className="flex-1 font-bold h-14"
          disabled={withdrawMutation.isPending}
          onClick={() => navigate({ to: "/mypage/account" })}
        >
          계속 이용하기
        </Button>

        {/* 👇 isSubmitActive 상태에 따라 탈퇴하기 버튼의 색상이 변하도록 로직 적용 */}
        <Button
          variant="ghost"
          disabled={!isSubmitActive || withdrawMutation.isPending}
          isLoading={withdrawMutation.isPending}
          className={clsx(
            "flex-1 h-14 font-bold transition-colors duration-200 !border",
            isSubmitActive
              ? "!bg-white !text-primary !border-grey-divider" // 활성화 시: 흰 배경, 보라색 글자
              : "!bg-grey-bg !text-grey-light !border-transparent", // 비활성화 시: 회색 배경, 회색 글자
          )}
          onClick={() => withdrawMutation.mutate({ category: reason, reason: feedback })}
        >
          탈퇴하기
        </Button>
      </footer>

      {isSelectOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end w-full max-w-md mx-auto">
          <div
            className="absolute inset-0 transition-opacity bg-black/60"
            onClick={handleCloseBottomSheet}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleCloseBottomSheet();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="바텀시트 닫기"
          />

          <div className="relative z-10 w-full pt-3 pb-8 bg-white rounded-t-2xl animate-slide-up">
            <div className="w-10 h-1 mx-auto mb-4 rounded-full bg-grey-divider" />

            <ul className="flex flex-col">
              {WITHDRAWAL_REASONS.map((r: string) => (
                <li key={r}>
                  <button
                    type="button"
                    onClick={() => {
                      setReason(r);
                      setIsSelectOpen(false);
                    }}
                    className="w-full px-5 py-4 font-normal text-left transition-colors text-body-s active:bg-grey-bg"
                  >
                    {r}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
