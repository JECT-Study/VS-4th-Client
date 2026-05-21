import { Modal } from "@base/ui/Modal";

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
                        <h3 className="text-title-m font-bold mb-2">현재 버전에서는 알림을 지원하지 않아요</h3>
                        <p className="text-body-m text-grey-light mb-6 text-center">
                            iOS 16.4 이상으로 업데이트 후<br />이용해 주세요
                        </p>
                        <button
                            onClick={onClose}
                            className="w-full bg-primary-purple text-white py-3.5 rounded-[12px] font-bold text-body-m"
                        >
                            확인
                        </button>
                    </>
                ) : (
                    <>
                        <div className="mb-4">
                            <img src="/assets/icons/home-add.svg" alt="홈 화면 추가" className="w-12 h-12" />
                        </div>
                        <h3 className="text-title-m font-bold mb-6 text-center leading-tight">
                            안정적인 알림 수신을 위해<br />홈 화면에 앱을 추가해 주세요
                        </h3>

                        {os === "ios" && (
                            <div className="bg-grey-bg rounded-lg p-4 w-full text-left mb-6 flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <img src="/assets/icons/share-ios.svg" alt="공유" className="w-6 h-6" />
                                    <span className="text-body-s text-grey-dark">하단의 공유 또는 더보기 탭</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <img src="/assets/icons/add-box.svg" alt="추가" className="w-6 h-6" />
                                    <span className="text-body-s text-grey-dark">홈 화면에 추가 선택</span>
                                </div>
                            </div>
                        )}

                        <div className="w-full flex flex-col gap-2">
                            <button
                                onClick={os === "android" ? onConfirm : onClose}
                                className="w-full bg-primary-purple text-white py-3.5 rounded-[12px] font-bold text-body-m"
                            >
                                {os === "ios" ? "확인했어요" : "홈 화면에 추가하기"}
                            </button>
                            {os === "android" && (
                                <button
                                    onClick={onClose}
                                    className="w-full text-grey-light py-2 text-body-s mt-1 font-medium"
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