import { Modal } from "@base/ui/Modal";

function HomeAddIcon() {
  return <img src="/assets/icons/ic_add_to_home.svg" alt="" className="h-7 w-7" />;
}

function ShareIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 14V4" stroke="#434346" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M8.5 7.5L12 4L15.5 7.5"
        stroke="#434346"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 10.5H6.5C5.67157 10.5 5 11.1716 5 12V18.5C5 19.3284 5.67157 20 6.5 20H17.5C18.3284 20 19 19.3284 19 18.5V12C19 11.1716 18.3284 10.5 17.5 10.5H17"
        stroke="#434346"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AddBoxIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="3" stroke="#434346" strokeWidth="1.7" />
      <path d="M12 8.5V15.5" stroke="#434346" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M8.5 12H15.5" stroke="#434346" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

interface A2HSModalProps {
  isOpen: boolean;
  os: "android" | "ios" | "ios-outdated" | "other";
  onClose: () => void;
  onConfirm: () => void;
}

export function A2HSModal({ isOpen, os, onClose, onConfirm }: A2HSModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="p-6">
      <div className="flex flex-col items-center">
        {os === "ios-outdated" ? (
          <>
            <h3 className="mb-2 font-bold text-title-m">현재 버전에서는 알림을 지원하지 않아요</h3>
            <p className="mb-6 text-center text-body-m text-grey-light">
              iOS 16.4 이상으로 업데이트 후<br />
              이용해 주세요
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-primary text-white py-3.5 rounded-[12px] font-bold text-body-m"
            >
              확인
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center w-12 h-12 mb-2" aria-label="홈 화면 추가">
              <HomeAddIcon />
            </div>
            <h3 className="mb-6 font-bold leading-tight text-center text-title-m">
              안정적인 알림 수신을 위해
              <br />홈 화면에 앱을 추가해 주세요
            </h3>

            {os === "ios" && (
              <div className="flex flex-col w-full gap-3 p-4 mb-6 text-left rounded-lg bg-grey-divider">
                <div className="flex items-center gap-3">
                  <ShareIcon />
                  <span className="text-body-s text-grey-dark">하단의 공유 또는 더보기 탭</span>
                </div>
                <div className="flex items-center gap-3">
                  <AddBoxIcon />
                  <span className="text-body-s text-grey-dark">홈 화면에 추가 선택</span>
                </div>
              </div>
            )}

            <div className="flex flex-col w-full gap-2">
              <button
                type="button"
                onClick={os === "android" ? onConfirm : onClose}
                className="w-full bg-primary text-white py-3.5 rounded-[12px] font-bold text-body-m"
              >
                {os === "ios" ? "확인했어요" : "홈 화면에 추가하기"}
              </button>
              {os === "android" && (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2 mt-1 font-medium text-grey-light text-body-s"
                >
                  나중에 할게요
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
