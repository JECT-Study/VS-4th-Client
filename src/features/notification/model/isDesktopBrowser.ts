/** 모바일 UA가 아니면 데스크탑 브라우저로 본다. */
export const isDesktopBrowser = (): boolean => {
  if (typeof navigator === "undefined") return false;

  const userAgent = navigator.userAgent.toLowerCase();
  return !/android|iphone|ipad|ipod/i.test(userAgent);
};