import { AgeBarChart } from "@base/ui/AgeBarChart";
import { GenderDonutChart } from "@base/ui/DonutChart";
import { Dropdown } from "@base/ui/Dropdown";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/votes/$voteId")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative">
      <header className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button type="button">
            <img src="/assets/icons/arrow-left.svg" alt="뒤로가기" />
          </button>
          <h1 className="text-title-m text-grey-black">투표 상세</h1>
        </div>

        <button type="button">
          <img src="/assets/icons/share.svg" alt="공유하기" />
        </button>
      </header>

      <main className="pb-32" style={{ paddingBottom: "calc(8rem + env(safe-area-inset-bottom, 0px))" }}>
        {/* Content */}
        <div className="px-5 py-4">
          <h2 className="text-h-s">직장인 점심시간 혼밥 vs 같이 먹기</h2>
          <div className="text-label-m text-grey-purple mt-2">2026.04.14 13:49</div>
          <p className="text-grey-dark text-body-s my-5">
            저는 혼자 밥 먹는 게 편한데 회사에서 막내라 혼자 밥 먹겠다고 하기 눈치보여요ㅠㅠ 혼밥하고 싶다고 말씀드려도
            될까요?
          </p>
          <img src="https://picsum.photos/400/250" alt="" />

          {/* Vote */}
          <div className="px-4 py-5 rounded-[20px] border border-grey-stroke mt-5">
            <div className="flex items-center gap-2">
              <img src="/assets/icons/vote-s.svg" alt="" />
              <span className="text-title-s leading-none">투표</span>
            </div>

            <div className="mt-2 flex flex-col gap-2 items-end">
              <button type="button" className="text-label-s text-grey-light">
                다시 투표하기
              </button>

              <button
                type="button"
                className="text-body-s p-4 text-grey-divider rounded-lg bg-grey-stroke w-full text-left relative overflow-hidden"
              >
                <span className="absolute inset-y-0 left-0 bg-primary rounded-lg" style={{ width: "70%" }} />
                <span className="relative z-10">혼밥이 편하다</span>
              </button>
              <button
                type="button"
                className="text-body-s p-4 text-grey-black rounded-lg bg-grey-stroke w-full text-left relative overflow-hidden"
              >
                <span className="absolute inset-y-0 left-0 bg-grey-disabled rounded-lg" style={{ width: "30%" }} />
                <span className="relative z-10">그래도 밥은 같이 먹는게 맞다</span>
              </button>
              {/* <button
                type="button"
                className="text-body-s p-4 text-grey-black rounded-lg bg-grey-stroke w-full text-left"
              >
                그래도 밥은 같이 먹는게 맞다
              </button> */}
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <img src="/assets/icons/pple.svg" alt="" />
                <span className="text-label-s text-grey-light">31명 참여</span>
              </span>

              <span className="flex items-center gap-[6px] text-error">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                  <title>남은 시간</title>
                  <circle cx="8" cy="8" r="5.4" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M8 5V8L10.2 10.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                <span className="text-label-s">11:23:47 남음</span>
              </span>
            </div>
          </div>

          {/* Emoji */}
          <div className="mt-5 flex items-center gap-4">
            <Dropdown
              trigger={
                <button type="button" className="flex items-center gap-2">
                  <img src="/assets/icons/smile.svg" alt="이모지 선택" />
                  <span className="text-label-m text-grey-dark">56</span>
                </button>
              }
            >
              <div className="flex gap-6">
                <button type="button" className="flex flex-col items-center gap-1">
                  <img src="/assets/images/emoji/smiling-face.png" alt="" className="w-6 h-6" />
                  <span className="text-label-s text-grey-light">21</span>
                </button>

                <button type="button" className="flex flex-col items-center gap-1">
                  <img src="/assets/images/emoji/crying-face.png" alt="" className="w-6 h-6" />
                  <span className="text-label-s text-grey-light">21</span>
                </button>

                <button type="button" className="flex flex-col items-center gap-1">
                  <img src="/assets/images/emoji/enraged-face.png" alt="" className="w-6 h-6" />
                  <span className="text-label-s text-grey-light">21</span>
                </button>

                <button type="button" className="flex flex-col items-center gap-1">
                  <img src="/assets/images/emoji/smiling-face-with-heart-eyes.png" alt="" className="w-6 h-6" />
                  <span className="text-label-s text-grey-light">21</span>
                </button>
              </div>
            </Dropdown>

            <button type="button" className="flex items-center gap-2">
              <img src="/assets/icons/chat.svg" alt="채팅 보기" />
              <span className="text-label-m text-grey-dark">56</span>
            </button>
          </div>
        </div>

        <hr className="my-[56px] bg-grey-stroke h-4" />

        {/* Insight */}
        <div className="px-5">
          <h2 className="text-h-s text-grey-dark">분석 인사이트</h2>

          <div className="mt-10">
            <div>
              <span className="text-body-s text-grey-light">나의 선택</span>

              <div className="mt-5 flex flex-col gap-2">
                <div
                  className="text-body-s p-4 text-grey-black rounded-lg bg-grey-stroke w-full text-left text-nowrap"
                  style={{
                    width: "calc(100% * 0.7)",
                  }}
                >
                  혼밥이 편하다 (70%)
                </div>
                <div
                  className="text-body-s p-4 text-grey-black rounded-lg bg-primary-light w-full text-left text-nowrap"
                  style={{
                    width: "calc(100% * 0.3)",
                  }}
                >
                  그래도 밥은 같이 먹는게 맞다 (30%)
                </div>
              </div>
            </div>

            <hr className="h-[2px] bg-grey-divider my-10" />

            <div>
              <span className="text-body-s text-grey-light">성별 분포</span>
              <div className="mt-5">
                <GenderDonutChart
                  primary={{ label: "여성", count: 96, color: "#9A9AF6" }}
                  secondary={{ label: "남성", count: 60, color: "#EDECEF" }}
                />
              </div>
            </div>

            <hr className="h-[2px] bg-grey-divider my-10" />

            <div>
              <span className="text-body-s text-grey-light">연령대별 분포</span>
              <div className="mt-5">
                <AgeBarChart
                  groups={[
                    { label: "20대", percentage: 28, isPrimary: true, isMyGroup: true },
                    { label: "30대", percentage: 52 },
                    { label: "40대", percentage: 20 },
                  ]}
                />
              </div>
            </div>

            <div className="px-4 py-5 rounded-lg mt-10 bg-grey-divider">
              <div className="flex items-center gap-2">
                <img src="/assets/icons/ai.svg" alt="" />
                <span className="text-body-m">AI 인사이트</span>
              </div>

              <p className="mt-5">
                20대 여성 그룹에서 "같이 밥먹기"를 선택한 비율이 71%로 가장 높게 나타났어요. MZ 세대를 중심으로 혼밥
                문화가 확산되는 트렌드가 반영된 결과예요.
              </p>

              <div className="bg-grey-stroke rounded-lg p-[10px] mt-5 flex items-start gap-2">
                <img src="/assets/icons/info.svg" alt="" />
                <p className="text-label-m text-grey-light">
                  AI 인사이트는 투표 데이터를 기반으로 자동 생성된 분석이에요. 개인의 가치관과 다를 수 있으니 참고만
                  해주세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-5 pt-[6px] flex gap-2 bg-white"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 6px)",
          boxShadow: "0px -1px 4px 0px rgba(0, 0, 0, 0.05)",
        }}
      >
        <button type="button" className="flex-[1.5] py-4 text-center text-body-m text-white bg-primary rounded-lg">
          채팅 바로가기
        </button>
        <button
          type="button"
          className="flex-1 py-4 text-center text-body-m text-grey-light border border-grey-stroke rounded-lg"
        >
          공유하기
        </button>
      </footer>
    </div>
  );
}
