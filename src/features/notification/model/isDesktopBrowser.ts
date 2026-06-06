/** 데스크탑(마우스/트랙패드) 환경인지 동기 판별한다. */
export const isDesktopBrowser = (): boolean => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  const hasHover = window.matchMedia("(hover: hover)").matches;
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

  // UA가 모바일이어도 실제 입력 장치가 마우스/트랙패드면 데스크탑으로 본다.
  if (hasHover && hasFinePointer) {
    return true;
  }

  const userAgent = navigator.userAgent.toLowerCase();
  return !/android|iphone|ipad|ipod/i.test(userAgent);
};