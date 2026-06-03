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
      queryClient.removeQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ refetchType: "all" });
      showToast.success("탈퇴가 완료되었어요.");
      navigate({ to: "/home" });
    },
    onError: () => {
      showToast.warning("일시적인 오류로 탈퇴하지 못했어요.");
    },
  });

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header title="회원 탈퇴" />

      <main className="flex-1 px-5 pt-8 pb-32">
        <section className="mb-10">
          <h2 className="text-title-l font-bold text-center mb-2">정말 탈퇴하시겠어요?</h2>
          <p className="text-body-m text-grey-dark text-center mb-6">
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
              <li key={text} className="flex gap-2 text-body-s text-grey-dark">
                <span className="shrink-0">•</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="withdrawal-reason-btn" className="text-label-m font-bold">
              서비스 이용에 불편함이 있으셨나요? *
            </label>
            <div className="relative">
              <button
                id="withdrawal-reason-btn"
                type="button"
                onClick={() => setIsSelectOpen(!isSelectOpen)}
                className="w-full h-12 px-4 flex items-center justify-between border border-grey-divider rounded-lg text-body-m bg-white"
              >
                <span className={reason ? "text-black" : "text-grey-light"}>
                  {reason || "아쉬웠던 점을 선택해 주세요"}
                </span>
                <img
                  src="/assets/icons/arrow-down.svg"
                  className={clsx("w-5 h-5 transition-transform", isSelectOpen && "rotate-180")}
                  alt=""
                />
              </button>

              {isSelectOpen && (
                <ul className="absolute top-14 left-0 w-full bg-white border border-grey-divider rounded-lg z-10 shadow-lg overflow-hidden">
                  {WITHDRAWAL_REASONS.map((r: string) => (
                    <li key={r}>
                      <button
                        type="button"
                        onClick={() => {
                          setReason(r);
                          setIsSelectOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left text-body-m hover:bg-grey-bg transition-colors"
                      >
                        {r}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* '기타' 사유 선택 시에만 노출되는 텍스트 에어리어 */}
          {reason === "기타" && (
            <div className="flex flex-col gap-2">
              <label htmlFor="withdrawal-feedback" className="text-label-m font-bold">
                소중한 의견을 반영해 더 나은 VS가 될게요
              </label>
              <div className="relative">
                <textarea
                  id="withdrawal-feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value.slice(0, 500))}
                  placeholder="10자 이상 입력해 주세요. (선택)"
                  className="w-full h-32 p-4 border border-grey-divider rounded-lg text-body-m resize-none focus:outline-primary bg-white"
                />
                <span className="absolute bottom-3 right-4 text-label-s text-grey-light">{feedback.length}/500</span>
              </div>
            </div>
          )}

          {/* 👇 만들어두신 공통 Checkbox 컴포넌트 적용 */}
          <Checkbox
            checked={isAgreed}
            onChange={setIsAgreed}
            label="위 내용을 모두 확인했으며, 탈퇴에 동의합니다."
            className="py-2 mt-2"
          />
        </section>
      </main>

      {/* 하단 고정 버튼부 */}
      <footer className="fixed bottom-0 left-0 w-full p-5 bg-white flex gap-3 border-t border-grey-divider max-w-md mx-auto right-0">
        {/* 👇 만들어두신 공통 Button 컴포넌트 적용 */}
        <Button
          variant="primary"
          className="flex-1 h-14 font-bold"
          disabled={withdrawMutation.isPending}
          onClick={() => navigate({ to: "/mypage/account" })}
        >
          계속 이용하기
        </Button>
        <Button
          variant="ghost"
          disabled={!isFormValid || withdrawMutation.isPending}
          isLoading={withdrawMutation.isPending}
          className="flex-1 h-14 font-bold border-none !bg-grey-bg"
          onClick={() => withdrawMutation.mutate({ category: reason, reason: feedback })}
        >
          {/* Button 내부 variant에 따라 색상이 강제되므로, 탈퇴하기 버튼의 디자인을 맞추기 위해 !bg-grey-bg 등 Tailwind 강제 적용(오버라이딩)을 섞어 쓸 수 있습니다. */}
          탈퇴하기
        </Button>
      </footer>
    </div>
  );
}
