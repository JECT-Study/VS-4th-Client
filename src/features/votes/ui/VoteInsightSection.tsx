import { AgeBarChart } from "@base/ui/AgeBarChart";
import { GenderDonutChart } from "@base/ui/DonutChart";
import type { VoteResultOption } from "../model/resultTypes";
import type { AgeGroup, GenderChartProps, VoteUserType } from "../model/useVoteDetail";
import LockedContentOverlay from "./LockedContentOverlay";

interface VoteInsightSectionProps {
  resultOptions: VoteResultOption[];
  insightPrimaryOptionId: number | null;
  voteUserType: VoteUserType;
  genderChartProps: GenderChartProps;
  ageGroups: AgeGroup[];
  aiInsight: { available: boolean; headline: string | null; body: string | null };
  participantCount: number;
}

export function VoteInsightSection({
  resultOptions,
  insightPrimaryOptionId,
  voteUserType,
  genderChartProps,
  ageGroups,
  aiInsight,
  participantCount,
}: VoteInsightSectionProps) {
  const isGuest = voteUserType === "guest";
  const hasAiInsightContent = Boolean(aiInsight.headline || aiInsight.body);
  const shouldShowAiInsight = !isGuest && (aiInsight.available || hasAiInsightContent);

  return (
    <>
      <hr className="my-[56px] bg-grey-stroke h-4" />

      <div className="px-5">
        <h2 className="text-h-s text-grey-dark">분석 인사이트</h2>

        <div className="mt-10">
          {shouldShowAiInsight && (
            <div className="px-4 py-5 rounded-lg bg-grey-divider mb-10">
              <div className="flex items-center gap-2">
                <img src="/assets/icons/ai.svg" alt="" />
                <span className="text-body-m">AI 인사이트</span>
              </div>

              {aiInsight.headline && <p className="mt-5">{aiInsight.headline}</p>}
              {aiInsight.body && <p className="mt-2">{aiInsight.body}</p>}

              <div className="bg-grey-stroke rounded-lg p-[10px] mt-5 flex items-start gap-2">
                <img src="/assets/icons/info.svg" alt="" />
                <p className="text-label-m text-grey-light">
                  AI 인사이트는 투표 데이터를 기반으로 자동 생성된 분석이에요. 개인의 가치관과 다를 수 있으니 참고만
                  해주세요.
                </p>
              </div>
            </div>
          )}

          <div>
            {voteUserType === "member-voted" && <span className="text-body-s text-grey-light">나의 선택</span>}

            <div className="mt-5 flex flex-col gap-2">
              {resultOptions.map((option) => {
                const isPrimary = option.optionId === insightPrimaryOptionId;
                return (
                  <div
                    key={option.optionId}
                    className={`text-body-s p-4 text-grey-black rounded-lg w-full text-left text-nowrap ${isPrimary ? "bg-primary-light" : "bg-grey-stroke"}`}
                    style={{ width: `calc(100% * ${option.ratio / 100})` }}
                  >
                    {option.label} ({option.ratio}%)
                  </div>
                );
              })}
            </div>

            <p className="text-label-m mt-3">
              총 <span className="text-primary">{participantCount}</span>명이 선택했어요
            </p>
          </div>

          <hr className="h-[2px] bg-grey-divider my-10" />

          <div className="relative">
            <div className={isGuest ? "blur-md pointer-events-none select-none" : undefined}>
              <div>
                <span className="text-body-s text-grey-light">성별 분포</span>
                <div className="mt-5">
                  <GenderDonutChart primary={genderChartProps.primary} secondary={genderChartProps.secondary} />
                </div>
              </div>

              <hr className="h-[2px] bg-grey-divider my-10" />

              <div>
                <span className="text-body-s text-grey-light">연령대별 분포</span>
                <div className="mt-5">
                  <AgeBarChart groups={ageGroups} />
                </div>
              </div>
            </div>

            {isGuest && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-11/12 bg-white rounded-2xl shadow-lg">
                  <LockedContentOverlay />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
